import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Truck, CheckCircle, Clock, ChevronRight, Package, User, Hash, CreditCard, Activity, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';

const AdminOrders = () => {
    const { formatPrice } = useCurrency();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data);
        } catch (error) {
            console.error('Error fetching orders', error);
            toast.error('Order Error: Sync failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateTrackingStatus = async (id, nextStatus) => {
        const toastId = toast.loading(`Updating tracking status to: ${nextStatus}...`);
        try {
            const res = await api.put(`/orders/${id}/status`, { orderStatus: nextStatus });
            if (res.data.success) {
                setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: nextStatus } : o));
                toast.success(`Order #${id.substring(0, 6)} updated to ${nextStatus}`, { id: toastId });
            }
        } catch (error) {
            console.error('Error updating tracking status', error);
            toast.error('Error: Failed to update tracking status.', { id: toastId });
        }
    };

    const handleRefundOrder = async (id) => {
        if (!window.confirm('Are you sure you want to refund this order?')) return;
        const toastId = toast.loading('Processing refund...');
        try {
            const res = await api.put(`/orders/${id}/status`, { status: 'Refunded' });
            if (res.data.success) {
                setOrders(orders.map(o => o._id === id ? { ...o, paymentStatus: 'Refunded' } : o));
                toast.success('Order refunded successfully', { id: toastId });
            }
        } catch (error) {
            toast.error('Failed to process refund', { id: toastId });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-500/10 text-green-500 border border-green-500/20';
            case 'Shipped': return 'bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/20';
            case 'Paid': return 'bg-zinc-100 text-zinc-900 border border-zinc-200';
            case 'Processing': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border border-red-500/20';
            case 'Return Requested': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
            case 'Refunded': return 'bg-green-500/10 text-green-500 border border-green-500/20';
            default: return 'bg-zinc-50 text-zinc-400 border border-zinc-100';
        }
    };

    const filteredOrders = orders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
            <Activity size={48} className="text-[#007aff]" />
            <span className="luxe-subheading text-zinc-300">Loading Orders...</span>
        </div>
    );

    return (
        <div className="space-y-16 animate-luxe">
            {/* Header section */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-zinc-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#007aff]"></div>
                        <span className="luxe-subheading text-[#007aff] text-xs">Order Management</span>
                    </div>
                    <h1 className="text-7xl text-black">Orders<span className="text-zinc-200">.</span></h1>
                    <div className="flex items-center gap-4 py-2 px-6 bg-zinc-50 rounded-full w-fit">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Total Orders</span>
                        <span className="text-sm font-black text-black">{orders.length}</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full lg:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-[#007aff] transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH ORDER ID OR CUSTOMER..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 border border-transparent rounded-full px-14 py-5 text-[10px] font-black tracking-widest uppercase focus:bg-white focus:border-zinc-100 outline-none transition-all placeholder:text-zinc-300"
                    />
                </div>
            </header>

            {/* Table Area */}
            <div className="bg-white rounded-[4rem] border border-zinc-100 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.04)] overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-50">
                    <thead>
                        <tr className="bg-zinc-50/30">
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Order ID</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Customer</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Order Total</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Status</th>
                            <th className="px-12 py-10 text-right luxe-subheading opacity-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50/50">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-zinc-50/40 transition-all duration-1000 group">
                                <td className="px-12 py-10">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-300 group-hover:text-[#007aff] transition-colors">
                                            <Hash size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black italic text-black">#{order._id.substring(0, 12).toUpperCase()}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 overflow-hidden relative">
                                            <User size={18} />
                                            <div className="absolute inset-0 bg-[#007aff]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-zinc-800 italic uppercase">{order.user?.name || 'Customer'}</span>
                                            <span className="text-[10px] font-bold text-zinc-400 lowercase">{order.user?.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                            <CreditCard size={14} />
                                        </div>
                                        <span className="text-lg font-black italic">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="flex flex-col gap-2">
                                        <div className={`px-5 py-2 rounded-full w-fit flex items-center gap-3 ${getStatusStyle(order.paymentStatus || 'Pending')}`}>
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                                Pay: {order.paymentStatus || 'Awaiting'}
                                            </span>
                                        </div>
                                        <div className={`px-5 py-2 rounded-full w-fit flex items-center gap-3 bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/20`}>
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                                Track: {order.orderStatus || 'Order Placed'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-10 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        {(order.paymentStatus === 'Return Requested' || order.paymentStatus === 'Cancelled') ? (
                                            <button 
                                                onClick={() => handleRefundOrder(order._id)}
                                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 px-6 py-3 hover:bg-green-600 hover:text-white transition-all duration-700 rounded-2xl"
                                            >
                                                Process Refund
                                            </button>
                                        ) : (
                                            <select 
                                                value={order.orderStatus || 'Order Placed'} 
                                                onChange={(e) => handleUpdateTrackingStatus(order._id, e.target.value)}
                                                className="text-[10px] font-black uppercase tracking-widest text-[#007aff] bg-[#007aff]/5 border border-[#007aff]/10 px-6 py-3 rounded-2xl focus:outline-none cursor-pointer"
                                            >
                                                {['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map(status => (
                                                    <option key={status} value={status} className="text-black">{status}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center space-y-6">
                        <div className="p-8 bg-zinc-50 rounded-full text-zinc-100">
                            <AlertCircle size={64} strokeWidth={1} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black italic text-zinc-300 uppercase tracking-widest">No Orders Found</h3>
                            <p className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.4em] mt-2">We couldn't find any orders matching your search.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <footer className="py-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 italic">Order Management System v4.2.0</p>
            </footer>
        </div>
    );
};

export default AdminOrders;
