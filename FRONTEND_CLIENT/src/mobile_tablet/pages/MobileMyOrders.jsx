import { useCurrency } from '../../context/CurrencyContext';
import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag, Package, Archive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MobileMyOrders = () => {
    const { formatPrice } = useCurrency();
    const { user, token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getEstimatedDeliveryDateForOrder = (createdAt) => {
        if (!createdAt) return "";
        const targetDate = new Date(createdAt);
        targetDate.setDate(targetDate.getDate() + 3);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
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
                toast.success('Order cancelled');
                setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: 'Cancelled', orderStatus: 'Cancelled' } : o));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleReturnOrder = async (orderId) => {
        if (!window.confirm('Request a return for this item?')) return;
        try {
            const res = await api.put(`/orders/${orderId}/return`);
            if (res.data.success) {
                toast.success('Return requested');
                setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: 'Return Requested' } : o));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request return');
        }
    };

    if (loading) return (
        <div className="flex flex-col h-screen items-center justify-center gap-4 bg-white animate-pulse">
            <Archive size={30} className="text-zinc-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Loading Orders...</span>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-[#fcfcfc] px-4 py-6 animate-fade-in pb-20">
            <h1 className="text-xl font-black uppercase italic tracking-widest text-center mb-8">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col items-center">
                    <ShoppingBag className="mx-auto mb-6 text-zinc-200" size={50} strokeWidth={1.5} />
                    <p className="text-zinc-400 font-black uppercase italic tracking-widest text-xs mb-8">No Orders Yet</p>
                    <Link to="/products" className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Package size={14} /> Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
                            <div className="bg-zinc-50 p-4 border-b border-zinc-100 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Order Placed</span>
                                    <span className="text-[10px] font-black italic text-zinc-600 uppercase">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Total</span>
                                    <span className="text-[10px] font-black italic text-[#007aff]">{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                            
                            <div className="p-4 space-y-6">
                                {order.products && order.products.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-4 border-b border-zinc-50 pb-4 last:border-none last:pb-0">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-zinc-50 rounded-xl p-2 shrink-0 border border-zinc-100">
                                                <img 
                                                    src={item.product?.image || 'https://via.placeholder.com/150'} 
                                                    alt={item.product?.name} 
                                                    className="w-full h-full object-contain mix-blend-darken" 
                                                />
                                            </div>
                                            <div className="flex flex-col flex-grow justify-center">
                                                <h4 className="text-[11px] font-black uppercase italic text-black leading-tight mb-1" onClick={() => navigate(`/product/${item.product?._id}`)}>
                                                    {item.product?.name || 'BareSkin Product'}
                                                </h4>
                                                <div className="flex gap-3 text-[9px] font-black uppercase text-zinc-400 mb-2">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.selectedSize && <span className="text-[#007aff]">Size: {item.selectedSize}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 bg-zinc-50/50 p-3 rounded-xl border border-zinc-50">
                                            {order.paymentStatus === 'Cancelled' ? (
                                                <span className="text-[9px] font-black uppercase text-red-600 flex items-center gap-1.5 italic">
                                                    ● Order Cancelled
                                                </span>
                                            ) : order.orderStatus === 'Delivered' ? (
                                                <span className="text-[9px] font-black uppercase text-green-600 flex items-center gap-1.5 italic">
                                                    ● Delivered: {getEstimatedDeliveryDateForOrder(order.createdAt)}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-zinc-900">
                                                    Est. Delivery: <span className="font-black text-[#007aff]">{getEstimatedDeliveryDateForOrder(order.createdAt)}</span>
                                                </span>
                                            )}
                                            <span className="text-[8px] font-black uppercase text-[#ffa41c] tracking-widest italic">
                                                Status: {order.orderStatus || 'Processing'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <button 
                                                onClick={() => toast.success(`Tracking active: ${order.orderStatus || 'Processing'}.`, { style: { fontSize: '10px', fontWeight: 'bold' }})}
                                                className="flex-1 px-3 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-xl text-[9px] font-black uppercase tracking-widest text-center"
                                            >
                                                Track
                                            </button>

                                            {(order.paymentStatus === 'Paid' || order.paymentStatus === 'Pending' || order.paymentStatus === 'COD - Pending') && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                                <button 
                                                    onClick={() => handleCancelOrder(order._id)} 
                                                    className="flex-1 px-3 py-2 bg-zinc-100 text-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-center"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            
                                            {order.orderStatus === 'Delivered' && (
                                                <button 
                                                    onClick={() => handleReturnOrder(order._id)} 
                                                    className="flex-1 px-3 py-2 bg-zinc-100 text-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-center"
                                                >
                                                    Return
                                                </button>
                                            )}
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

export default MobileMyOrders;
