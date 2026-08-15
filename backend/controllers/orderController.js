const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { products, address, paymentStatus } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    if (!address) {
      return res.status(400).json({ success: false, message: 'Please provide a shipping address' });
    }

    let calculatedTotalPrice = 0;

    // Calculate total price securely and decrement stock
    for (const item of products) {
      const productItem = await Product.findById(item.product);
      if (!productItem) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      
      let itemPrice = productItem.price;
      
      if (item.selectedSize && productItem.variants && productItem.variants.length > 0) {
        const variant = productItem.variants.find(v => v.size === item.selectedSize);
        if (variant) {
          itemPrice = variant.price;
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      } else {
        productItem.stock = Math.max(0, productItem.stock - item.quantity);
      }
      
      await productItem.save();
      calculatedTotalPrice += itemPrice * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      address,
      paymentStatus: paymentStatus || 'Pending',
      totalPrice: calculatedTotalPrice,
    });

    // Send Order Confirmation Email
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmation - #${order._id.toString().substring(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
            <h2>Thank you for your order!</h2>
            <p>Your order <strong>#${order._id.toString().substring(0, 8).toUpperCase()}</strong> has been successfully placed.</p>
            <p><strong>Total Price:</strong> ₹${calculatedTotalPrice.toLocaleString()}</p>
            <p><strong>Shipping To:</strong> ${address}</p>
            <p>You can track your order status in your dashboard.</p>
            <br/>
            <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name price image');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').populate('products.product', 'name price image');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const oldPaymentStatus = order.paymentStatus;
    const oldOrderStatus = order.orderStatus;
    
    if (req.body.status) order.paymentStatus = req.body.status;
    if (req.body.orderStatus) order.orderStatus = req.body.orderStatus;
    
    const updatedOrder = await order.save();

    // Restore inventory if refunded or cancelled by admin
    if ((order.paymentStatus === 'Refunded' || order.paymentStatus === 'Cancelled') && oldPaymentStatus !== 'Refunded' && oldPaymentStatus !== 'Cancelled') {
      for (const item of order.products) {
        const p = await Product.findById(item.product);
        if (p) {
          if (item.selectedSize && p.variants && p.variants.length > 0) {
            const variant = p.variants.find(v => v.size === item.selectedSize);
            if (variant) variant.stock += item.quantity;
          } else {
            p.stock += item.quantity;
          }
          await p.save();
        }
      }
    }
    
    // Send Tracking Status Notification
    if (req.body.orderStatus && req.body.orderStatus !== oldOrderStatus) {
      try {
        await order.populate('user', 'email name');
        let targetEmail = order.user?.email || order.guestEmail;
        let targetName = order.user?.name || order.guestName || 'Customer';
        
        if (targetEmail) {
          const sendEmail = require('../utils/sendEmail');
          await sendEmail({
            email: targetEmail,
            subject: `BareSkin Order Update: ${req.body.orderStatus} - #${order._id.toString().substring(0, 8).toUpperCase()}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
                <h2>Hi, ${targetName}!</h2>
                <p>Your order <strong>#${order._id.toString().substring(0, 8).toUpperCase()}</strong> status has been updated to: <strong>${req.body.orderStatus}</strong>.</p>
                <p>Thank you for shopping with BareSkin!</p>
                <br/>
                <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
              </div>
            `
          });
        }
      } catch (emailError) {
        console.error('Failed to send tracking email:', emailError);
      }
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    User cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (order.paymentStatus === 'Shipped' || order.paymentStatus === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an order that is already shipped or delivered' });
    }

    order.paymentStatus = 'Cancelled';
    const updatedOrder = await order.save();
    
    // Restore inventory
    for (const item of order.products) {
      const p = await Product.findById(item.product);
      if (p) {
        if (item.selectedSize && p.variants && p.variants.length > 0) {
          const variant = p.variants.find(v => v.size === item.selectedSize);
          if (variant) variant.stock += item.quantity;
        } else {
          p.stock += item.quantity;
        }
        await p.save();
      }
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    User request return
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturn = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (order.paymentStatus !== 'Delivered') {
      return res.status(400).json({ success: false, message: 'You can only return delivered items' });
    }

    order.paymentStatus = 'Return Requested';
    const updatedOrder = await order.save();
    
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
};
