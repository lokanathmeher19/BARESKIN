import React from 'react';
import { Beaker, BookOpen, Sparkles, ShieldCheck, Zap, Microscope, Pill, FlaskConical } from 'lucide-react';
import BackButton from '../components/BackButton';

const ingredients = [


    {
        name: "Niacinamide",
        alias: "Vitamin B3",
        benefit: "Barrier Repair & Pore Refinement",
        desc: "A powerhouse ingredient that reduces inflammation, minimizes pore appearance, and strengthens the skin's lipid barrier.",
        molecularWeight: "122.12 g/mol",
        phStability: "5.0 - 7.0",
        icon: <Zap size={24}/>,
        color: "bg-blue-50 text-blue-500"
    },
    {
        name: "Salicylic Acid",
        alias: "BHA",
        benefit: "Exfoliation & Acne Control",
        desc: "Oil-soluble acid that penetrates deep into pores to dissolve debris and prevent breakouts.",
        molecularWeight: "138.12 g/mol",
        phStability: "3.0 - 4.0",
        icon: <Microscope size={24}/>,
        color: "bg-purple-50 text-purple-500"
    },
    {
        name: "Hyaluronic Acid",
        alias: "Sodium Hyaluronate",
        benefit: "Intense Hydration",
        desc: "A humectant capable of holding 1000x its weight in water, providing multi-depth hydration and plumping.",
        molecularWeight: "Low to High",
        phStability: "5.0 - 8.0",
        icon: <Sparkles size={24}/>,
        color: "bg-cyan-50 text-cyan-500"
    },
    {
        name: "Ceramides",
        alias: "Lipid Complex",
        benefit: "Structural Integrity",
        desc: "Essential fatty acids that make up 50% of the skin barrier, preventing moisture loss and protecting against environmental stress.",
        molecularWeight: "Various",
        phStability: "5.5 - 6.5",
        icon: <ShieldCheck size={24}/>,
        color: "bg-zinc-100 text-black"
    },
    {
        name: "Vitamin C",
        alias: "L-Ascorbic Acid",
        benefit: "Antioxidant & Brightening",
        desc: "Potent antioxidant that neutralizes free radicals and inhibits melanin production for a radiant glow.",
        molecularWeight: "176.12 g/mol",
        phStability: "2.5 - 3.5",
        icon: <Zap size={24}/>,
        color: "bg-orange-50 text-orange-500"
    },
    {
        name: "Panthenol",
        alias: "Pro-Vitamin B5",
        benefit: "Soothing & Healing",
        desc: "Deeply moisturizing ingredient that promotes wound healing and reduces skin irritation.",
        molecularWeight: "205.25 g/mol",
        phStability: "4.0 - 6.0",
        icon: <Pill size={24}/>,
        color: "bg-green-50 text-green-500"
    }
];

const TheLab = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10 lg:px-20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <BackButton className="mb-10" />
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-24">

                    <div className="max-w-2xl">
                        <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">About Our Science</span>
                        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">Our Story<span className="text-zinc-200">.</span></h1>
                        <p className="text-zinc-400 text-sm font-medium italic leading-relaxed">
                            Welcome to our ingredient library. We believe transparency is the ultimate luxury. Explore the active ingredients that power our high-performance formulas.
                        </p>
                    </div>
                    <div className="hidden lg:flex gap-4">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300">
                            <Beaker size={32} />
                        </div>
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300">
                            <FlaskConical size={32} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ingredients.map((ing, i) => (
                        <div key={i} className="group bg-[#fbfbfb] p-10 rounded-[3rem] border border-transparent hover:border-[#007aff]/20 transition-all duration-700 relative overflow-hidden">
                            {/* Abstract Pattern */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/50 rounded-full blur-3xl group-hover:bg-[#007aff]/5 transition-all"></div>
                            
                            <div className={`w-14 h-14 ${ing.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700`}>
                                {ing.icon}
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight">{ing.name}</h3>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">{ing.alias}</span>
                                </div>
                                <p className="text-xs font-bold text-[#007aff] uppercase tracking-widest">{ing.benefit}</p>
                                <p className="text-xs text-zinc-500 leading-relaxed italic">{ing.desc}</p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-zinc-100 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[8px] font-black uppercase text-zinc-300 tracking-widest block mb-1">Molar Mass</span>
                                    <span className="text-[10px] font-bold text-black">{ing.molecularWeight}</span>
                                </div>
                                <div>
                                    <span className="text-[8px] font-black uppercase text-zinc-300 tracking-widest block mb-1">pH Stability</span>
                                    <span className="text-[10px] font-bold text-black">{ing.phStability}</span>
                                </div>
                            </div>

                            <button className="absolute bottom-10 right-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-200 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                <BookOpen size={16}/>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Educational Quote */}
                <div className="mt-40 bg-black text-white p-12 md:p-24 rounded-[4rem] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none scale-150">
                        <Microscope size={500} />
                    </div>
                    <div className="max-w-3xl relative z-10">
                        <span className="text-[#007aff] text-[10px] font-black uppercase tracking-[0.5em] mb-10 block italic">Education First</span>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-10">Skin knowledge is the key to lasting results.</h2>
                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed italic font-medium">
                            "The beauty industry often hides behind marketing jargon. At BareSkin, we provide you with the raw data and clinical context so you can make informed decisions about your skincare."
                        </p>
                        <div className="mt-12 flex items-center gap-4">
                            <div className="w-12 h-1 bg-[#007aff]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Dr. BareSkin Lab Team</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheLab;
