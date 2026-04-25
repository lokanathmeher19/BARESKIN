import { useCurrency } from '../context/CurrencyContext';
import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Package, Truck, CheckCircle, Search, Archive, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const { formatPrice } = useCurrency();

    const { user, token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, token, navigate]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const res = await api.put(`/orders/${orderId}/cancel`);
            if (res.data.success) {
                toast.success('Order cancelled successfully');
                setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: 'Cancelled', orderStatus: 'Cancelled' } : o));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleReturnOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to return this order?')) return;
        try {
            const res = await api.put(`/orders/${orderId}/return`);
            if (res.data.success) {
                toast.success('Return requested successfully');
                setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: 'Return Requested' } : o));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request return');
        }
    };

    if (loading) return (
        <div className="flex flex-col h-screen items-center justify-center gap-6 bg-white animate-pulse">
            <div className="p-8 bg-zinc-50 rounded-full">
                <Archive size={40} className="text-zinc-200" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 italic">Syncing Orders...</span>
        </div>
    );

    return (
        <div className="max-w-[1440px] mx-auto pt-32 md:pt-48 pb-32 px-4 md:px-10 lg:px-20 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 text-center md:text-left">
                <div>
                    <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">Purchase History</span>
                    <h1 className="text-4xl md:text-7xl">My Orders<span className="text-[#007aff]">.</span></h1>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-4">
                    <div className="px-6 py-3 bg-zinc-50 rounded-full flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account Active</span>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-24 md:py-40 bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-100 max-w-2xl mx-auto flex flex-col items-center">
                    <ShoppingBag className="mx-auto mb-10 text-zinc-200" size={80} strokeWidth={1} />
                    <p className="text-zinc-400 font-black uppercase italic tracking-[0.3em] text-sm mb-12">No Orders Found</p>
                    <Link to="/products" className="luxe-button px-14 py-6">
                        <Package size={18} /> Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="tech-card overflow-hidden group hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700">
                            {/* Order Header */}
                            <div className="bg-zinc-50 border-b border-zinc-100 p-6 sm:px-10 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex gap-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order Placed</span>
                                        <span className="text-xs font-black italic text-zinc-600 uppercase">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total</span>
                                        <span className="text-xs font-black italic text-zinc-600">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ship To</span>
                                        <span className="text-xs font-black italic text-[#007aff] uppercase underline underline-offset-4 cursor-pointer">{user.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Order # {order._id.toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-8 sm:p-12 space-y-12">
                                {order.products && order.products.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-10">
                                        <div className="w-24 h-24 bg-zinc-50 rounded-2xl p-2 shrink-0 overflow-hidden">
                                            <img 
                                                src={item.product?.image || 'https://via.placeholder.com/150'} 
                                                alt={item.product?.name} 
                                                className="w-full h-full object-contain mix-blend-darken scale-110 group-hover:scale-125 transition-transform duration-1000" 
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col sm:flex-row justify-between items-center gap-8 w-full">
                                            <div className="space-y-2 text-center sm:text-left">
                                                <h4 className="text-lg font-black italic uppercase tracking-tight text-black flex items-center gap-3 justify-center sm:justify-start">
                                                    {item.product?.name || 'BareSkin Product'}
                                                </h4>
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                                    <span className="px-3 py-1 bg-zinc-100 rounded-lg text-[9px] font-black uppercase text-zinc-400 tracking-widest">Qty: {item.quantity}</span>
                                                    <span className="text-[9px] font-black uppercase text-[#007aff] tracking-widest italic">Sold by: BareSkin Official</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center sm:items-end gap-6 shrink-0 w-full lg:w-auto">
                                                {/* Timeline Logic */}
                                                <div className="w-full max-w-lg">
                                                    <div className="flex justify-between items-center mb-8 relative">
                                                        {/* Progress Line */}
                                                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-100 -translate-y-1/2"></div>
                                                        <div className={`absolute top-1/2 left-0 h-[1px] bg-[#007aff] -translate-y-1/2 transition-all duration-1000 ${
                                                            (order.orderStatus === 'Delivered') ? 'w-full' : 
                                                            (order.orderStatus === 'Out for Delivery') ? 'w-[75%]' : 
                                                             (order.orderStatus === 'Shipped') ? 'w-[50%]' : 
                                                             (order.orderStatus === 'Processing') ? 'w-[25%]' : 'w-[0%]'
                                                        }`}></div>

                                                        {[
                                                            { label: 'Placed', icon: ShoppingBag, status: 'Order Placed' },
                                                            { label: 'Processing', icon: Zap, status: 'Processing' },
                                                            { label: 'Shipped', icon: Truck, status: 'Shipped' },
                                                            { label: 'Out for Delivery', icon: Package, status: 'Out for Delivery' },
                                                            { label: 'Delivered', icon: CheckCircle, status: 'Delivered' }
                                                        ].map((step, i) => {
                                                            const statusOrder = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                                                            const currentIdx = statusOrder.indexOf(order.orderStatus || 'Order Placed');
                                                            const isPast = i <= currentIdx;
                                                            const isCurrent = i === currentIdx;

                                                            return (
                                                                 <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                                                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                                         isPast ? 'bg-[#007aff] text-white shadow-lg shadow-[#007aff]/20' : 'bg-white border border-zinc-200 text-zinc-300'
                                                                     } ${isCurrent ? 'scale-125 ring-4 ring-[#007aff]/10' : ''}`}>
                                                                         <step.icon size={12} />
                                                                     </div>
                                                                     <span className={`text-[8px] font-black uppercase tracking-widest ${isPast ? 'text-black' : 'text-zinc-300'}`}>{step.label}</span>
                                                                 </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => toast.success('Initializing Global Tracking System...', { 
                                                        icon: '📍',
                                                        style: { background: '#000', color: '#fff', borderRadius: '15px', fontSize: '10px', fontStyle: 'italic', fontWeight: '900' }
                                                    })}
                                                    className="w-full sm:w-auto px-8 py-3 bg-zinc-50 hover:bg-black hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest italic border border-zinc-100 transition-all flex items-center justify-center gap-3"
                                                >
                                                    <Search size={14} /> Track Delivery
                                                </button>

                                                {/* Return / Cancel Order Buttons */}
                                                {(order.paymentStatus === 'Paid' || order.paymentStatus === 'Pending') && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                                    <button onClick={() => handleCancelOrder(order._id)} className="w-full sm:w-auto px-8 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-3">
                                                        Cancel Order
                                                    </button>
                                                )}
                                                {order.orderStatus === 'Delivered' && (
                                                    <button onClick={() => handleReturnOrder(order._id)} className="w-full sm:w-auto px-8 py-3 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-3">
                                                        Request Return
                                                    </button>
                                                )}
                                                {order.paymentStatus === 'Cancelled' && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Order Cancelled</span>
                                                )}
                                                {order.paymentStatus === 'Return Requested' && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 italic">Return Requested</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
