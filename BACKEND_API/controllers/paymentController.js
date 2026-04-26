const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Subscription = require('../models/Subscription');
const sendEmail = require('../utils/sendEmail');

// Initialize Razorpay
const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// @desc    Create a new payment order
const createOrder = async (req, res) => {
    try {
        const { amount, products, userId, pointsToRedeem = 0 } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        let finalAmount = amount;
        
        if (userId && pointsToRedeem > 0) {
            const User = require('../models/User');
            const user = await User.findById(userId);
            if (user) {
                if (pointsToRedeem > user.points) {
                    return res.status(400).json({ success: false, message: 'Not enough points to redeem' });
                }
                // 1 point = 1 Rupee discount
                finalAmount = Math.max(1, amount - pointsToRedeem); 
            }
        }

        // --- REAL-TIME STOCK RESERVATION (LOCKING) ---
        if (products && products.length > 0) {
            for (const p of products) {
                const productItem = await Product.findById(p._id || p.id);
                if (!productItem) continue;

                if (p.selectedSize && productItem.variants && productItem.variants.length > 0) {
                    const variant = productItem.variants.find(v => v.size === p.selectedSize);
                    if (variant && variant.stock < p.qty) {
                        return res.status(400).json({ success: false, message: `Not enough stock for ${productItem.name} - ${p.selectedSize}` });
                    }
                } else {
                    if (productItem.stock < p.qty) {
                        return res.status(400).json({ success: false, message: `Not enough stock for ${productItem.name}` });
                    }
                }
            }

            // Decrement Stock
            for (const p of products) {
                const productItem = await Product.findById(p._id || p.id);
                if (!productItem) continue;

                if (p.selectedSize && productItem.variants && productItem.variants.length > 0) {
                    const variant = productItem.variants.find(v => v.size === p.selectedSize);
                    if (variant) variant.stock -= p.qty;
                } else {
                    productItem.stock -= p.qty;
                }
                await productItem.save();
            }
        }

        let order;
        const keyId = process.env.RAZORPAY_KEY_ID || '';
        
        if (keyId.includes('your_key') || keyId === 'rzp_test_your_key_id_here' || !keyId) {
            order = {
                id: `order_mock_${Date.now()}`,
                amount: Math.round(finalAmount * 100),
                currency: 'INR'
            };
        } else {
            const razorpayInstance = getRazorpayInstance();
            const options = {
                amount: Math.round(finalAmount * 100), 
                currency: 'INR',
                receipt: `receipt_order_${Date.now()}`,
            };
            order = await razorpayInstance.orders.create(options);
        }

        // Create Pending Order
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await Order.create({
            user: userId || undefined,
            totalPrice: finalAmount,
            paymentStatus: 'Pending',
            razorpayOrderId: order.id,
            expiresAt,
            pointsUsed: pointsToRedeem,
            products: products ? products.map(p => ({
                product: p._id || p.id,
                quantity: p.qty,
                selectedSize: p.selectedSize
            })) : []
        });

        res.status(200).json({
            success: true,
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Could not create order', error: error.message });
    }
};

// @desc    Verify Razorpay payment signature and SAVE order to DB
const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            userId,
            guestEmail,
            guestName,
            products,
            totalPrice,
            address 
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        let isAuthentic = expectedSignature === razorpay_signature;
        
        if (razorpay_order_id && razorpay_order_id.startsWith('order_mock_')) {
            isAuthentic = true;
        }

        if (isAuthentic) {
            // Find the pending order created during createOrder
            let newOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });

            if (newOrder) {
                newOrder.paymentStatus = 'Paid';
                newOrder.address = address || 'Default Address';
                newOrder.guestEmail = userId ? undefined : guestEmail;
                newOrder.guestName = userId ? undefined : guestName;
                newOrder.expiresAt = undefined; // clear expiration
                await newOrder.save();
            } else {
                // Fallback in case createOrder didn't create it
                newOrder = await Order.create({
                    user: userId || undefined,
                    guestEmail: userId ? undefined : guestEmail,
                    guestName: userId ? undefined : guestName,
                    products: products.map(p => ({
                        product: p._id || p.id,
                        quantity: p.qty,
                        selectedSize: p.selectedSize
                    })),
                    totalPrice,
                    paymentStatus: 'Paid',
                    address: address || 'Default Address',
                    razorpayOrderId: razorpay_order_id
                });
            }

            // HANDLE SUBSCRIPTIONS
            const subscriptionItems = products.filter(p => p.isSubscription);
            if (subscriptionItems.length > 0) {
                await Promise.all(subscriptionItems.map(item => {
                    const nextBilling = new Date();
                    nextBilling.setMonth(nextBilling.getMonth() + 1); // Default to monthly

                    return Subscription.create({
                        user: userId,
                        product: item._id || item.id,
                        order: newOrder._id,
                        status: 'Active',
                        frequency: 'Monthly',
                        nextBillingDate: nextBilling,
                        priceAtSubscription: item.price
                    });
                }));
            }

            // Send Order Confirmation Email
            try {
                let targetEmail = guestEmail;
                let targetName = guestName || 'Guest Customer';

                if (userId) {
                    const User = require('../models/User');
                    const userObj = await User.findById(userId);
                    if (userObj) {
                        targetEmail = userObj.email;
                        targetName = userObj.name;
                        
                        // POINTS DEDUCTION & ACCRUAL
                        const pointsUsed = newOrder.pointsUsed || 0;
                        // Accrue points: 1 point per ₹10 spent
                        const pointsEarned = Math.floor(totalPrice / 10);
                        
                        userObj.points = Math.max(0, userObj.points - pointsUsed + pointsEarned);
                        await userObj.save();
                        
                        newOrder.pointsEarned = pointsEarned;
                        await newOrder.save();
                    }
                }

                if (targetEmail) {
                    await sendEmail({
                        email: targetEmail,
                        subject: `Order Confirmation - #${newOrder._id.toString().substring(0, 8).toUpperCase()}`,
                        html: `
                          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                            <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
                            <h2>Thank you for your order, ${targetName}!</h2>
                            <p>Your order <strong>#${newOrder._id.toString().substring(0, 8).toUpperCase()}</strong> has been successfully placed and paid.</p>
                            <p><strong>Total Price:</strong> ₹${totalPrice.toLocaleString()}</p>
                            <p><strong>Shipping To:</strong> ${address || 'Default Address'}</p>
                            ${userId ? '<p>You can track your order status in your dashboard.</p>' : ''}
                            <br/>
                            <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
                          </div>
                        `
                    });
                }
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified and Order created!',
                order: newOrder,
                subscriptionsCreated: subscriptionItems.length
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature, payment verification failed'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Server error during payment verification' });
    }
};


