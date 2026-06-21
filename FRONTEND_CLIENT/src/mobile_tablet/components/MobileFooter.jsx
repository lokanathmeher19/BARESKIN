import React from 'react';
import { Link } from 'react-router-dom';

const MobileFooter = () => {
    return (
        <div className="w-full bg-[#fbfbfb] px-6 pt-10 pb-6 mt-10 border-t border-zinc-100 flex flex-col items-center">
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-8">
                <Link to="/privacy-policy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Terms of Service</Link>
                <Link to="/return-policy" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Return Policy</Link>
                <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors italic">Contact Us</Link>
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
