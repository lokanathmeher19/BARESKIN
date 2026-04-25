import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-20 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#007aff]/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-zinc-100 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#007aff] mb-6 block italic">Error Code 404</span>
                    <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                        Skin<br />Lost<span className="text-[#007aff]">?</span>
                    </h1>
                    <p className="text-sm md:text-base text-zinc-500 font-medium italic mb-12 leading-relaxed">
                        The routine you're looking for doesn't exist. Maybe it was discontinued or the formula was changed. Let's get you back to the lab.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/" className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-[#007aff] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/5 group">
                        <Home size={14} className="group-hover:rotate-12 transition-transform" />
                        Back to Home
                    </Link>
                    <Link to="/products" className="w-full sm:w-auto px-10 py-5 bg-zinc-50 text-black rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-center gap-3">
                        Shop Products
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-20 p-8 border border-zinc-100 rounded-[3rem] bg-zinc-50/50 relative group"
                >
                    <Sparkles className="absolute -top-4 -right-4 text-[#007aff] animate-bounce" size={32} />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 italic">Recommended Routine</p>
                    <h3 className="text-lg font-black uppercase italic tracking-tight mb-6">Take the Skin Quiz instead?</h3>
                    <Link to="/skin-quiz" className="inline-flex items-center gap-2 text-[#007aff] text-[10px] font-black uppercase tracking-widest hover:underline italic">
                        Start Analysis <Search size={12} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
