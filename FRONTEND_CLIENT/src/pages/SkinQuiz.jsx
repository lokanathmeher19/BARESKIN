import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Droplets, ShieldCheck, Zap, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import BackButton from '../components/BackButton';
import { CartContext } from '../context/CartContext';

import api from '../utils/api';
import toast from 'react-hot-toast';

const questions = [
    {
        id: 'concern',
        title: "What's your primary skin mission?",
        subtitle: "Every routine starts with a focus.",
        options: [
            { label: "Target Active Acne", value: "acne", icon: <Zap size={20}/> },
            { label: "Deep Hydration", value: "dryness", icon: <Droplets size={20}/> },
            { label: "Anti-Aging & Firming", value: "aging", icon: <ShieldCheck size={20}/> },
            { label: "Radiance & Glow", value: "dullness", icon: <Sparkles size={20}/> }
        ]
    },
    {
        id: 'type',
        title: "How does your skin feel by midday?",
        subtitle: "This helps us determine your base formula.",
        options: [
            { label: "Oily & Shiny", value: "oily", icon: "✨" },
            { label: "Tight & Dry", value: "dry", icon: "🌵" },
            { label: "Combination / T-Zone Oily", value: "combination", icon: "🌗" },
            { label: "Sensitive & Red", value: "sensitive", icon: "🌸" }
        ]
    },
    {
        id: 'goal',
        title: "What's your ultimate goal?",
        subtitle: "Let's refine the final recommendations.",
        options: [
            { label: "Pore Refinement", value: "pores", icon: "🎯" },
            { label: "Smooth Texture", value: "texture", icon: "🌊" },
            { label: "Even Skin Tone", value: "tone", icon: "🎨" },
            { label: "Stronger Skin Barrier", value: "barrier", icon: "🛡️" }
        ]
    }
];

