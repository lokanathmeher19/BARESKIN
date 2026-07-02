import React, { useContext, useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductContext } from '../context/ProductContext';
import { ChevronLeft, ChevronRight, Droplets, ShieldCheck, Leaf, ArrowRight, Sparkles, Activity, Target, Heart, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
// import bundlePromoImg from '../assets/bundle-promo.jpg';
import skinCareImg from '../assets/categories/body-care.webp'; // Radiance Set
import hairCareImg from '../assets/categories/lip-care.jpg';   // Act+Acre Hair Set
import bodyCareImg from '../assets/categories/skin-care.jpg';  // Model/Olaplex
import lipCareImg from '../assets/categories/hair-care.jpg';   // Lips
import beautyPromoImg from '../assets/Promotions/Beauty.jpg';
import mensPromoImg from '../assets/Promotions/Mens.jpg';



const heroSlides = [
    {
        id: 1,
        title: "Face Toner",
        subtitle: "Vitamin B12 + NMF complex",
        feature: "Daily Care",
        image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 2,
        title: "Face Cleanser",
        subtitle: "Salicylic Acid 02%",
        feature: "Deep Core Clean",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 3,
        title: "Face Serum",
        subtitle: "Hyaluronic Acid 2% + B5",
        feature: "Ultra Hydrating",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    }
];

const cleanserSlides = [
    {
        title: "Cleanse Without Stripping",
        desc: "Our Salicylic Acid cleanser removes oil and dirt without damaging your skin barrier.",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
        label: "Soap-Free Formula"
    },
    {
        title: "Pore-Deep Optimization",
        desc: "2% Active BHA targets blackheads and congested pores for a clearer complexion.",
        img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
        label: "Dermatological Grade"
    }
];

const Home = () => {
    const { products, loading } = useContext(ProductContext);
    const { user } = useContext(AuthContext);
    const { } = useContext(WishlistContext);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cleanserIndex, setCleanserIndex] = useState(0);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
        }, 8000);
        
        const cleanserTimer = setInterval(() => {
            setCleanserIndex((prev) => (prev === cleanserSlides.length -1 ? 0 : prev + 1));
        }, 5000);

        return () => {
            clearInterval(timer);
            clearInterval(cleanserTimer);
        };
    }, []);

    const slide = heroSlides[currentSlide];

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#007aff] animate-loading-bar w-0"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-white overflow-x-hidden">
            
            {/* Part 1: Hero Bento Section */}
            <div className="pt-[140px] md:pt-[160px] pb-16 md:pb-24 bg-[#fbfbfb] relative overflow-hidden px-4 md:px-10">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    
                    {/* Left: Text Module */}
                    <div key={`cleanse-txt-${cleanserIndex}`} className="animate-luxe flex">
                        <div className="w-full bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col items-center lg:items-start text-center lg:text-left justify-center group relative overflow-hidden">
                            <span className="bg-black text-white px-5 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase italic tracking-[0.4em] mb-6 md:mb-10 inline-block shadow-xl z-10">New Arrival</span>
                            
                            <h2 className="text-[2.2rem] xs:text-4xl md:text-5xl lg:text-6xl luxe-heading mb-6 md:mb-10 text-black leading-[0.95] z-10 drop-shadow-sm">
                                {cleanserSlides[cleanserIndex].title}
                            </h2>
                            
                            <p className="text-[10px] md:text-[12px] font-bold text-gray-400 mb-8 md:mb-12 max-w-xs tracking-[0.08em] uppercase italic opacity-60 leading-relaxed z-10">
                                {cleanserSlides[cleanserIndex].desc}
                            </p>
                            
                            <button className="luxe-button w-full sm:w-auto px-12 py-5 md:py-6 text-[11px] z-10">
                                Buy Now <ArrowRight size={18} />
                            </button>

                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#007aff]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        </div>
                    </div>

                    {/* Right: Image Module */}
                    <div key={`cleanse-img-${cleanserIndex}`} className="animate-luxe flex h-[350px] md:h-[550px]">
                        <div className="w-full h-full relative group overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_30px_100px_-30px_rgba(0,0,0,0.15)] bg-white p-2">
                            <img 
                                src={cleanserSlides[cleanserIndex].img} 
                                alt="Cleanser product showcase" 
                                className="w-full h-full object-cover rounded-[2.2rem] md:rounded-[3rem] transition-transform duration-[2000ms] group-hover:scale-105" 
                            />
                            {/* Inner Glass Border */}
                            <div className="absolute inset-[10px] rounded-[2.2rem] md:rounded-[3rem] border border-white/20 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Part 2: Hero Gallery (Skewed Highlight) */}
            <div className="relative min-h-[500px] md:min-h-[750px] lg:min-h-[90vh] flex items-center bg-[#f4f4f7] overflow-hidden py-20 lg:py-0 px-4 md:px-0">
                <div className="absolute inset-0 text-[18vw] font-medium text-black/[0.02] select-none text-right pr-20 pt-40 leading-none hidden lg:block">PRODUCTS</div>
                <div className="absolute right-0 top-0 w-full lg:w-[65%] h-full bg-white lg:-skew-x-[8deg] translate-x-0 lg:translate-x-24 shadow-[inset_10px_0_40px_rgba(0,0,0,0.02)] hidden lg:block"></div>
                
                <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 md:gap-16 relative z-10">
                    <div key={`text-${slide.id}`} className="animate-fade-in order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                        <div className="glass-nav p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/60 shadow-2xl backdrop-blur-3xl bg-white/10 w-full">
                            <div className="flex items-center gap-4 mb-6 md:mb-10 justify-center lg:justify-start">
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#007aff] animate-pulse"></div>
                                <span className="luxe-subheading text-[#007aff] text-[8px] md:text-[10px]">{slide.feature}</span>
                            </div>
                            <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl luxe-heading mb-6 md:mb-10 text-black leading-[0.95]">
                                {slide.title}
                            </h1>
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 mb-8 md:mb-10 max-w-sm lg:max-w-md tracking-[0.1em] uppercase italic opacity-50 mx-auto lg:mx-0">
                                Simple Science.<br/>Remarkable Results.
                            </p>
                            <div className="flex flex-col gap-8 w-full">
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                    <Link to="/products" className="luxe-button bg-black hover:bg-[#007aff] px-10 py-5 w-full sm:w-auto text-center whitespace-nowrap">
                                        Browse Shop
                                    </Link>
                                    <Link to="/skin-quiz" className="luxe-button bg-white border border-black text-black hover:bg-black hover:text-white px-10 py-5 w-full sm:w-auto flex items-center justify-center gap-3 group whitespace-nowrap">
                                        Find Your Routine <Sparkles size={16} className="group-hover:animate-spin" />
                                    </Link>
                                </div>
                                <div className="flex justify-center lg:justify-start gap-4">
                                    {heroSlides.map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setCurrentSlide(i)} 
                                            className={`h-1.5 transition-all duration-700 rounded-full ${currentSlide === i ? 'w-12 md:w-20 bg-black' : 'w-4 md:w-8 bg-black/10'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                    
                    <div key={`img-${slide.id}`} className="relative order-1 lg:order-2 animate-fade-in group h-[300px] sm:h-[500px] md:h-[650px] lg:h-[700px] w-full flex items-center justify-center">
                        {/* Dramatic Core Glow */}
                        <div className="absolute inset-0 bg-[#007aff]/20 blur-[80px] md:blur-[150px] rounded-full scale-125 opacity-30 md:opacity-40"></div>
                        <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="relative z-10 w-[90%] lg:w-[85%] h-full md:h-[85%] object-cover rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-1000" 
                        />
                    </div>
                </div>
            </div>

            {/* Part 3: Trust Ribbon (Pure White Divider) */}
            <div className="py-12 md:py-20 border-y border-gray-100 bg-white shadow-sm relative z-20">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 md:gap-12">
                        {[
                            { icon: <Activity className="text-[#007aff]" size={20} md:size={22} />, title: "Bio-Care", label: "Tested Results" },
                            { icon: <Target className="text-[#007aff]" size={20} md:size={22} />, title: "Precision", label: "Targeted Care" },
                            { icon: <ShieldCheck className="text-[#007aff]" size={20} md:size={22} />, title: "Safe Formula", label: "Certified Labs" },
                            { icon: <Leaf className="text-[#007aff]" size={20} md:size={22} />, title: "Pure Quality", label: "Zero Fillers" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="mb-4 p-3 bg-[#f5f5f7] rounded-2xl group-hover:bg-[#007aff] group-hover:text-white transition-all duration-300">
                                    {item.icon}
                                </div>
                                <h4 className="text-[9px] md:text-xs font-medium text-[#0a0a0a] tracking-widest mb-1.5">{item.title}</h4>
                                <p className="text-[8px] md:text-[9px] text-gray-400 font-normal tracking-[0.2em]">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Part 4: Categories (Floating Bento Inset) */}
            <div className="bg-[#fafafa] py-20 md:py-48 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 text-[15vw] font-medium text-black/[0.02] select-none -translate-x-10 translate-y-20 hidden md:block">CATEGORIES</div>
                <div className="max-w-[1700px] px-4 md:px-10 mx-auto relative z-10">
                    <div className="mb-12 md:mb-20 text-center md:text-left">
                        <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">Curated By Need</span>
                        <h2 className="text-4xl md:text-6xl italic leading-none text-black">Collections.</h2>
                    </div>

                    {/* MOBILE ONLY: Circular Categories (Amazon/Flipkart Style) */}
                    <div className="lg:hidden flex overflow-x-auto gap-6 pb-12 no-scrollbar px-2 -mx-4 items-start">
                        {[
                            { name: "Face", img: skinCareImg, path: "/products?category=Face Care" },
                            { name: "Hair", img: hairCareImg, path: "/products?category=Hair Care" },
                            { name: "Body", img: bodyCareImg, path: "/products?category=Body Care" },
                            { name: "Lips", img: lipCareImg, path: "/products?category=Lip Care" },
                            { name: "Makeup", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", path: "/products?category=Makeup" },
                            { name: "Beauty", img: beautyPromoImg, path: "/products?category=Beauty" },
                            { name: "Men's", img: mensPromoImg, path: "/products?category=Men's Care" }
                        ].map((cat, i) => (
                            <Link key={i} to={cat.path} className="flex flex-col items-center gap-3 shrink-0 group">
                                <div className="w-20 h-20 rounded-full border-2 border-white shadow-xl overflow-hidden group-active:scale-95 transition-all outline outline-2 outline-transparent group-hover:outline-[#007aff] outline-offset-4">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black italic">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                
                    {/* DESKTOP BENTO GRID */}
                    <div className="hidden lg:grid grid-cols-4 gap-4 md:gap-6">
                    {/* Skin Care - Desktop Large / Mobile Single */}
                    <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 relative group overflow-hidden tech-card h-[400px] md:h-[600px] lg:h-[624px]">
                        <img src={skinCareImg} alt="Skin" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 md:bottom-12 md:left-12">
                            <h3 className="text-white text-3xl md:text-5xl lg:text-6xl mb-6">Face.</h3>
                            <Link to="/products?category=Face Care" className="bg-white text-black px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-normal hover:bg-[#007aff] hover:text-white transition-all">Shop Collection</Link>
                        </div>
                    </div>
                    
                    {[
                        { name: "Hair", img: hairCareImg, cls: "h-[250px] md:h-[300px]", path: "/products?category=Hair Care" },
                        { name: "Body", img: bodyCareImg, cls: "h-[250px] md:h-[300px]", path: "/products?category=Body Care" },
                        { name: "Lips", img: lipCareImg, cls: "h-[250px] md:h-[300px]", path: "/products?category=Lip Care" },
                        { name: "Makeup", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", cls: "h-[250px] md:h-[300px]", path: "/products?category=Makeup" },
                        { name: "Beauty", img: beautyPromoImg, cls: "h-[250px] md:h-[300px]", path: "/products?category=Beauty" },
                        { name: "Men's", img: mensPromoImg, cls: "sm:col-span-2 h-[250px] md:h-[300px]", path: "/products?category=Men's Care" }
                    ].map((cat, i) => (
                        <div key={i} className={`relative group overflow-hidden tech-card ${cat.cls}`}>
                            <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                <h3 className="text-white text-2xl md:text-3xl">{cat.name}.</h3>
                                <Link to={cat.path} className="text-[9px] font-normal text-white/60 group-hover:text-white transition-all tracking-[0.2em] mt-2 border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">View All</Link>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Part 5: Products (Pure White with Shadow Cards) */}
            <div id="shop" className="bg-white py-20 md:py-48 border-t border-gray-100">
                <div className="max-w-[1700px] px-6 md:px-12 mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-32 gap-8 md:gap-10">
                    <div className="text-center md:text-left">
                        <span className="luxe-subheading text-[#007aff] mb-6 block underline underline-offset-8 decoration-2">Premium Catalog</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight text-black">
                            Trending Now<span className="text-zinc-200">.</span>
                        </h2>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button className="px-8 py-3 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl">Popular</button>
                        <button className="px-8 py-3 border border-zinc-200 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#007aff] hover:border-[#007aff] hover:text-white transition-all text-zinc-400">View Catalog</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {products && products.length > 0 ? (
                        [...products]
                            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                            .slice(0, 8)
                            .map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                    ) : (
                        <div className="col-span-full py-40 bg-zinc-50 border-2 border-dashed border-zinc-100 rounded-[3.5rem] flex flex-col items-center justify-center">
                            <span className="text-[11px] font-black tracking-[0.5em] text-zinc-300 uppercase animate-pulse">Loading Products...</span>
                        </div>
                    )}
                </div>
                </div>
            </div>


            {/* Part 6: Newsletter (Deep Contrast Footer) */}
            <div className="bg-[#1a1a1a] py-20 md:py-40 text-white">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div className="text-center lg:text-left">
                        <span className="luxe-subheading text-[#007aff] mb-6 md:mb-8 block underline underline-offset-8">Join the Community</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl leading-[0.9] mb-8 md:mb-12 text-white">Subscribe to <br className="hidden sm:block"/>Our News.</h2>
                        <p className="text-gray-400 font-medium leading-[1.8] max-w-sm mx-auto lg:mx-0 text-xs md:text-sm tracking-widest ">
                            Stay updated with our latest products and exclusive skincare tips directly in your inbox.
                        </p>
                    </div>
                    <form className="flex flex-col gap-4 max-w-lg mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="w-full bg-white/10 border border-white/20 px-8 py-5 rounded-[1.25rem] md:rounded-[1.75rem] text-[10px] md:text-xs font-medium tracking-widest outline-none focus:bg-white focus:text-black transition-all text-center lg:text-left text-white placeholder:text-gray-500"
                        />
                        <button className="bg-white text-black hover:bg-[#007aff] hover:text-white px-10 py-5 md:py-6 rounded-full text-[10px] md:text-xs font-medium tracking-[0.3em] shadow-2xl transition-all">
                            Join Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