const createCodOrder = async (req, res) => {
    try {
        const { amount, products, userId, guestEmail, guestName, address, pointsToRedeem = 0 } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        let finalAmount = amount;
        let userObj = null;

        const currentUserId = req.user?._id || userId;

        if (currentUserId && pointsToRedeem > 0) {
            const User = require('../models/User');
            userObj = await User.findById(currentUserId);
            if (userObj) {
                if (pointsToRedeem > userObj.points) {
                    return res.status(400).json({ success: false, message: 'Not enough points to redeem' });
                }
                finalAmount = Math.max(1, amount - pointsToRedeem);
            }
        }

        // Stock Check and Reservation
        const Product = require('../models/Product');
        const Order = require('../models/Order');
        
        if (products && products.length > 0) {
            for (const p of products) {
                const productItem = await Product.findById(p._id || p.id);
                if (!productItem) continue;

                if (p.selectedSize && productItem.variants && productItem.variants.length > 0) {
                    const variant = productItem.variants.find(v => v.size === p.selectedSize);
                    if (variant && variant.stock < p.qty) {
                        return res.status(400).json({ success: false, message: `Not enough stock for ${productItem.name} - ${p.selectedSize}` });
                    }
                } else {
                    if (productItem.stock < p.qty) {
                        return res.status(400).json({ success: false, message: `Not enough stock for ${productItem.name}` });
                    }
                }
            }

            // Decrement Stock
            for (const p of products) {
                const productItem = await Product.findById(p._id || p.id);
                if (!productItem) continue;

                if (p.selectedSize && productItem.variants && productItem.variants.length > 0) {
                    const variant = productItem.variants.find(v => v.size === p.selectedSize);
                    if (variant) variant.stock -= p.qty;
                } else {
                    productItem.stock -= p.qty;
                }
                await productItem.save();
            }
        }

        // Create COD Order
        const newOrder = await Order.create({
            user: currentUserId || undefined,
            guestEmail: currentUserId ? undefined : guestEmail,
            guestName: currentUserId ? undefined : guestName,
            products: products ? products.map(p => ({
                product: p._id || p.id,
                quantity: p.qty,
                selectedSize: p.selectedSize
            })) : [],
            totalPrice: finalAmount,
            paymentStatus: 'COD - Pending',
            address: address || 'Default Address',
            pointsUsed: pointsToRedeem
        });

        // Accrue points if logged in
        if (currentUserId) {
            const User = require('../models/User');
            if (!userObj) userObj = await User.findById(currentUserId);
            if (userObj) {
                const pointsUsed = newOrder.pointsUsed || 0;
                const pointsEarned = Math.floor(finalAmount / 10);
                
                userObj.points = Math.max(0, userObj.points - pointsUsed + pointsEarned);
                await userObj.save();
                
                newOrder.pointsEarned = pointsEarned;
                await newOrder.save();
            }
        }

        // Send Email
        try {
            const sendEmail = require('../utils/sendEmail');
            let targetEmail = guestEmail;
            let targetName = guestName || 'Customer';

            if (currentUserId) {
                const User = require('../models/User');
                const u = await User.findById(currentUserId);
                if (u) {
                    targetEmail = u.email;
                    targetName = u.name;
                }
            }

            if (targetEmail) {
                await sendEmail({
                    email: targetEmail,
                    subject: `Order Confirmation (COD) - #${newOrder._id.toString().substring(0, 8).toUpperCase()}`,
                    html: `
                      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                        <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
                        <h2>Thank you for your order, ${targetName}!</h2>
                        <p>Your order <strong>#${newOrder._id.toString().substring(0, 8).toUpperCase()}</strong> has been successfully placed using <strong>Cash on Delivery</strong>.</p>
                        <p><strong>Total Price to Pay:</strong> ₹${finalAmount.toLocaleString()}</p>
                        <p><strong>Shipping To:</strong> ${address || 'Default Address'}</p>
                        ${currentUserId ? '<p>You can track your order status in your dashboard.</p>' : ''}
                        <br/>
                        <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
                      </div>
                    `
                });
            }
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        }

        res.status(201).json({ success: true, message: 'COD Order placed successfully', order: newOrder });

    } catch (error) {
        console.error('Error creating COD order:', error);
        res.status(500).json({ success: false, message: 'Could not place order', error: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment
,
    createCodOrder
};