const SkinQuiz = () => {
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
            // Define categories based on naming or metadata
            const getStep = (p) => {
                const name = p.name ? p.name.toLowerCase() : '';
                if (name.includes('cleanser') || name.includes('wash')) return 'Cleanse';
                if (name.includes('toner')) return 'Tone';
                if (name.includes('serum')) return 'Treat';
                if (name.includes('moisturizer') || name.includes('lotion') || name.includes('cream')) return 'Hydrate';
                if (name.includes('foundation') || name.includes('tinted') || name.includes('spf')) return 'Protect';
                return 'Enhance';
            };

            // Filter products matching skin type or concern
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
        }, 2500);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setResults(null);
    };

    if (calculating) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
                <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 border-4 border-[#007aff]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#007aff] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-[#007aff] animate-pulse" size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-[0.2em] mb-4">Creating Routine</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Analyzing products for your skin...</p>
            </div>
        );
    }

    if (results) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10 lg:px-20 animate-luxe">
                <div className="max-w-6xl mx-auto">
                    <BackButton className="mb-10" />
                    <div className="text-center mb-20">

                        <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">Your Personalized Map</span>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">Your Daily Routine<span className="text-zinc-200">.</span></h1>
                        <p className="text-zinc-400 text-sm font-medium italic">Tailored for your {answers.type} skin profile.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
                        {/* AM ROUTINE */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8 lg:mb-10">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                    <Zap size={24}/>
                                </div>
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-black italic uppercase tracking-tight">Morning Routine</h2>
                                    <p className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Focus: Protection & Hydration</p>
                                </div>
                            </div>
                            <div className="space-y-4 lg:space-y-6">
                                {results.am.map((product, idx) => (
                                    <div key={product._id} className="group bg-zinc-50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] flex items-center gap-4 lg:gap-6 border border-transparent hover:border-[#007aff]/20 transition-all">
                                        <div className="text-xl lg:text-2xl font-black italic text-zinc-200 group-hover:text-[#007aff] transition-colors w-6 lg:w-8">0{idx + 1}</div>
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-xl p-2 lg:p-3 shadow-sm flex-shrink-0">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-tight mb-1 truncate">{product.name}</h3>
                                            <p className="text-[8px] lg:text-[9px] font-bold text-[#007aff] uppercase tracking-widest">Step: {idx === 0 ? 'Cleanse' : idx === 1 ? 'Treat' : 'Protect'}</p>
                                        </div>
                                        <button onClick={() => { addToCart(product, 1); toast.success('Added to Routine'); }} className="p-2.5 lg:p-3 bg-white rounded-full hover:bg-black hover:text-white transition-all shadow-sm flex-shrink-0">
                                            <ShoppingBag size={14} className="lg:size-[16px]"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PM ROUTINE */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8 lg:mb-10">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#007aff]/5 rounded-2xl flex items-center justify-center text-[#007aff]">
                                    <Sparkles size={24}/>
                                </div>
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-black italic uppercase tracking-tight">Evening Routine</h2>
                                    <p className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Focus: Repair & Recovery</p>
                                </div>
                            </div>
                            <div className="space-y-4 lg:space-y-6">
                                {results.pm.map((product, idx) => (
                                    <div key={product._id} className="group bg-zinc-50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] flex items-center gap-4 lg:gap-6 border border-transparent hover:border-[#007aff]/20 transition-all">
                                        <div className="text-xl lg:text-2xl font-black italic text-zinc-200 group-hover:text-[#007aff] transition-colors w-6 lg:w-8">0{idx + 1}</div>
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-xl p-2 lg:p-3 shadow-sm flex-shrink-0">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-tight mb-1 truncate">{product.name}</h3>
                                            <p className="text-[8px] lg:text-[9px] font-bold text-[#007aff] uppercase tracking-widest">Step: {idx === 0 ? 'Cleanse' : idx === 1 ? 'Repair' : 'Hydrate'}</p>
                                        </div>
                                        <button onClick={() => { addToCart(product, 1); toast.success('Added to Routine'); }} className="p-2.5 lg:p-3 bg-white rounded-full hover:bg-black hover:text-white transition-all shadow-sm flex-shrink-0">
                                            <ShoppingBag size={14} className="lg:size-[16px]"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-black text-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 shadow-2xl shadow-[#007aff]/20">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl lg:text-3xl font-black italic uppercase mb-2 leading-none italic">The Complete System.</h2>
                            <p className="text-zinc-400 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]">Unlock 20% bundle discount for your full AM/PM routine.</p>
                        </div>
                        <button 
                            onClick={() => {
                                const allProducts = [...new Set([...results.am, ...results.pm])];
                                allProducts.forEach(p => addToCart(p, 1));
                                toast.success('Full System Sync Complete!');
                                navigate('/cart');
                            }}
                            className="w-full lg:w-auto bg-[#007aff] text-white px-8 lg:px-12 py-5 lg:py-6 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group"
                        >
                            <Zap size={18} className="group-hover:animate-pulse" /> Add Full Routine
                        </button>
                    </div>

                    <button onClick={resetQuiz} className="mt-16 mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 hover:text-black transition-all">
                        <RotateCcw size={14} /> Retake Quiz
                    </button>
                </div>
            </div>
        );
    }


    const currentQuestion = questions[step];

    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24 px-6 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#007aff]/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#007aff]/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-4xl w-full z-10">
                <BackButton className="mb-10" />
                {/* Progress */}

                <div className="flex justify-between items-center mb-16 px-4">
                    <div className="flex gap-2">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-1.5 transition-all duration-700 rounded-full ${i === step ? 'w-12 bg-black' : i < step ? 'w-4 bg-black/40' : 'w-4 bg-zinc-200'}`}></div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 italic">Step 0{step + 1} / 0{questions.length}</span>
                </div>

                <div key={step} className="animate-luxe">
                    <div className="bg-white p-10 md:p-20 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-white relative">
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-zinc-50">
                            <Sparkles className="text-[#007aff]" size={32} />
                        </div>

                        <div className="mb-16">
                            <h1 className="text-4xl md:text-6xl font-black italic leading-[0.9] text-black mb-6 uppercase tracking-tighter">
                                {currentQuestion.title}
                            </h1>
                            <p className="text-zinc-400 text-sm font-medium italic underline underline-offset-8 decoration-1 underline-zinc-200">{currentQuestion.subtitle}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleAnswer(option.value)}
                                    className="p-8 border-2 border-zinc-50 rounded-[2.5rem] flex items-center justify-between group hover:border-[#007aff] hover:bg-zinc-50 transition-all text-left"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                            {option.icon}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-800 group-hover:text-[#007aff]">{option.label}</span>
                                    </div>
                                    <ChevronRight size={20} className="text-zinc-200 group-hover:text-[#007aff] group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {step > 0 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 hover:text-black transition-all"
                    >
                        <ChevronLeft size={16} /> Previous Step
                    </button>
                )}
            </div>
        </div>
    );
};

export default SkinQuiz;
