import React from 'react';
import BackButton from '../components/BackButton';

const LegalPage = ({ title, content }) => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
            <BackButton className="mb-12" />
            <div className="space-y-12">
                <header className="border-b border-zinc-100 pb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-4 block">Official Document</span>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">{title}<span className="text-[#007aff]">.</span></h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mt-4">Last Updated: April 2026</p>
                </header>
                
                <div className="prose prose-zinc max-w-none">
                    {content.map((section, idx) => (
                        <section key={idx} className="mb-12">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-6 italic border-l-4 border-[#007aff] pl-4">{section.heading}</h2>
                            <p className="text-sm text-zinc-600 leading-relaxed italic mb-4">{section.text}</p>
                            {section.list && (
                                <ul className="space-y-3">
                                    {section.list.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#007aff] mt-1.5 shrink-0"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>

                <footer className="pt-12 border-t border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest text-center italic">© BareSkin Skincare // Legal Department</p>
                </footer>
            </div>
        </div>
    );
};

export default LegalPage;
