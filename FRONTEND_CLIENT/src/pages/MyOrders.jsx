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

    const getEstimatedDeliveryDateForOrder = (createdAt) => {
        if (!createdAt) return "";
        const targetDate = new Date(createdAt);
        targetDate.setDate(targetDate.getDate() + 3);
        
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return targetDate.toLocaleDateString('en-IN', options);
    };

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
                                    <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-10 py-6 border-b border-zinc-100 last:border-none">
                                        {/* Product Image */}
                                        <div className="w-28 h-28 bg-zinc-50 rounded-2xl p-3 shrink-0 overflow-hidden border border-zinc-100 flex items-center justify-center self-center md:self-auto">
                                            <img 
                                                src={item.product?.image || 'https://via.placeholder.com/150'} 
                                                alt={item.product?.name} 
                                                className="w-full h-full object-contain mix-blend-darken scale-105" 
                                            />
                                        </div>

                                        {/* Product Meta & Status */}
                                        <div className="flex-grow space-y-3 text-center md:text-left w-full">
                                            <h4 className="text-md font-black uppercase tracking-tight text-black hover:text-[#007aff] cursor-pointer" onClick={() => item.product?._id && navigate(`/product/${item.product._id}`)}>
                                                {item.product?.name || 'BareSkin Product'}
                                            </h4>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase text-zinc-400">
                                                <span className="bg-zinc-100 px-2.5 py-1 rounded-lg">Qty: {item.quantity}</span>
                                                {item.selectedSize && <span className="bg-[#007aff]/5 text-[#007aff] px-2.5 py-1 rounded-lg italic">Size: {item.selectedSize}</span>}
                                            </div>
                                            
                                            {/* Arrival / Status Timeline (Amazon Style) */}
                                            <div className="pt-3 flex flex-col items-center md:items-start gap-1 w-full">
                                                {order.paymentStatus === 'Cancelled' ? (
                                                    <span className="text-xs font-black uppercase text-red-600 flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full italic">
                                                        ● Order Cancelled
                                                    </span>
                                                ) : order.orderStatus === 'Delivered' ? (
                                                    <span className="text-xs font-black uppercase text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full italic">
                                                        ● Delivered on {getEstimatedDeliveryDateForOrder(order.createdAt)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold text-zinc-900">
                                                        Estimated Delivery: <span className="font-black underline decoration-[#007aff] decoration-2 underline-offset-4">{getEstimatedDeliveryDateForOrder(order.createdAt)}</span>
                                                    </span>
                                                )}
                                                <span className="text-[9px] font-black uppercase text-[#ffa41c] tracking-widest mt-1 bg-[#ffa41c]/5 px-2.5 py-0.5 rounded-md italic">
                                                    Status: {order.orderStatus || 'Processing'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Controls */}
                                        <div className="flex flex-row md:flex-col gap-3 justify-center md:justify-end w-full md:w-auto shrink-0 flex-wrap">
                                            <button 
                                                onClick={() => toast.success(`Tracking active: package is currently ${order.orderStatus || 'Processing'}.`, { 
                                                    icon: '📍',
                                                    style: { background: '#000', color: '#fff', borderRadius: '15px', fontSize: '10px', fontStyle: 'italic', fontWeight: '900' }
                                                })}
                                                className="px-6 py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow transition-all italic min-w-[140px] text-center"
                                            >
                                                Track Delivery
                                            </button>

                                            {(order.paymentStatus === 'Paid' || order.paymentStatus === 'Pending' || order.paymentStatus === 'COD - Pending') && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                                <button 
                                                    onClick={() => handleCancelOrder(order._id)} 
                                                    className="px-6 py-3 bg-zinc-100 hover:bg-red-50 text-zinc-900 hover:text-red-500 border border-zinc-200 hover:border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic min-w-[140px] text-center"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            
                                            {order.orderStatus === 'Delivered' && (
                                                <button 
                                                    onClick={() => handleReturnOrder(order._id)} 
                                                    className="px-6 py-3 bg-zinc-100 hover:bg-orange-50 text-zinc-900 hover:text-orange-500 border border-zinc-200 hover:border-orange-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic min-w-[140px] text-center"
                                                >
                                                    Return Item
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => navigate(`/product/${item.product?._id || ''}`)} 
                                                className="px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all italic min-w-[140px] text-center"
                                            >
                                                Review Product
                                            </button>
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
