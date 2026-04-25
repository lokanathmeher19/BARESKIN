import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Tag, Trash2, Plus } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const AdminPromos = () => {
    const { formatPrice } = useCurrency();

    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPromo, setNewPromo] = useState({
        code: '', discountType: 'percentage', discountValue: '', expiryDate: '', usageLimit: 100
    });

    useEffect(() => {
        fetchPromos();
    }, []);

    const fetchPromos = async () => {
        try {
            const { data } = await api.get('/promos');
            if (data.success) setPromos(data.data);
        } catch (error) {
            toast.error('Failed to fetch promos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/promos', newPromo);
            if (data.success) {
                toast.success('Promo code created');
                fetchPromos();
                setNewPromo({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', usageLimit: 100 });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create promo');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this promo code?')) return;
        try {
            await api.delete(`/promos/${id}`);
            toast.success('Deleted successfully');
            fetchPromos();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Manage Promo Codes</h1>
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 mb-10 shadow-sm">
                <h2 className="text-lg font-black uppercase mb-4">Create New Code</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400">Code Name</label>
                        <input required type="text" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm" placeholder="e.g. SUMMER20" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400">Type</label>
                        <select value={newPromo.discountType} onChange={e => setNewPromo({...newPromo, discountType: e.target.value})} className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm">
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400">Value</label>
                        <input required type="number" value={newPromo.discountValue} onChange={e => setNewPromo({...newPromo, discountValue: e.target.value})} className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm" placeholder="e.g. 20" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-zinc-400">Expiry Date</label>
                        <input required type="date" value={newPromo.expiryDate} onChange={e => setNewPromo({...newPromo, expiryDate: e.target.value})} className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm" />
                    </div>
                    <button type="submit" className="bg-[#007aff] text-white p-3 rounded-lg font-bold uppercase tracking-widest text-xs h-[46px]">Create</button>
                </form>
            </div>

            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] uppercase font-black tracking-widest text-zinc-400">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 text-sm">
                        {promos.map(promo => (
                            <tr key={promo._id} className="hover:bg-zinc-50/50">
                                <td className="p-4 font-black text-[#007aff]"><Tag size={14} className="inline mr-2"/>{promo.code}</td>
                                <td className="p-4 font-bold">{promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}</td>
                                <td className="p-4 text-zinc-500">{promo.usedCount} / {promo.usageLimit}</td>
                                <td className="p-4 text-zinc-500">{new Date(promo.expiryDate).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(promo._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                        {promos.length === 0 && !loading && (
                            <tr><td colSpan="5" className="p-8 text-center text-zinc-400">No promo codes found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPromos;
