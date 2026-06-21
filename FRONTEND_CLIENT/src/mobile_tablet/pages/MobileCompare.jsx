import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';

const MobileCompare = () => {
    const { formatPrice } = useCurrency();
    const [allProducts, setAllProducts] = useState([]);
    const [compareList, setCompareList] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setAllProducts(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
        window.scrollTo(0, 0);
    }, []);

    const addToCompare = (product) => {
        if (compareList.length >= 2) {
            alert('Mobile compare allows up to 2 products.');
            return;
        }
        if (!compareList.find(p => p._id === product._id)) {
            setCompareList([...compareList, product]);
        }
        setSearch('');
    };

    const removeFromCompare = (id) => {
        setCompareList(compareList.filter(p => p._id !== id));
    };

    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && !compareList.find(cp => cp._id === p._id));

    return (
        <div className="w-full min-h-screen bg-[#fcfcfc] px-4 py-6 animate-fade-in pb-24">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">
                <ArrowLeft size={14} /> Back
            </button>
            
            <div className="mb-6">
                <h1 className="text-3xl text-black mb-1 font-black italic uppercase tracking-tighter">Compare<span className="text-[#007aff]">.</span></h1>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">Side-by-side (Max 2)</p>
            </div>

            {compareList.length < 2 && (
                <div className="mb-8 relative z-50">
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="SEARCH PRODUCTS..." 
                        className="w-full bg-white border border-zinc-100 shadow-sm rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#007aff]/30"
                    />
                    {search && filtered.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-xl rounded-2xl max-h-60 overflow-y-auto">
                            {filtered.map(p => (
                                <div key={p._id} onClick={() => addToCompare(p)} className="flex items-center gap-3 p-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 last:border-0">
                                    <div className="w-8 h-8 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={p.image} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase truncate">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {compareList.length > 0 ? (
                <div className="flex gap-4">
                    {compareList.map(p => (
                        <div key={p._id} className="flex-1 bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden flex flex-col relative">
                            <button onClick={() => removeFromCompare(p._id)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm z-10"><X size={14}/></button>
                            
                            <div className="bg-zinc-50 p-4 pb-0 flex justify-center">
                                <div className="w-24 h-24" onClick={() => navigate(`/product/${p._id}`)}>
                                    <img src={p.image} className="w-full h-full object-contain mix-blend-darken scale-110" />
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col gap-4 flex-grow">
                                <h3 className="text-[10px] font-black uppercase tracking-tight text-center line-clamp-2 h-8">{p.name}</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-0.5">Price</span>
                                        <span className="text-xs font-black italic text-[#007aff]">{formatPrice(p.price)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-0.5">Category</span>
                                        <span className="text-[9px] font-bold uppercase">{p.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-0.5">Rating</span>
                                        <span className="text-[9px] font-bold">{(p.rating || 0).toFixed(1)}/5 ({p.numReviews || 0})</span>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-0.5">Skin Type</span>
                                        <span className="text-[9px] font-bold line-clamp-2">{Array.isArray(p.skinType) ? p.skinType.join(', ') : (p.skinType || 'All Skin')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 pt-0 mt-auto">
                                <button onClick={() => navigate(`/product/${p._id}`)} className="w-full bg-black text-white py-3 rounded-xl text-[9px] font-black uppercase active:scale-95 transition-transform italic">View</button>
                            </div>
                        </div>
                    ))}
                    {compareList.length === 1 && (
                        <div className="flex-1 bg-zinc-50/50 rounded-[2rem] border-2 border-dashed border-zinc-200 flex items-center justify-center p-4">
                            <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest text-center">Add Product<br/>to Compare</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-[2rem] border border-zinc-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-zinc-400 italic tracking-widest">No products selected.</p>
                </div>
            )}
        </div>
    );
};

export default MobileCompare;
