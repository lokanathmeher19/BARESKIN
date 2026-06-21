import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, CheckCircle2, FlaskConical, Beaker, Zap, Wind } from 'lucide-react';

const HARMFUL_INGREDIENTS = [
    { name: 'Parabens', reason: 'Endocrine disruptors.', severity: 'high' },
    { name: 'Sulfates', reason: 'Harsh surfactants.', severity: 'medium' },
    { name: 'Phthalates', reason: 'Linked to reproductive issues.', severity: 'high' },
    { name: 'Formaldehyde', reason: 'Known carcinogen.', severity: 'high' },
    { name: 'Mineral Oil', reason: 'Can clog pores.', severity: 'low' },
    { name: 'Synthetic Fragrance', reason: 'Can cause irritation.', severity: 'medium' },
    { name: 'Oxybenzone', reason: 'Skin allergies.', severity: 'medium' }
];

const BENEFICIAL_INGREDIENTS = [
    { name: 'Niacinamide', benefit: 'Strengthens barrier.', icon: <Zap size={14}/> },
    { name: 'Hyaluronic Acid', benefit: 'Hydrates skin.', icon: <Wind size={14}/> },
    { name: 'Ceramides', benefit: 'Restores protection.', icon: <ShieldCheck size={14}/> },
    { name: 'Vitamin C', benefit: 'Antioxidant radiance.', icon: <Zap size={14}/> },
    { name: 'Salicylic Acid', benefit: 'Targets acne.', icon: <FlaskConical size={14}/> }
];

const MobileIngredientAnalyzer = () => {
    const [text, setText] = useState('');
    const [results, setResults] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const analyzeIngredients = () => {
        if (!text.trim()) return;
        setAnalyzing(true);
        
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            const foundHarmful = HARMFUL_INGREDIENTS.filter(ing => lowerText.includes(ing.name.toLowerCase()));
            const foundBeneficial = BENEFICIAL_INGREDIENTS.filter(ing => lowerText.includes(ing.name.toLowerCase()));
            
            const score = Math.max(0, 100 - (foundHarmful.length * 15) + (foundBeneficial.length * 5));
            
            setResults({
                score: Math.min(100, score),
                harmful: foundHarmful,
                beneficial: foundBeneficial,
                summary: score > 80 ? 'Safe' : score > 50 ? 'Caution' : 'Not Safe'
            });
            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="w-full min-h-screen bg-[#fcfcfc] px-4 py-6 animate-fade-in pb-20">
            <div className="text-center mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#007aff] block mb-2">Bio-Safety Check</span>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">Analyze<span className="text-zinc-200">.</span></h1>
                <p className="text-[10px] text-zinc-400 italic font-medium px-4">Paste ingredients below to check compatibility with our standards.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 relative mb-8">
                <div className="absolute -top-4 -right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg">
                    <Beaker size={20} />
                </div>
                
                <textarea 
                    className="w-full h-40 p-4 bg-zinc-50 rounded-2xl border-none outline-none text-xs font-medium leading-relaxed placeholder:text-zinc-300 focus:ring-2 focus:ring-[#007aff]/20 transition-all mb-4 mt-2"
                    placeholder="Aqua, Glycerin, Niacinamide..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>

                <button 
                    onClick={analyzeIngredients}
                    disabled={analyzing || !text.trim()}
                    className={`w-full bg-black text-white py-4 rounded-2xl flex justify-center items-center gap-2 active:scale-95 transition-transform ${analyzing ? 'opacity-50' : ''}`}
                >
                    {analyzing ? (
                        <>
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <Search size={14}/> 
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Start Analysis</span>
                        </>
                    )}
                </button>
            </div>

            {results && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white p-5 rounded-3xl border border-zinc-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Score</span>
                            <div className={`text-3xl font-black italic ${results.score > 70 ? 'text-green-500' : results.score > 40 ? 'text-orange-500' : 'text-red-500'}`}>
                                {results.score}%
                            </div>
                        </div>
                        <div className="flex-[2] bg-black text-white p-5 rounded-3xl flex items-center justify-between shadow-lg">
                            <div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Verdict</span>
                                <h3 className="text-lg font-black italic uppercase tracking-tight">{results.summary}</h3>
                            </div>
                            {results.score > 70 ? <CheckCircle2 size={32} className="text-green-400"/> : <AlertTriangle size={32} className="text-orange-400"/>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                            <AlertTriangle size={14}/> Flagged ({results.harmful.length})
                        </h4>
                        {results.harmful.length > 0 ? (
                            <div className="space-y-4">
                                {results.harmful.map((ing, i) => (
                                    <div key={i} className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-black">{ing.name}</span>
                                        <p className="text-[9px] text-zinc-400 leading-relaxed italic">{ing.reason}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[9px] text-zinc-300 italic font-medium">No harmful ingredients detected.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#007aff] mb-4 flex items-center gap-2">
                            <ShieldCheck size={14}/> Beneficial ({results.beneficial.length})
                        </h4>
                        {results.beneficial.length > 0 ? (
                            <div className="space-y-4">
                                {results.beneficial.map((ing, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <div className="w-8 h-8 bg-[#007aff]/5 rounded-xl flex items-center justify-center text-[#007aff] shrink-0">
                                            {ing.icon}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-black">{ing.name}</span>
                                            <p className="text-[9px] text-zinc-400 leading-relaxed italic">{ing.benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[9px] text-zinc-300 italic font-medium">No skin-identical ingredients detected.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileIngredientAnalyzer;
