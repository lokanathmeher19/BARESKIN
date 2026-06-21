import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Droplets, ShieldCheck, Zap, ShoppingBag, RotateCcw } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const questions = [
    {
        id: 'concern',
        title: "Primary Skin Mission?",
        subtitle: "Every routine starts with a focus.",
        options: [
            { label: "Target Active Acne", value: "acne", icon: <Zap size={18}/> },
            { label: "Deep Hydration", value: "dryness", icon: <Droplets size={18}/> },
            { label: "Anti-Aging & Firming", value: "aging", icon: <ShieldCheck size={18}/> },
            { label: "Radiance & Glow", value: "dullness", icon: <Sparkles size={18}/> }
        ]
    },
    {
        id: 'type',
        title: "Midday Skin Feel?",
        subtitle: "Helps determine your base formula.",
        options: [
            { label: "Oily & Shiny", value: "oily", icon: "✨" },
            { label: "Tight & Dry", value: "dry", icon: "🌵" },
            { label: "Combination", value: "combination", icon: "🌗" },
            { label: "Sensitive & Red", value: "sensitive", icon: "🌸" }
        ]
    },
    {
        id: 'goal',
        title: "Ultimate Skin Goal?",
        subtitle: "Let's refine recommendations.",
        options: [
            { label: "Pore Refinement", value: "pores", icon: "🎯" },
            { label: "Smooth Texture", value: "texture", icon: "🌊" },
            { label: "Even Skin Tone", value: "tone", icon: "🎨" },
            { label: "Stronger Barrier", value: "barrier", icon: "🛡️" }
        ]
    }
];

