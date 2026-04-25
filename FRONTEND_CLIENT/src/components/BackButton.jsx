import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ className = "" }) => {
    const navigate = useNavigate();
    
    return (
        <button 
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-all group ${className}`}
        >
            <div className="w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                <ChevronLeft size={16} />
            </div>
            <span className="italic">Go Back</span>
        </button>
    );
};

export default BackButton;
