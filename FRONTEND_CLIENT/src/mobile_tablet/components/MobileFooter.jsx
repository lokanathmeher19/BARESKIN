import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

const MobileFooter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/newsletter`, { email });
            toast.success(res.data.message || 'Subscribed to newsletter!');
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full bg-[#fbfbfb] px-6 pt-10 pb-6 mt-10 border-t border-zinc-100 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-8">
                <Link to="/privacy-policy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Terms of Service</Link>
                <Link to="/return-policy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Return Policy</Link>
                <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Contact Us</Link>
            </div>

            {/* Newsletter Subscription */}
            <div className="w-full max-w-sm mb-10 text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic mb-3 block">Join our Newsletter</span>
                <form onSubmit={handleSubscribe} className="relative">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" 
                        className="w-full bg-white border border-zinc-200 text-xs italic font-bold text-black px-4 py-3 rounded-xl focus:outline-none focus:border-black transition-colors shadow-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-black text-white px-4 rounded-lg flex items-center justify-center hover:bg-[#007aff] transition-colors disabled:opacity-50"
                    >
                        <ArrowRight size={14} />
                    </button>
                </form>
            </div>

            {/* Logo & Trademark */}
            <div className="flex flex-col items-center mb-6">
                <span className="text-xl font-black italic uppercase tracking-tighter">BareSkin<span className="text-[#007aff]">.</span></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-1">Clinical Grade</span>
            </div>

            {/* Developed By Credit */}
            <div className="bg-white px-5 py-3 rounded-full border border-zinc-100 shadow-sm flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">
                    Developed By <span className="text-black not-italic ml-1">Lokanath Meher</span>
                </span>
            </div>

            {/* Copyright */}
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-300">
                &copy; {new Date().getFullYear()} BareSkin. All Rights Reserved.
            </p>
        </div>
    );
};

export default MobileFooter;
