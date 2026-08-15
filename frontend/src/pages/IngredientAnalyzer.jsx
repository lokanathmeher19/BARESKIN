import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, CheckCircle2, FlaskConical, Beaker, Zap, Wind } from 'lucide-react';
import BackButton from '../components/BackButton';


const HARMFUL_INGREDIENTS = [
    { name: 'Parabens', reason: 'Endocrine disruptors that can mimic estrogen.', severity: 'high' },
    { name: 'Sulfates', reason: 'Harsh surfactants that strip skin of natural oils.', severity: 'medium' },
    { name: 'Phthalates', reason: 'Used to make plastics flexible, linked to reproductive issues.', severity: 'high' },
    { name: 'Formaldehyde', reason: 'Known carcinogen used as a preservative.', severity: 'high' },
    { name: 'Mineral Oil', reason: 'Petroleum byproduct that can clog pores.', severity: 'low' },
    { name: 'Synthetic Fragrance', reason: 'Often contain undisclosed chemicals that cause irritation.', severity: 'medium' },
    { name: 'Oxybenzone', reason: 'Chemical sunscreen filter that can cause skin allergies.', severity: 'medium' }
];

const BENEFICIAL_INGREDIENTS = [
    { name: 'Niacinamide', benefit: 'Brightens and strengthens skin barrier.', icon: <Zap size={16}/> },
    { name: 'Hyaluronic Acid', benefit: 'Deeply hydrates and plumps skin.', icon: <Wind size={16}/> },
    { name: 'Ceramides', benefit: 'Restores skin\'s natural protective layer.', icon: <ShieldCheck size={16}/> },
    { name: 'Vitamin C', benefit: 'Potent antioxidant for radiance.', icon: <Zap size={16}/> },
    { name: 'Salicylic Acid', benefit: 'Exfoliates pores and targets acne.', icon: <FlaskConical size={16}/> }
];

const IngredientAnalyzer = () => {
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
                summary: score > 80 ? 'BareSkin Approved' : score > 50 ? 'Proceed with Caution' : 'Not Recommended'
            });
            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24 px-6 md:px-10 lg:px-20">
            <div className="max-w-4xl mx-auto">
                <BackButton className="mb-10" />
                <div className="text-center mb-16">

                    <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">Bio-Safety Check</span>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">Ingredient Analyzer<span className="text-zinc-200">.</span></h1>
                    <p className="text-zinc-400 text-sm font-medium italic max-w-xl mx-auto">Paste your product's ingredient list below to analyze its compatibility with the BareSkin science-first philosophy.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-white relative mb-12">
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-black rounded-full flex items-center justify-center text-white shadow-xl">
                        <Beaker size={32} />
                    </div>
                    
                    <textarea 
                        className="w-full h-64 p-8 bg-zinc-50 rounded-3xl border-none outline-none text-sm font-medium leading-relaxed placeholder:text-zinc-300 focus:ring-2 focus:ring-[#007aff]/20 transition-all mb-8"
                        placeholder="Aqua, Glycerin, Niacinamide, Phenoxyethanol..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>

                    <button 
                        onClick={analyzeIngredients}
                        disabled={analyzing || !text.trim()}
                        className={`luxe-button w-full flex items-center justify-center gap-3 ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {analyzing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Analyzing Ingredients...
                            </>
                        ) : (
                            <>
                                <Search size={20}/> Start Analysis
                            </>
                        )}
                    </button>
                </div>

                {results && (
                    <div className="animate-luxe space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Safety Score</span>
                                <div className={`text-6xl font-black italic ${results.score > 70 ? 'text-green-500' : results.score > 40 ? 'text-orange-500' : 'text-red-500'}`}>
                                    {results.score}%
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-black text-white p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Verdict</span>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tight">{results.summary}</h3>
                                </div>
                                {results.score > 70 ? <CheckCircle2 size={48} className="text-green-400"/> : <AlertTriangle size={48} className="text-orange-400"/>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100">
                                <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-8 flex items-center gap-2">
                                    <AlertTriangle size={16}/> Flagged Ingredients ({results.harmful.length})
                                </h4>
                                {results.harmful.length > 0 ? (
                                    <div className="space-y-6">
                                        {results.harmful.map((ing, i) => (
                                            <div key={i} className="space-y-1">
                                                <span className="text-sm font-bold text-black">{ing.name}</span>
                                                <p className="text-[11px] text-zinc-400 leading-relaxed italic">{ing.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-300 italic font-medium">No harmful ingredients detected in our database.</p>
                                )}
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100">
                                <h4 className="text-xs font-black uppercase tracking-widest text-[#007aff] mb-8 flex items-center gap-2">
                                    <ShieldCheck size={16}/> Beneficial Match ({results.beneficial.length})
                                </h4>
                                {results.beneficial.length > 0 ? (
                                    <div className="space-y-6">
                                        {results.beneficial.map((ing, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-8 h-8 bg-[#007aff]/5 rounded-lg flex items-center justify-center text-[#007aff]">
                                                    {ing.icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-sm font-bold text-black">{ing.name}</span>
                                                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">{ing.benefit}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-300 italic font-medium">No skin-identical ingredients detected.</p>
                                )}
                            </div>
                        </div>

                        <div className="py-12 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-200">BareSkin // Purity Verified</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngredientAnalyzer;
