import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../../context/ProductContext';
import { Sparkles, ArrowRight, Activity, Target, ShieldCheck, Leaf, ChevronRight, Search, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

import skinCareImg from '../../assets/categories/body-care.webp';
import hairCareImg from '../../assets/categories/lip-care.jpg';
import bodyCareImg from '../../assets/categories/skin-care.jpg';
import lipCareImg from '../../assets/categories/hair-care.jpg';
import beautyPromoImg from '../../assets/Promotions/Beauty.jpg';
import mensPromoImg from '../../assets/Promotions/Mens.jpg';

const heroSlides = [
    {
        id: 1,
        title: "Advanced Face Toner",
        subtitle: "Vitamin B12 + NMF complex",
        feature: "Daily Care",
        image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 2,
        title: "Salicylic Face Cleanser",
        subtitle: "Active 02% BHA Core",
        feature: "Deep Pore Clean",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 3,
        title: "Active Face Serum",
        subtitle: "Hyaluronic Acid 2% + B5",
        feature: "Ultra Hydrating",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    }
];

const cleanserSlides = [
    {
        title: "Cleanse Without Stripping",
        desc: "Our Salicylic Acid cleanser removes oil and dirt without damaging your skin barrier.",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
        label: "Soap-Free Formula"
    },
    {
        title: "Pore-Deep Optimization",
        desc: "2% Active BHA targets blackheads and congested pores for a clearer complexion.",
        img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
        label: "Dermatological Grade"
    }
];

const MobileHome = () => {
    const { products, loading } = useContext(ProductContext);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cleanserIndex, setCleanserIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
        }, 5000);
        
        const cleanserTimer = setInterval(() => {
            setCleanserIndex((prev) => (prev === cleanserSlides.length -1 ? 0 : prev + 1));
        }, 5000);

        return () => {
            clearInterval(timer);
            clearInterval(cleanserTimer);
        };
    }, []);

    const activeSlide = heroSlides[currentSlide];

    return (
        <div className="w-full bg-white pb-20 overflow-x-hidden">
            {/* Dynamic Swipeable Hero Banner */}
            <div className="relative h-[480px] bg-zinc-50 flex flex-col justify-end p-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={activeSlide.image} 
                        alt={activeSlide.title} 
                        className="w-full h-full object-cover transition-all duration-[1500ms] scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
                </div>

                <div className="relative z-10 flex flex-col gap-4 text-white">
                    <span className="self-start px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-[#007aff]">
                        {activeSlide.feature}
                    </span>
                    <h2 className="text-3xl font-black leading-none tracking-tight">
                        {activeSlide.title}
                    </h2>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-300">
                        {activeSlide.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <Link to="/products" className="px-6 py-3 bg-[#007aff] text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                            Shop Now
                        </Link>
                        <Link to="/skin-quiz" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            Skin Quiz <Sparkles size={12} />
                        </Link>
                    </div>

                    {/* Indicator dots */}
                    <div className="flex gap-2 mt-4">
                        {heroSlides.map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-8 bg-[#007aff]' : 'w-2 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Circle Categories Scroll */}
            <div className="py-6 px-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Categories</h3>
                    <Link to="/products" className="text-[10px] font-bold text-[#007aff] flex items-center gap-0.5">
                        All <ChevronRight size={12} />
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-5 pb-3 no-scrollbar -mx-4 px-4">
                    {[
                        { name: "Face", img: skinCareImg, path: "/products?category=Face Care" },
                        { name: "Hair", img: hairCareImg, path: "/products?category=Hair Care" },
                        { name: "Body", img: bodyCareImg, path: "/products?category=Body Care" },
                        { name: "Lips", img: lipCareImg, path: "/products?category=Lip Care" },
                        { name: "Makeup", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", path: "/products?category=Makeup" },
                        { name: "Beauty", img: beautyPromoImg, path: "/products?category=Beauty" },
                        { name: "Men's", img: mensPromoImg, path: "/products?category=Men's Care" }
                    ].map((cat, i) => (
                        <Link key={i} to={cat.path} className="flex flex-col items-center gap-2 shrink-0 group">
                            <div className="w-16 h-16 rounded-full border border-zinc-100 shadow-md overflow-hidden group-active:scale-95 transition-all">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Science Trust Badges */}
            <div className="py-4 bg-zinc-50 border-y border-zinc-100 flex justify-around items-center px-2">
                {[
                    { icon: <Activity size={14} className="text-[#007aff]" />, label: "Bio-Care" },
                    { icon: <Target size={14} className="text-[#007aff]" />, label: "Precision" },
                    { icon: <ShieldCheck size={14} className="text-[#007aff]" />, label: "Safe Labs" },
                    { icon: <Leaf size={14} className="text-[#007aff]" />, label: "Zero Fillers" }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        {item.icon}
                        <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Shop by Concern */}
            <div className="py-8 px-4 border-b border-zinc-100">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-black uppercase text-black">Shop By Concern</h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Targeted solutions for your skin</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { title: "Acne & Blemishes", desc: "Clear & Prevent", color: "bg-blue-50/50" },
                        { title: "Anti-Aging", desc: "Firm & Smooth", color: "bg-purple-50/50" },
                        { title: "Hydration", desc: "Plump & Nourish", color: "bg-cyan-50/50" },
                        { title: "Glow", desc: "Brighten & Even", color: "bg-orange-50/50" }
                    ].map((concern, i) => (
                        <Link key={i} to={`/products?category=${concern.title}`} className={`${concern.color} p-4 rounded-2xl flex flex-col items-start gap-1 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform`}>
                            <h4 className="text-[11px] font-black uppercase text-black">{concern.title}</h4>
                            <span className="text-[8px] uppercase tracking-widest text-zinc-500">{concern.desc}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Flash Sale / Deal of the Day */}
            <div className="py-8 bg-[#007aff]/5">
                <div className="px-4 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#007aff] text-white p-1.5 rounded-lg animate-pulse shadow-md">
                            <Clock size={14} />
                        </div>
                        <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff] block">Limited Time</span>
                            <h3 className="text-xl font-black uppercase text-black">Flash Sale</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-zinc-100">
                        <span className="text-[10px] font-bold text-[#007aff]">04</span><span className="text-[10px] text-zinc-400">:</span>
                        <span className="text-[10px] font-bold text-[#007aff]">12</span><span className="text-[10px] text-zinc-400">:</span>
                        <span className="text-[10px] font-bold text-[#007aff]">35</span>
                    </div>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
                    {loading ? (
                        <div className="flex gap-4">
                            {[1, 2].map(i => <div key={i} className="w-[180px] shrink-0 h-[240px] bg-white rounded-2xl animate-pulse shadow-sm border border-zinc-100" />)}
                        </div>
                    ) : products && products.length > 2 ? (
                        [...products].slice(2, 4).map(product => (
                            <div key={product._id} className="w-[180px] shrink-0 relative">
                                <div className="absolute top-2 right-2 z-10 bg-[#ff3b30] text-white px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest shadow-md">-40%</div>
                                <ProductCard product={product} viewMode="small" />
                            </div>
                        ))
                    ) : (
                        <span className="text-[10px] text-zinc-400 pl-4">Loading deals...</span>
                    )}
                </div>
            </div>

            {/* Cleanser Focus Bento (Mobile Adapted) */}
            <div className="mx-4 my-6 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden">
                <div className="relative h-[250px] w-full bg-zinc-100">
                    <img 
                        src={cleanserSlides[cleanserIndex].img} 
                        alt="Cleanser Showcase" 
                        className="w-full h-full object-cover transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                        New Arrival
                    </div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                    <h3 className="text-2xl font-black leading-tight text-black">
                        {cleanserSlides[cleanserIndex].title}
                    </h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {cleanserSlides[cleanserIndex].desc}
                    </p>
                    <button className="mt-2 w-full bg-black text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        Buy Now <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Interactive Skin Quiz Card */}
            <div className="mx-4 my-6 bg-gradient-to-r from-[#007aff] to-[#0055b3] text-white p-6 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
                    <Sparkles size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-3">
                    <span className="self-start px-2 py-0.5 bg-white/20 rounded text-[7px] font-black uppercase tracking-widest">Diagnostic Tool</span>
                    <h4 className="text-xl font-black uppercase">Find Your Custom routine</h4>
                    <p className="text-[9px] text-white/80 leading-relaxed uppercase tracking-wider">
                        Take our 3-step quiz to match active ingredients specifically tailored to your skin concern.
                    </p>
                    <Link to="/skin-quiz" className="self-start mt-2 px-5 py-2.5 bg-white text-[#007aff] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        Start Quiz <ArrowRight size={12} />
                    </Link>
                </div>
            </div>

            {/* New Arrivals Swipeable Slider (Horizontal Scroll) */}
            <div className="py-6 px-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff] block">New Arrivals</span>
                        <h3 className="text-lg font-black uppercase text-black">Shop New Drops</h3>
                    </div>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
                    {loading ? (
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-[160px] shrink-0 h-[220px] bg-zinc-100 animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : products && products.length > 0 ? (
                        [...products]
                            .slice(0, 5)
                            .map(product => (
                                <div key={product._id} className="w-[160px] shrink-0">
                                    <ProductCard product={product} viewMode="small" />
                                </div>
                            ))
                    ) : (
                        <div className="w-full py-10 text-center text-xs text-zinc-400">No new drops found.</div>
                    )}
                </div>
            </div>

            {/* Trending Catalog */}
            <div className="py-8 px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff] block">Curated Catalog</span>
                        <h3 className="text-xl font-black uppercase tracking-tight text-black">Trending Now</h3>
                    </div>
                    <Link to="/products" className="px-4 py-2 border border-zinc-200 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {loading ? (
                        <div className="col-span-2 grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[220px] bg-zinc-100 animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : products && products.length > 0 ? (
                        [...products]
                            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                            .slice(0, 6)
                            .map(product => (
                                <ProductCard key={product._id} product={product} viewMode="small" />
                            ))
                    ) : (
                        <div className="col-span-2 py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl flex items-center justify-center">
                            <span className="text-[10px] font-bold uppercase text-zinc-400">No Products found.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Promo Section */}
            <div className="px-4 pb-6">
                <div className="w-full h-[200px] relative rounded-3xl overflow-hidden shadow-xl group">
                    <img src={beautyPromoImg} alt="Beauty Promotion" className="w-full h-full object-cover group-active:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <span className="text-white/80 text-[9px] font-black uppercase tracking-widest mb-1">Exclusive Bundle</span>
                        <h3 className="text-white text-2xl font-black uppercase leading-tight mb-3">The Beauty <br/> Essentials</h3>
                        <Link to="/products?category=Beauty" className="self-start px-5 py-2 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-widest">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Social Proof / Reviews */}
            <div className="py-8 bg-[#111] text-white overflow-hidden mt-6 mb-2 mx-2 rounded-3xl shadow-2xl relative">
                <div className="px-4 mb-6">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff] block mb-1">Real Results</span>
                    <h3 className="text-2xl font-black uppercase leading-none">Loved By<br/>Thousands</h3>
                </div>
                
                {/* Native CSS Carousel */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 no-scrollbar px-4">
                    {[
                        { name: "Sarah M.", review: "The salicylic cleanser completely cleared my texture in 2 weeks. Obsessed!", rating: 5 },
                        { name: "Emily R.", review: "Finally a serum that actually hydrates without feeling sticky.", rating: 5 },
                        { name: "Jessica T.", review: "The beauty bundle is the best value. My skin has never looked better.", rating: 5 }
                    ].map((item, i) => (
                        <div key={i} className="w-[85%] shrink-0 snap-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(item.rating)].map((_, j) => <Star key={j} size={12} className="fill-[#007aff] text-[#007aff]" />)}
                                </div>
                                <p className="text-sm leading-relaxed text-zinc-300 italic mb-6">"{item.review}"</p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">- {item.name} <span className="text-[#007aff] ml-1">✓ Verified</span></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Lab Highlights */}
            <div className="py-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff] block">Education</span>
                        <h3 className="text-xl font-black uppercase text-black">The Lab</h3>
                    </div>
                    <Link to="/the-lab" className="px-4 py-2 bg-zinc-100 rounded-full text-[9px] font-bold text-zinc-600 uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                        Read All
                    </Link>
                </div>
                <div className="flex flex-col gap-4">
                    {[
                        { title: "How to layer active acids", category: "Guide", read: "4 min read", img: "https://images.unsplash.com/photo-1556228720-192a6af4e86e?auto=format&fit=crop&w=400&q=80" },
                        { title: "Morning routine for glowing skin", category: "Routine", read: "3 min read", img: "https://images.unsplash.com/photo-1615397323862-5883654406fc?auto=format&fit=crop&w=400&q=80" }
                    ].map((post, i) => (
                        <Link key={i} to="/the-lab" className="flex items-center gap-4 group active:scale-[0.98] transition-transform bg-white p-3 rounded-2xl shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-zinc-50">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                <img src={post.img} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-black uppercase tracking-widest text-[#007aff]">{post.category}</span>
                                <h4 className="text-xs font-bold leading-tight text-black group-hover:text-[#007aff] transition-colors line-clamp-2">{post.title}</h4>
                                <span className="text-[9px] text-zinc-400 font-medium">{post.read}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Premium Mobile Newsletter */}
            <div className="mx-4 my-6 bg-black text-white p-6 rounded-3xl flex flex-col gap-4">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff]">Newsletter</span>
                <h4 className="text-xl font-black uppercase leading-tight">Subscribe To Our Science.</h4>
                <p className="text-[10px] text-zinc-400 tracking-wide leading-relaxed">
                    Receive priority access to premium drops and customized skincare diagnostics.
                </p>
                <form className="flex flex-col gap-2 mt-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="ENTER YOUR EMAIL" 
                        className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3.5 rounded-xl text-[10px] font-bold tracking-wider outline-none text-white focus:bg-white focus:text-black transition-all"
                    />
                    <button className="bg-white text-black py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MobileHome;
