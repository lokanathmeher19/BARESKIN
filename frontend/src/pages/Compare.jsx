import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const Compare = () => {
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
        if (compareList.length >= 3) {
            alert('You can only compare up to 3 products at a time.');
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
        <div className="max-w-[1440px] mx-auto pt-32 md:pt-48 pb-32 px-4 md:px-10 lg:px-20 animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-10">
                <ArrowLeft size={16} /> Back
            </button>
            <div className="mb-12">
                <h1 className="text-4xl md:text-6xl text-black mb-4">Compare Products<span className="text-[#007aff]">.</span></h1>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest italic">Side-by-side analysis (Max 3 items)</p>
            </div>

            {compareList.length < 3 && (
                <div className="mb-12 relative w-full max-w-lg z-50">
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products to add to comparison..." 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-xs font-black italic outline-none focus:border-[#007aff] transition-colors"
                    />
                    {search && filtered.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-xl rounded-2xl max-h-64 overflow-y-auto">
                            {filtered.map(p => (
                                <div key={p._id} onClick={() => addToCompare(p)} className="flex items-center gap-4 p-4 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 last:border-0">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden shrink-0"><img src={p.image} className="w-full h-full object-contain" /></div>
                                    <span className="text-xs font-black uppercase truncate">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {compareList.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="p-6 w-48 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100">Features</th>
                                {compareList.map(p => (
                                    <th key={p._id} className="p-6 border-b border-l border-zinc-100 bg-white relative">
                                        <button onClick={() => removeFromCompare(p._id)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 p-1"><X size={16}/></button>
                                        <div className="flex flex-col items-center text-center gap-4">
                                            <div className="w-32 h-32 bg-zinc-50 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate(`/product/${p._id}`)}>
                                                <img src={p.image} className="w-full h-full object-contain mix-blend-darken" />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-tight line-clamp-2">{p.name}</h3>
                                        </div>
                                    </th>
                                ))}
                                {/* Fill remaining slots if < 3 */}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                                    <th key={i} className="p-6 border-b border-l border-zinc-50 bg-zinc-50/30 text-center">
                                        <span className="text-[10px] font-black uppercase text-zinc-300">Empty Slot</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            <tr>
                                <td className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-50/50">Price</td>
                                {compareList.map(p => <td key={p._id} className="p-6 text-sm font-bold border-l border-zinc-100 italic">{formatPrice(p.price)}</td>)}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="border-l border-zinc-50 bg-zinc-50/30"></td>)}
                            </tr>
                            <tr>
                                <td className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-50/50">Category</td>
                                {compareList.map(p => <td key={p._id} className="p-6 text-xs font-bold border-l border-zinc-100 uppercase">{p.category}</td>)}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="border-l border-zinc-50 bg-zinc-50/30"></td>)}
                            </tr>
                            <tr>
                                <td className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-50/50">Rating</td>
                                {compareList.map(p => <td key={p._id} className="p-6 text-xs font-bold border-l border-zinc-100">{(p.rating || 0).toFixed(1)}/5 ({p.numReviews || 0} reviews)</td>)}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="border-l border-zinc-50 bg-zinc-50/30"></td>)}
                            </tr>
                            <tr>
                                <td className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-50/50">Skin Type</td>
                                {compareList.map(p => <td key={p._id} className="p-6 text-xs border-l border-zinc-100">{Array.isArray(p.skinType) ? p.skinType.join(', ') : (p.skinType || 'All Skin Types')}</td>)}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="border-l border-zinc-50 bg-zinc-50/30"></td>)}
                            </tr>
                            <tr>
                                <td className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-50/50">Key Ingredients</td>
                                {compareList.map(p => (
                                    <td key={p._id} className="p-6 text-xs border-l border-zinc-100">
                                        {Array.isArray(p.ingredients) && p.ingredients.length > 0 ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {p.ingredients.slice(0, 3).map((ing, idx) => <li key={idx} className="truncate">{ing.name || ing}</li>)}
                                            </ul>
                                        ) : 'N/A'}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="border-l border-zinc-50 bg-zinc-50/30"></td>)}
                            </tr>
                            <tr>
                                <td className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-50/50">Action</td>
                                {compareList.map(p => (
                                    <td key={p._id} className="p-6 border-l border-zinc-100 text-center">
                                        <button onClick={() => navigate(`/product/${p._id}`)} className="w-full bg-black text-white py-3 rounded-lg text-[9px] font-black uppercase hover:bg-[#007aff] transition-colors italic">View Product</button>
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={i} className="border-l border-zinc-50 bg-zinc-50/30"></td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-[3rem] border border-zinc-100">
                    <p className="text-sm font-black uppercase text-zinc-400 italic">No products added for comparison.</p>
                </div>
            )}
        </div>
    );
};

export default Compare;
