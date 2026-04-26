import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ShoppingCart, Mail, Search, AlertCircle, CheckCircle, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';

const AbandonedCarts = () => {
    const { formatPrice } = useCurrency();
    const [abandonedCarts, setAbandonedCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sending, setSending] = useState(false);

    const fetchAbandonedCarts = async () => {
        try {
            const res = await api.get('/admin/abandoned-carts');
            if (res.data.success) {
                setAbandonedCarts(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching abandoned carts', error);
            toast.error(error.response?.data?.message || 'Failed to load abandoned carts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbandonedCarts();
    }, []);

    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredCarts.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredCarts.map(c => c._id));
        }
    };

    const handleSendRecovery = async () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select at least one user');
            return;
        }
        setSending(true);
        try {
            const res = await api.post('/admin/recover-carts', { userIds: selectedUsers });
            if (res.data.success) {
                toast.success(res.data.message || 'Recovery emails sent!');
                setSelectedUsers([]);
            }
        } catch (error) {
            console.error('Error sending recovery emails', error);
            toast.error(error.response?.data?.message || 'Failed to send recovery emails');
        } finally {
            setSending(false);
        }
    };

    const filteredCarts = abandonedCarts.filter(cart => 
        (cart.name && cart.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cart.email && cart.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const calculateCartTotal = (cartItems) => {
        return cartItems.reduce((acc, item) => {
            const price = item.product?.price || 0;
            const qty = item.quantity || item.qty || 1;
            return acc + (price * qty);
        }, 0);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
            <ShoppingCart size={48} className="text-[#007aff]" />
            <span className="luxe-subheading text-zinc-300">Loading Abandoned Carts...</span>
        </div>
    );

    return (
        <div className="space-y-16 animate-luxe">
            {/* Header section */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-zinc-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#007aff]"></div>
                        <span className="luxe-subheading text-[#007aff] text-xs">Marketing Automation</span>
                    </div>
                    <h1 className="text-7xl text-black">Abandoned Carts<span className="text-zinc-200">.</span></h1>
                    <div className="flex items-center gap-4 py-2 px-6 bg-zinc-50 rounded-full w-fit">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Total Carts</span>
                        <span className="text-sm font-black text-black">{abandonedCarts.length}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Search Bar */}
                    <div className="relative group w-full sm:w-72">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-[#007aff] transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="SEARCH USERS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-50 border border-transparent rounded-full px-14 py-4 text-[10px] font-black tracking-widest uppercase focus:bg-white focus:border-zinc-100 outline-none transition-all placeholder:text-zinc-300"
                        />
                    </div>
                    
                    <button 
                        onClick={handleSendRecovery}
                        disabled={sending || selectedUsers.length === 0}
                        className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#007aff] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-black/10"
                    >
                        <Mail size={14} /> {sending ? 'Sending...' : `Recover (${selectedUsers.length})`}
                    </button>
                </div>
            </header>

            {/* Table Area */}
            <div className="bg-white rounded-[4rem] border border-zinc-100 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.04)] overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-50">
                    <thead>
                        <tr className="bg-zinc-50/30">
                            <th className="px-12 py-10 text-left w-10">
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.length === filteredCarts.length && filteredCarts.length > 0}
                                    onChange={handleSelectAll}
                                    className="rounded text-[#007aff] focus:ring-[#007aff] border-zinc-300 w-4 h-4"
                                />
                            </th>
                            <th className="px-6 py-10 text-left luxe-subheading opacity-50">User</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Cart Items</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Total Value</th>
                            <th className="px-12 py-10 text-right luxe-subheading opacity-50">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50/50">
                        {filteredCarts.map((cart) => {
                            const total = calculateCartTotal(cart.cart || []);
                            return (
                                <tr key={cart._id} className="hover:bg-zinc-50/40 transition-all duration-1000 group">
                                    <td className="px-12 py-8">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUsers.includes(cart._id)}
                                            onChange={() => handleSelectUser(cart._id)}
                                            className="rounded text-[#007aff] focus:ring-[#007aff] border-zinc-300 w-4 h-4"
                                        />
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-zinc-50 text-zinc-300 rounded-xl group-hover:bg-[#007aff]/10 group-hover:text-[#007aff] transition-all">
                                                <UserIcon size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black italic text-black uppercase">{cart.name}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 lowercase">{cart.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex flex-col gap-1 max-w-xs">
                                            {cart.cart && cart.cart.map((item, idx) => (
                                                <span key={idx} className="text-[10px] font-bold text-zinc-600 truncate">
                                                    {item.product?.name} (x{item.quantity || item.qty || 1})
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <span className="text-sm font-black italic text-black">{formatPrice(total)}</span>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedUsers([cart._id]);
                                                handleSendRecovery();
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-3 bg-[#007aff]/5 text-[#007aff] hover:bg-[#007aff] hover:text-white rounded-xl transition-all duration-500"
                                            title="Send Recovery Email"
                                        >
                                            <Mail size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredCarts.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center space-y-6">
                        <div className="p-8 bg-zinc-50 rounded-full text-zinc-100">
                            <AlertCircle size={64} strokeWidth={1} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black italic text-zinc-300 uppercase tracking-widest">No Abandoned Carts</h3>
                            <p className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.4em] mt-2">No users currently have items in their carts.</p>
                        </div>
                    </div>
                )}
            </div>

            <footer className="py-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 italic">BareSkin Marketing Engine // 2026</p>
            </footer>
        </div>
    );
};

export default AbandonedCarts;