const MobileSkinQuiz = () => {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [calculating, setCalculating] = useState(false);
    const [results, setResults] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data.data || res.data);
            } catch (err) {
                console.error("Quiz fetch error", err);
            }
        };
        fetchProducts();
        window.scrollTo(0, 0);
    }, []);

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [questions[step].id]: value };
        setAnswers(newAnswers);
        
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            generateRecommendations(newAnswers);
        }
    };

    const generateRecommendations = (finalAnswers) => {
        setCalculating(true);
        setTimeout(() => {
            const getStep = (p) => {
                const name = p.name ? p.name.toLowerCase() : '';
                if (name.includes('cleanser') || name.includes('wash')) return 'Cleanse';
                if (name.includes('toner')) return 'Tone';
                if (name.includes('serum')) return 'Treat';
                if (name.includes('moisturizer') || name.includes('lotion') || name.includes('cream')) return 'Hydrate';
                if (name.includes('foundation') || name.includes('tinted') || name.includes('spf')) return 'Protect';
                return 'Enhance';
            };

            const relevant = products.filter(p => {
                const matchesType = p.skinType && p.skinType.some(t => t.toLowerCase() === finalAnswers.type.toLowerCase() || t === 'All Skin Types');
                const matchesConcern = (p.name && p.name.toLowerCase().includes(finalAnswers.concern.toLowerCase())) || 
                                     (p.description && p.description.toLowerCase().includes(finalAnswers.concern.toLowerCase()));
                return matchesType || matchesConcern;
            });

            const routine = {
                am: [
                    relevant.find(p => getStep(p) === 'Cleanse'),
                    relevant.find(p => getStep(p) === 'Tone' || getStep(p) === 'Treat'),
                    relevant.find(p => getStep(p) === 'Protect' || getStep(p) === 'Hydrate')
                ].filter(Boolean),
                pm: [
                    relevant.find(p => getStep(p) === 'Cleanse'),
                    relevant.find(p => getStep(p) === 'Treat'),
                    relevant.find(p => getStep(p) === 'Hydrate' || (p.name && p.name.toLowerCase().includes('repair')))
                ].filter(Boolean)
            };

            setResults(routine);
            setCalculating(false);
        }, 2000);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setResults(null);
    };

    if (calculating) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 border-4 border-[#007aff]/20 border-t-[#007aff] rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-black uppercase tracking-wider">Creating Routine</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 animate-pulse">Analyzing skin parameters...</p>
            </div>
        );
    }

    if (results) {
        return (
            <div className="pt-24 pb-32 px-4 bg-white min-h-screen">
                <div className="text-center mb-8">
                    <span className="text-[8px] font-black text-[#007aff] uppercase tracking-widest block">Skin Map Results</span>
                    <h2 className="text-2xl font-black uppercase">Your Custom Routine</h2>
                </div>

                <div className="space-y-6">
                    {/* AM */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase text-zinc-400 block tracking-wider">Morning Steps</span>
                        {results.am.map((product, idx) => (
                            <div key={product._id} className="p-4 bg-zinc-50 rounded-2xl flex items-center gap-3">
                                <span className="text-lg font-black italic text-zinc-300">0{idx+1}</span>
                                <div className="w-12 h-12 bg-white rounded-xl p-2 shrink-0 border border-zinc-100">
                                    <img src={product.image} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-xs font-black uppercase truncate">{product.name}</h4>
                                    <span className="text-[8px] font-bold text-zinc-400">Step: {idx === 0 ? 'Cleanse' : idx === 1 ? 'Treat' : 'Protect'}</span>
                                </div>
                                <button 
                                    onClick={() => { addToCart(product, 1); toast.success('Added step'); }}
                                    className="p-2.5 bg-white border border-zinc-100 rounded-xl"
                                >
                                    <ShoppingBag size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* PM */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase text-zinc-400 block tracking-wider">Evening Steps</span>
                        {results.pm.map((product, idx) => (
                            <div key={product._id} className="p-4 bg-zinc-50 rounded-2xl flex items-center gap-3">
                                <span className="text-lg font-black italic text-zinc-300">0{idx+1}</span>
                                <div className="w-12 h-12 bg-white rounded-xl p-2 shrink-0 border border-zinc-100">
                                    <img src={product.image} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-xs font-black uppercase truncate">{product.name}</h4>
                                    <span className="text-[8px] font-bold text-zinc-400">Step: {idx === 0 ? 'Cleanse' : idx === 1 ? 'Treat' : 'Hydrate'}</span>
                                </div>
                                <button 
                                    onClick={() => { addToCart(product, 1); toast.success('Added step'); }}
                                    className="p-2.5 bg-white border border-zinc-100 rounded-xl"
                                >
                                    <ShoppingBag size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => {
                            const all = [...new Set([...results.am, ...results.pm])];
                            all.forEach(p => addToCart(p, 1));
                            toast.success('Routine added!');
                            navigate('/cart');
                        }}
                        className="w-full py-4 bg-[#007aff] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all mt-4"
                    >
                        Add Full Routine To Cart
                    </button>

                    <button onClick={resetQuiz} className="w-full py-3 bg-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-500 mt-2 flex justify-center items-center gap-1.5">
                        <RotateCcw size={12} /> Retake Quiz
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[step];

    return (
        <div className="pt-24 pb-32 px-4 bg-white min-h-screen flex flex-col justify-center">
            {/* Progress indicators */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1">
                    {questions.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-black' : 'w-2 bg-zinc-200'}`} />
                    ))}
                </div>
                <span className="text-[9px] font-black uppercase text-zinc-300">Step 0{step+1} / 0{questions.length}</span>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6">
                <div className="mb-6">
                    <h3 className="text-2xl font-black uppercase text-black leading-tight">{currentQuestion.title}</h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">{currentQuestion.subtitle}</p>
                </div>

                <div className="flex flex-col gap-2">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option.value)}
                            className="p-5 border border-zinc-200/60 bg-white rounded-2xl flex items-center justify-between active:border-[#007aff] active:bg-[#007aff]/5 transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center text-sm shrink-0">
                                    {option.icon}
                                </div>
                                <span className="text-xs font-black uppercase text-zinc-800">{option.label}</span>
                            </div>
                            <ChevronRight size={14} className="text-zinc-300" />
                        </button>
                    ))}
                </div>
            </div>

            {step > 0 && (
                <button 
                    onClick={() => setStep(step - 1)}
                    className="mt-6 self-start text-[9px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1"
                >
                    <ChevronLeft size={14} /> Back
                </button>
            )}
        </div>
    );
};

export default MobileSkinQuiz;
