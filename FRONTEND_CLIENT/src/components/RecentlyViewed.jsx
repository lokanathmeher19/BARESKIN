import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const RecentlyViewed = () => {
    const { formatPrice } = useCurrency();

    const [history, setHistory] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Read history from localStorage when path changes
        const saved = localStorage.getItem('recentlyViewed');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, [location.pathname]);

    if (history.length === 0) return null;

    return (
        <div className="w-full bg-zinc-900 border-t border-zinc-800 text-white py-8 px-6 md:px-10 lg:px-20 animate-fade-in">
            <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center gap-10">
                <div className="flex items-center gap-3 shrink-0 text-zinc-400">
                    <Clock size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Recently Viewed</span>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide flex-grow items-center">
                    {history.map((item) => (
                        <div 
                            key={item._id} 
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="flex items-center gap-4 bg-zinc-800/50 hover:bg-zinc-800 p-3 rounded-2xl cursor-pointer min-w-[200px] transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase truncate max-w-[120px] text-zinc-300 group-hover:text-white transition-colors italic">{item.name}</span>
                                <span className="text-[9px] font-bold text-[#007aff] italic">{formatPrice(item.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewed;
