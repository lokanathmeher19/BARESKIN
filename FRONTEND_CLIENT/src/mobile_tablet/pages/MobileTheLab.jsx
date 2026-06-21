import React, { useState } from 'react';
import { Beaker, Microscope, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const ingredients = [
    {
        name: "Niacinamide",
        alias: "Vitamin B3",
        benefit: "Barrier Repair & Pore Refinement",
        desc: "A powerhouse ingredient that reduces inflammation, minimizes pore appearance, and strengthens the skin's lipid barrier.",
        molecularWeight: "122.12 g/mol",
        phStability: "5.0 - 7.0",
        icon: <Zap size={18}/>,
        color: "bg-blue-50 text-blue-500"
    },
    {
        name: "Salicylic Acid",
        alias: "BHA",
        benefit: "Exfoliation & Acne Control",
        desc: "Oil-soluble acid that penetrates deep into pores to dissolve debris and prevent breakouts.",
        molecularWeight: "138.12 g/mol",
        phStability: "3.0 - 4.0",
        icon: <Microscope size={18}/>,
        color: "bg-purple-50 text-purple-500"
    },
    {
        name: "Hyaluronic Acid",
        alias: "Sodium Hyaluronate",
        benefit: "Intense Hydration",
        desc: "A humectant capable of holding 1000x its weight in water, providing multi-depth hydration and plumping.",
        molecularWeight: "Low to High",
        phStability: "5.0 - 8.0",
        icon: <Sparkles size={18}/>,
        color: "bg-cyan-50 text-cyan-500"
    },
    {
        name: "Ceramides",
        alias: "Lipid Complex",
        benefit: "Structural Integrity",
        desc: "Essential fatty acids that make up 50% of the skin barrier, preventing moisture loss and protecting against environmental stress.",
        molecularWeight: "Various",
        phStability: "5.5 - 6.5",
        icon: <ShieldCheck size={18}/>,
        color: "bg-zinc-100 text-black"
    },
    {
        name: "Vitamin C",
        alias: "L-Ascorbic Acid",
        benefit: "Antioxidant & Brightening",
        desc: "Potent antioxidant that neutralizes free radicals and inhibits melanin production for a radiant glow.",
        molecularWeight: "176.12 g/mol",
        phStability: "2.5 - 3.5",
        icon: <Zap size={18}/>,
        color: "bg-orange-50 text-orange-500"
    }
];

const MobileTheLab = () => {
    const [ing1, setIng1] = useState('');
    const [ing2, setIng2] = useState('');
    
    const getCompatibility = () => {
        if (!ing1 || !ing2) return null;
        if (ing1 === ing2) return { status: 'Identical', message: 'No reaction triggered by identical active. Safe to proceed.', type: 'neutral' };
        
        const combo = [ing1, ing2].sort().join(' + ');
        const rules = {
            'Niacinamide + Salicylic Acid': { status: 'Use with Caution', message: 'May cause sensitivity if layered. Alternate AM/PM usage.', type: 'warning' },
            'Salicylic Acid + Vitamin C': { status: 'Irritation Warning', message: 'Highly acidic when combined. Risk of redness.', type: 'danger' },
            'Niacinamide + Vitamin C': { status: 'Separate Sequential Times', message: 'Best applied AM & PM separately.', type: 'warning' },
            'Ceramides + Hyaluronic Acid': { status: 'Highly Synergistic', message: 'Exceptional barrier repair and hydration.', type: 'safe' }
        };
        
        return rules[combo] || { status: 'Compatible', message: 'Safe to formulate and layer together.', type: 'safe' };
    };

    const result = getCompatibility();

    return (
        <div className="pt-24 pb-32 px-4 bg-white min-h-screen">
            <div className="mb-8">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Active Library</span>
                <h2 className="text-2xl font-black uppercase">Ingredients Story</h2>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                    Transparency is key. Explore the science powering our premium formulations.
                </p>
            </div>

            {/* Ingredients Cards List */}
            <div className="flex flex-col gap-4 mb-8">
                {ingredients.map((ing, i) => (
                    <div key={i} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${ing.color} rounded-xl flex items-center justify-center`}>
                                {ing.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase">{ing.name}</h3>
                                <span className="text-[8px] font-bold text-zinc-400 uppercase">{ing.alias}</span>
                            </div>
                        </div>
                        <span className="text-[9px] font-black text-[#007aff] uppercase">{ing.benefit}</span>
                        <p className="text-[10px] text-zinc-500 leading-relaxed italic">{ing.desc}</p>
                    </div>
                ))}
            </div>

            {/* Chemical safety tool */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6">
                <span className="text-[9px] font-black text-[#007aff] uppercase block mb-1">Interactive Mixer</span>
                <h3 className="text-lg font-black uppercase text-black mb-4">Chemical Evaluator</h3>

                <div className="flex flex-col gap-3 mb-4">
                    <select 
                        value={ing1}
                        onChange={(e) => setIng1(e.target.value)}
                        className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold"
                    >
                        <option value="">SELECT FIRST MOLECULE</option>
                        {ingredients.map((ing, i) => (
                            <option key={i} value={ing.name}>{ing.name}</option>
                        ))}
                    </select>

                    <select 
                        value={ing2}
                        onChange={(e) => setIng2(e.target.value)}
                        className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold"
                    >
                        <option value="">SELECT SECOND MOLECULE</option>
                        {ingredients.map((ing, i) => (
                            <option key={i} value={ing.name}>{ing.name}</option>
                        ))}
                    </select>
                </div>

                {result && (
                    <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                        result.type === 'danger' ? 'bg-red-50 border-red-100 text-red-800' :
                        result.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                        result.type === 'safe' ? 'bg-green-50 border-green-100 text-green-800' :
                        'bg-zinc-100 border-zinc-200 text-zinc-800'
                    }`}>
                        <div className="flex items-center gap-2">
                            <Beaker size={14} />
                            <span className="text-[9px] font-black uppercase tracking-wider">{result.status}</span>
                        </div>
                        <p className="text-[10px] italic font-medium">"{result.message}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileTheLab;
