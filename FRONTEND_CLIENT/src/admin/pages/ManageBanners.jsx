import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const ManageBanners = () => {
    const { formatPrice } = useCurrency();

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBanner, setNewBanner] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await api.get('/banners/admin');
            setBanners(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching banners');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBanner = async () => {
        if (!newBanner.trim()) return;
        try {
            const { data } = await api.post('/banners', { text: newBanner });
            setBanners([...banners, data]);
            setNewBanner('');
            setIsAdding(false);
            toast.success('Banner added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding banner');
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const { data } = await api.put(`/banners/${id}`, { isActive: !currentStatus });
            setBanners(banners.map(b => b._id === id ? data : b));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const handleDeleteBanner = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;
        try {
            await api.delete(`/banners/${id}`);
            setBanners(banners.filter(b => b._id !== id));
            toast.success('Banner deleted');
        } catch (error) {
            toast.error('Error deleting banner');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 bg-zinc-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Manage Offer Banners</h1>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-2 italic">Maximum 5 banners can be active at once</p>
                    </div>
                    {banners.length < 5 && !isAdding && (
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#007aff] transition-all italic shadow-xl"
                        >
                            <Plus size={16} /> Add Banner
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {isAdding && (
                        <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex gap-4 items-center animate-in fade-in slide-in-from-top-4">
                            <input 
                                type="text" 
                                value={newBanner}
                                onChange={(e) => setNewBanner(e.target.value)}
                                placeholder="Enter banner text (e.g. FREE SHIPPING ABOVE {formatPrice(499)})"
                                className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-6 py-3 text-sm font-bold italic outline-none focus:border-[#007aff]"
                                autoFocus
                            />
                            <button 
                                onClick={handleAddBanner}
                                className="bg-[#007aff] text-white p-3 rounded-xl hover:bg-black transition-all"
                            >
                                <Save size={18} />
                            </button>
                            <button 
                                onClick={() => {setIsAdding(false); setNewBanner('');}}
                                className="bg-zinc-100 text-zinc-400 p-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex justify-between items-center group hover:border-[#007aff]/30 transition-all">
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={() => handleToggleActive(banner._id, banner.isActive)}
                                    className={`transition-colors ${banner.isActive ? 'text-[#007aff]' : 'text-zinc-300'}`}
                                >
                                    {banner.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                                <span className={`text-sm font-black uppercase tracking-widest italic ${!banner.isActive ? 'text-zinc-300 line-through' : 'text-zinc-900'}`}>
                                    {banner.text}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDeleteBanner(banner._id)}
                                    className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {banners.length === 0 && !isAdding && (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-zinc-100 border-dashed">
                            <p className="text-zinc-400 font-bold uppercase tracking-widest italic">No banners found. Start by adding one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBanners;
