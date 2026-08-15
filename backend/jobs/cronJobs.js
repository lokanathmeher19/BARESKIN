const cron = require('node-cron');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const Order = require('../models/Order');
const Product = require('../models/Product');

const initCronJobs = () => {
    // Run every hour to check for abandoned carts
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('[Cron Job] Checking for abandoned carts...');
            
            // Define timeframe: Cart updated between 2 and 24 hours ago
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Find users who have items in their cart, haven't been emailed yet, and their cart was last updated 2 to 24 hours ago
            const usersWithAbandonedCarts = await User.find({
                'cart.0': { $exists: true },
                cartUpdatedAt: { $lte: twoHoursAgo, $gte: twentyFourHoursAgo },
                abandonedCartEmailedAt: { $exists: false }
            });

            if (usersWithAbandonedCarts.length === 0) {
                console.log('[Cron Job] No abandoned carts found.');
                return;
            }

            console.log(`[Cron Job] Found ${usersWithAbandonedCarts.length} abandoned carts. Sending emails...`);

            for (const user of usersWithAbandonedCarts) {
                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'Did you forget something? - BareSkin',
                        html: `
                            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px;">
                                <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
                                <h2>Hi ${user.name},</h2>
                                <p>We noticed you left some premium skincare items in your cart.</p>
                                <p>Don't miss out on achieving your best skin. Complete your purchase before items sell out.</p>
                                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/cart" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Return to Cart</a>
                                <br/><br/>
                                <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
                            </div>
                        `
                    });
                    
                    // Mark as emailed
                    user.abandonedCartEmailedAt = Date.now();
                    await user.save();
                    
                } catch (emailErr) {
                    console.error(`Failed to send abandoned cart email to ${user.email}:`, emailErr);
                }
            }
        } catch (error) {
            console.error('Error in abandoned cart cron job:', error);
        }
    });

    // Run every minute to release expired stock reservations
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const expiredOrders = await Order.find({
                paymentStatus: 'Pending',
                expiresAt: { $lt: now }
            });

            if (expiredOrders.length === 0) return;

            console.log(`[Cron Job] Found ${expiredOrders.length} expired stock reservations. Releasing stock...`);

            for (const order of expiredOrders) {
                for (const item of order.products) {
                    const productItem = await Product.findById(item.product);
                    if (productItem) {
                        if (item.selectedSize && productItem.variants && productItem.variants.length > 0) {
                            const variant = productItem.variants.find(v => v.size === item.selectedSize);
                            if (variant) variant.stock += item.quantity;
                        } else {
                            productItem.stock += item.quantity;
                        }
                        await productItem.save();
                    }
                }
                order.paymentStatus = 'Expired';
                await order.save();
            }

            console.log(`[Cron Job] Successfully released stock for ${expiredOrders.length} expired orders.`);
        } catch (error) {
            console.error('[Cron Error] Failed to process expired orders:', error);
        }
    });

    console.log('Cron jobs initialized successfully.');
};

module.exports = initCronJobs;
