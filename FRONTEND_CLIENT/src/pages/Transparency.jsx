import React from 'react';
import { Helmet } from 'react-helmet-async';
import BackButton from '../components/BackButton';
import { Beaker, ShieldCheck, Leaf, Microscope } from 'lucide-react';

const Transparency = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
            <Helmet>
                <title>Transparency & Science | BareSkin</title>
                <meta name="description" content="Discover the science, sourcing, and clinical testing behind BareSkin products." />
            </Helmet>
            
            <BackButton className="mb-12" />
            
            <header className="mb-20">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-6 block">Clinical Approach</span>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8">
                    Absolute <br /> <span className="text-zinc-300">Clarity</span><span className="text-[#007aff]">.</span>
                </h1>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed italic max-w-2xl border-l-4 border-[#007aff] pl-6">
                    We believe you have the right to know exactly what you are putting on your skin. Every ingredient has a purpose, and every formula is rigorously tested.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Features */}
                <div className="space-y-12">
                    <div className="flex gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#007aff]/10 flex items-center justify-center shrink-0">
                            <Beaker className="text-[#007aff]" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Active Formulations</h3>
                            <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase italic leading-relaxed">
                                We formulate at optimal pH levels to ensure maximum efficacy without compromising your skin barrier.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-black" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Dermatologist Tested</h3>
                            <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase italic leading-relaxed">
                                Every product undergoes independent clinical trials on diverse skin types before hitting the market.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0">
                            <Leaf className="text-black" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Ethical Sourcing</h3>
                            <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase italic leading-relaxed">
                                We trace our ingredients back to their origins to ensure sustainable harvesting and fair labor practices.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Blacklist */}
                <div className="bg-black text-white rounded-3xl p-10 md:p-12 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 text-white/5">
                        <Microscopic size={300} strokeWidth={0.5} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-6 block">The Blacklist</span>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">What you won't find.</h2>
                        <ul className="space-y-4">
                            {['Parabens & Phthalates', 'Artificial Fragrances', 'Synthetic Dyes', 'Sulfates (SLS/SLES)', 'Mineral Oil', 'Formaldehyde Releasers'].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase italic text-zinc-400 border-b border-white/10 pb-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transparency;
