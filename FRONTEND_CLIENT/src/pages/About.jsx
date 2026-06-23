import React from 'react';
import { Helmet } from 'react-helmet-async';
import BackButton from '../components/BackButton';

const About = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
            <Helmet>
                <title>About Us | BareSkin</title>
                <meta name="description" content="Learn about our brand story, mission, and dermatologically-tested philosophy." />
            </Helmet>
            
            <BackButton className="mb-12" />
            
            <div className="space-y-24">
                {/* Hero Section */}
                <header className="text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-6 block">Our Story</span>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
                            Naked <br /> <span className="text-zinc-300">Truth</span><span className="text-[#007aff]">.</span>
                        </h1>
                        <p className="text-sm md:text-base text-zinc-600 leading-relaxed italic max-w-xl">
                            We believe that skincare shouldn't be complicated. Born from a desire to bring clinical-grade, transparently formulated products to your daily routine, BareSkin is exactly what it sounds like. Nothing hidden, just results.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/5]">
                        <img 
                            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop" 
                            alt="BareSkin Philosophy" 
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    </div>
                </header>

                {/* Mission Section */}
                <section className="bg-zinc-50 rounded-3xl p-12 md:p-24 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-6 block">Our Mission</span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 max-w-3xl mx-auto">
                        To demystify skincare through science and honesty.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-4">01. Pure</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic leading-relaxed">No fillers, no artificial fragrances. Just active ingredients.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-4">02. Proven</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic leading-relaxed">Dermatologically tested and backed by clinical research.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-4">03. Planet</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic leading-relaxed">Responsibly sourced ingredients and recyclable packaging.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
