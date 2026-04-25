import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Package, Smartphone, Users, DollarSign, Activity, TrendingUp, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';


const Dashboard = () => {
    const { formatPrice } = useCurrency();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/stats');
            if (res.data.success) {
                setStats(res.data.data);
            } else {
                setError(res.data.message || 'Failed to load stats');
            }
        } catch (error) {
            console.error('Error fetching admin stats', error);
            setError(error.response?.data?.message || 'Unauthorized Access or Server Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-20 z-[9999] animate-fade-in">
            <div className="flex flex-col items-center max-w-sm w-full">
                <h2 className="text-6xl font-black italic tracking-tighter text-black mb-8 animate-pulse transition-all">
                    BARESKIN<span className="text-[#007aff]">.</span>
                </h2>
                <div className="w-full bg-zinc-50 h-[2px] relative overflow-hidden mb-6 rounded-full">
                    <div className="absolute inset-0 bg-[#007aff] w-full -translate-x-full animate-progress-fast"></div>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={14} className="text-[#007aff]" />
                    <span className="luxe-subheading text-zinc-400 text-[10px] animate-pulse">Initializing Real-Time Engine</span>
                </div>
            </div>
        </div>
    );

    const cards = [
        { title: 'Total Revenue', value: stats?.totalRevenue?.toLocaleString() || '0', prefix: '₹', icon: <DollarSign size={20} />, trend: 'Real-Time' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, prefix: '', icon: <Smartphone size={20} />, trend: 'Live' },
        { title: 'Inventory Stock', value: stats?.totalStock || 0, prefix: '', icon: <Package size={20} />, trend: 'Synced' },
        { title: 'Active Users', value: stats?.totalUsers || 0, prefix: '', icon: <Users size={20} />, trend: 'Active' },
    ];


    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-black italic uppercase tracking-tight text-zinc-900">Admin Dashboard<span className="text-[#007aff]">.</span></h1>
                        <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase rounded tracking-widest italic">PRO Edition</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium italic">Real-time business intelligence and Luxe-Tech inventory analytics.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Database: Connected</span>
                    </div>
                    {error && <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse italic">Error: {error}</span>}
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:border-[#007aff]/30 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-zinc-50 text-[#007aff] rounded-2xl group-hover:bg-[#007aff] group-hover:text-white transition-all">
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black italic text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">{card.trend}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] italic">{card.title}</span>
                            <div className="flex items-baseline gap-1 mt-2">
                                {card.prefix && <span className="text-sm font-black text-zinc-300 italic">{card.prefix}</span>}
                                <h2 className="text-4xl font-black italic tracking-tighter text-zinc-900 leading-none">{card.value}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sales Analytics Chart */}
                <div className="lg:col-span-8 bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-50 rounded-2xl">
                                <Activity className="text-[#007aff]" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">Sales Analysis</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Revenue trends over last 7 days</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-zinc-50 rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-zinc-100">D</button>
                            <button className="px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic shadow-lg shadow-black/20">W</button>
                            <button className="px-4 py-2 bg-zinc-50 rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-zinc-100">M</button>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.salesHistory || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 900, fill: '#ccc'}} 
                                    dy={20}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 900, fill: '#ccc'}}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold', fontStyle: 'italic' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#007aff" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Stock Predictor */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#232f3e] p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden h-full flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-8">
                            <Zap size={100} className="text-white/5 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Sparkles size={20} className="text-[#febd69]" />
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">AI Stock Predictor</h2>
                            </div>
                            <div className="space-y-8">
                                {stats?.lowStock?.length > 0 ? stats.lowStock.map((p, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] italic text-zinc-400">
                                            <span>{p.name}</span>
                                            <span className={p.stock < 5 ? 'text-red-400' : 'text-yellow-400'}>{p.stock < 5 ? 'Critical' : 'Warning'}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div className={`${p.stock < 5 ? 'bg-red-500' : 'bg-yellow-400'} h-full animate-pulse`} style={{ width: `${(p.stock/20)*100}%` }}></div>
                                        </div>
                                        <p className="text-[10px] font-bold italic text-white/60 uppercase tracking-widest">Status: <span className="text-white underline">{p.prediction}</span></p>
                                    </div>
                                )) : (
                                    <p className="text-[10px] font-bold italic text-white/40 uppercase tracking-widest">No inventory risks detected.</p>
                                )}
                            </div>
                        </div>
                        <button className="w-full py-5 bg-[#37475a] hover:bg-[#febd69] hover:text-black rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest italic z-10">
                            Trigger Restock
                        </button>
                    </div>
                </div>
            </div>

            {/* Customer Heatmap (Clicks vs Buys) */}
            <div className="bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-zinc-50 rounded-2xl">
                        <TrendingUp className="text-[#007aff]" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Sales Velocity Heatmap</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Verified sales data and verified customer intent</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats?.heatmap?.length > 0 ? stats.heatmap.map((item, i) => (
                        <div key={i} className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 space-y-6 hover:bg-white hover:border-[#007aff]/20 hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-zinc-900 italic tracking-widest">{item.name}</span>
                                <div className={`h-2 w-2 rounded-full ${parseFloat(item.ratio) < 1 ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Click Intent</span>
                                <div className="text-2xl font-black italic text-zinc-900">{item.clicks}</div>
                            </div>
                            <div className="pt-4 border-t border-zinc-200/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-black text-zinc-400 uppercase italic">Conversion</span>
                                    <span className="text-[10px] font-black text-[#007aff] italic tracking-tighter">{item.ratio}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-4 text-center py-10">
                            <p className="text-[10px] font-bold text-zinc-300 uppercase italic tracking-widest">No transaction data for heatmap generation.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};


export default Dashboard;
