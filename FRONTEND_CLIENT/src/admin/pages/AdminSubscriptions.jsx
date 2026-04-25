import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Users, 
    Calendar, 
    CreditCard, 
    ChevronRight, 
    Search, 
    Filter, 
    ArrowUpRight, 
    CheckCircle2, 
    XCircle,
    Clock,
    RefreshCw
} from 'lucide-react';
import api from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';

const AdminSubscriptions = () => {
    const { formatPrice } = useCurrency();

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/subscriptions/admin');
            if (res.data.success) {
                setSubscriptions(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching subscriptions", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to load subscriptions";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/subscriptions/${id}/status`, { status });
            toast.success(`Status updated to ${status}`);
            fetchSubscriptions();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const filtered = subscriptions.filter(sub => {
        const matchesSearch = 
            (sub.user?.name && sub.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (sub.product?.name && sub.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === 'Active').length,
        revenue: subscriptions.filter(s => s.status === 'Active').reduce((acc, s) => acc + (s.priceAtSubscription || 0), 0),
        retention: subscriptions.length > 0 ? ((subscriptions.filter(s => s.status === 'Active').length / subscriptions.length) * 100).toFixed(1) : 0
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-3 block">Business Intelligence</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Recurring Revenue<span className="text-[#007aff]">.</span></h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mt-2">Managing {stats.total} active subscription protocols</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchSubscriptions}
                        className="p-4 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Protocols", val: stats.total, icon: <Users size={20} />, color: "bg-zinc-50" },
                    { label: "Active Revenue", val: `${formatPrice(Math.round(stats.revenue))}`, icon: <ArrowUpRight size={20} />, color: "bg-[#007aff]/5 text-[#007aff]" },
                    { label: "Retention Rate", val: `${stats.retention}%`, icon: <CheckCircle2 size={20} />, color: stats.retention > 80 ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600" }
                ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border border-zinc-100 ${stat.color} relative overflow-hidden group`}>
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black italic tracking-tighter">{stat.val}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100">
                <div className="relative flex-grow">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                    <input 
                        type="text"
                        placeholder="Search subscriber or product..."
                        className="w-full pl-14 pr-6 py-4 bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none border border-transparent focus:border-[#007aff]/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['All', 'Active', 'Cancelled', 'Paused'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                statusFilter === status ? 'bg-black text-white shadow-xl' : 'bg-white text-zinc-400 border border-zinc-100 hover:border-black'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-100">
                            <th className="p-8 text-[10px] font-black uppercase text-zinc-400">Subscriber</th>
                            <th className="p-8 text-[10px] font-black uppercase text-zinc-400">Formula / Product</th>
                            <th className="p-8 text-[10px] font-black uppercase text-zinc-400">Next Cycle</th>
                            <th className="p-8 text-[10px] font-black uppercase text-zinc-400">Status</th>
                            <th className="p-8 text-[10px] font-black uppercase text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em] animate-pulse">Scanning database...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="5" className="p-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">No subscribers found</td></tr>
                        ) : filtered.map(sub => (
                            <tr key={sub._id} className="hover:bg-zinc-50 transition-colors group">
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center font-black italic text-zinc-400 overflow-hidden">
                                            {sub.user?.avatar ? (
                                                <img src={sub.user.avatar} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                sub.user?.name[0]
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black italic uppercase tracking-tight">{sub.user?.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400">{sub.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-100 bg-white p-1">
                                            <img src={sub.product?.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black italic uppercase">{sub.product?.name}</p>
                                            <p className="text-[10px] font-bold text-[#007aff] italic">{formatPrice(Math.round(sub.product?.price * 0.9))} / Month</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-2 text-zinc-500 font-bold italic text-xs">
                                        <Calendar size={14} className="text-[#007aff]" />
                                        {new Date(sub.nextBillingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic ${
                                        sub.status === 'Active' ? 'bg-green-50 text-green-600' :
                                        sub.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                        'bg-zinc-100 text-zinc-400'
                                    }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        {sub.status === 'Active' ? (
                                            <button 
                                                onClick={() => updateStatus(sub._id, 'Paused')}
                                                className="p-3 bg-zinc-50 text-zinc-400 hover:text-black rounded-xl transition-all"
                                                title="Pause Subscription"
                                            >
                                                <Clock size={16} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => updateStatus(sub._id, 'Active')}
                                                className="p-3 bg-zinc-50 text-zinc-400 hover:text-[#007aff] rounded-xl transition-all"
                                                title="Activate Subscription"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => updateStatus(sub._id, 'Cancelled')}
                                            className="p-3 bg-zinc-50 text-zinc-400 hover:text-red-500 rounded-xl transition-all"
                                            title="Cancel Subscription"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSubscriptions;
