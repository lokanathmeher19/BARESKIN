import { useCurrency } from '../context/CurrencyContext';
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Command, Cpu, ArrowRight, ChevronDown, Sparkles, Wind, Droplets, Sun, Fingerprint, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const renderBannerText = (text, formatPrice) => {
    if (!text) return "";
    return text.replace(/{formatPrice\((\d+)\)}/gi, (match, price) => {
        return formatPrice ? formatPrice(Number(price)) : `₹${price}`;
    });
};

const Navbar = () => {

    const { formatPrice } = useCurrency();

    const { user } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    
    const [banners, setBanners] = useState([
        "FREE SHIPPING ON ALL ORDERS ABOVE {formatPrice(499)}",
        "FLAT 10% OFF ON YOUR FIRST ORDER | USE CODE: BARE10",
        "BUY 2 GET 1 FREE ON ALL LIP CARE ESSENTIALS",
        "COMPLIMENTARY SKIN ANALYSIS ON ORDERS ABOVE {formatPrice(1499)}"
    ]);

    const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const wishlistCount = wishlist.length;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [msgIndex, setMsgIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Banners from API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await api.get('/banners');
                if (data && data.length > 0) {
                    setBanners(data.map(b => b.text));
                }
            } catch (error) {
                console.error("Error fetching banners", error);
            }
        };
        fetchBanners();
    }, []);

    // Scroll Logic: Change navbar background on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev >= (banners.length - 1) ? 0 : prev + 1));
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [banners]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <header className={`w-full z-[100] fixed top-0 transition-all duration-700 px-3 sm:px-6 lg:px-8 ${scrolled ? 'pt-4' : 'pt-6'}`}>
            
            {/* Minimalist Offer Slider - Only visible at top */}
            {!scrolled && (
                <div className="max-w-[1700px] mx-auto bg-black text-white rounded-full h-9 flex items-center justify-center overflow-hidden relative mb-5 shadow-2xl border border-white/10 group">
                    {banners.map((text, idx) => (
                        <div 
                            key={idx}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                idx === msgIndex 
                                    ? 'opacity-100 translate-y-0 scale-100' 
                                    : 'opacity-0 -translate-y-4 scale-95'
                            }`}
                        >
                            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-6">
                                <span className="opacity-20 group-hover:opacity-100 transition-opacity">/</span>
                                {renderBannerText(text, formatPrice)}
                                <span className="opacity-20 group-hover:opacity-100 transition-opacity">/</span>
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Redesigned Amazon-style Navbar */}
            <nav className={`max-w-[1700px] mx-auto transition-all duration-700 rounded-[1.5rem] sm:rounded-[2.5rem] px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex flex-col gap-4 border shadow-[0_20px_50px_rgba(0,0,0,0.03)] ${
                scrolled 
                ? 'glass-nav border-white/40 backdrop-blur-3xl' 
                : 'bg-white border-zinc-100 shadow-sm'
            }`}>
                {/* TOP ROW: Logo, Search (PC), Actions */}
                <div className="flex items-center justify-between w-full gap-6">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-3 sm:gap-4 group shrink-0">
                        <img src="/LOGO.png" alt="BareSkin Logo" className="w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform duration-700 group-hover:rotate-[360deg]" />
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-black">
                                BareSkin<span className="text-[#007aff]">.</span>
                            </span>
                            <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.5em] text-gray-400 mt-1 pl-1 italic hidden xs:block">Advanced Formulations</span>
                        </div>
                    </Link>

                    {/* PC SEARCH BAR (Amazon style - Center) */}
                    <div className="hidden lg:flex items-center flex-grow max-w-2xl mx-6 rounded-full px-6 py-3 bg-[#f5f5f7] focus-within:bg-white focus-within:border-gray-200 border border-transparent transition-all duration-300 shadow-sm">
                        <Search size={16} className="text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="SEARCH PRODUCTS, BRANDS, AND MORE..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="bg-transparent text-xs font-bold tracking-widest italic outline-none w-full placeholder:text-gray-400"
                        />
                    </div>

                    {/* Advanced Actions Area */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            {user && !user.isAdmin ? (
                                <Link to="/profile" className="px-4 xs:px-6 py-2.5 bg-black text-white rounded-full text-[8px] xs:text-[9px] font-black uppercase italic tracking-[0.2em] transition-all flex items-center gap-1.5 xs:gap-2 hover:bg-[#007aff] shadow-lg">
                                    <User size={12} className="xs:size-[14px]" />
                                    <span className="max-w-[40px] xs:max-w-none truncate">{user.name?.split(' ')[0] || 'User'}</span>
                                </Link>
                            ) : (
                                <Link to="/login" className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:border-[#007aff] transition-all shadow-sm group">
                                    <User size={16} className="text-black group-hover:text-[#007aff] transition-colors" />
                                </Link>
                            )}

                             <Link to="/wishlist" className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:border-red-400 transition-all shadow-sm group">
                                <Heart size={16} className={`transition-colors ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-black group-hover:text-red-500'}`} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:border-black transition-all shadow-sm">
                                <ShoppingBag size={16} className="text-black" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#007aff] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>

                            <button 
                                className="lg:hidden p-2.5 bg-zinc-50 rounded-xl text-black hover:bg-black hover:text-white transition-all" 
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW: Nav Links (PC Only) */}
                <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 border-t border-gray-100 pt-4 mt-2">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Shop', path: '/products' },
                        { 
                            name: 'Categories', 
                            type: 'dropdown',
                            subItems: [
                                { name: 'Face Care', path: '/products?category=Face Care', icon: <Sparkles size={14} /> },
                                { name: 'Lip Care', path: '/products?category=Lip Care', icon: <Droplets size={14} /> },
                                { name: 'Hair Care', path: '/products?category=Hair Care', icon: <Wind size={14} /> },
                                { name: 'Body Care', path: '/products?category=Body Care', icon: <Sun size={14} /> },
                                { name: 'Makeup', path: '/products?category=Makeup', icon: <User size={14} /> },
                                { name: 'Beauty', path: '/products?category=Beauty', icon: <Sparkles size={14} /> },
                                { name: "Men's Care", path: "/products?category=Men's Care", icon: <Fingerprint size={14} /> },
                            ]
                        },
                        { 
                            name: 'Science', 
                            type: 'dropdown',
                            subItems: [
                                { name: 'Our Story', path: '/the-lab', icon: <Cpu size={14} /> },
                                { name: 'Our Ingredients', path: '/analyze-ingredients', icon: <Command size={14} /> },
                                { name: 'Skin Quiz', path: '/skin-quiz', icon: <Sparkles size={14} /> },
                            ]
                        },
                        { name: 'Best Sellers', path: '/products' },
                        { name: 'Orders', path: '/my-orders' }
                    ].map((item) => (
                        item.type === 'dropdown' ? (
                            <div key={item.name} className="relative group py-2">
                                <button className="flex items-center gap-1.5 text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-all cursor-pointer outline-none italic">
                                    {item.name}
                                    <ChevronDown size={10} className="transition-transform duration-300 group-hover:rotate-180" />
                                </button>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="glass-nav rounded-[2rem] overflow-hidden border border-white/40 shadow-2xl p-2">
                                        {item.subItems.map((sub) => (
                                            <Link 
                                                key={sub.name}
                                                to={sub.path}
                                                className="flex items-center gap-4 px-5 py-4 text-[9px] font-black text-gray-400 hover:bg-black hover:text-white rounded-2xl transition-all tracking-[0.15em] uppercase italic"
                                            >
                                                <span className="opacity-50">{sub.icon}</span>
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                className="relative group py-2 text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-all italic"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#007aff] transition-all duration-500 group-hover:w-full"></span>
                            </Link>
                        )
                    ))}
                </div>

                {/* MOBILE SEARCH BAR */}
                <div className="lg:hidden w-full flex items-center rounded-2xl px-5 py-3.5 bg-zinc-100/50 backdrop-blur-xl border border-white/40 shadow-inner group transition-all duration-500">
                    <Search size={14} className="text-zinc-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="bg-transparent text-[10px] font-black tracking-[0.1em] italic outline-none flex-grow placeholder:text-zinc-400"
                    />
                </div>
            </nav>

            {/* Premium Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white h-full w-[85%] max-w-sm p-10 flex flex-col animate-slide-in-right relative shadow-2xl">
                        <button 
                            onClick={() => setIsMenuOpen(false)} 
                            className="absolute top-10 right-8 p-3 bg-zinc-50 rounded-2xl hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                            <X size={20} />
                        </button>

                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 mb-16">
                            <img src="/LOGO.png" alt="Logo" className="w-10 h-10" />
                            <span className="text-2xl font-black uppercase italic">BareSkin<span className="text-[#007aff]">.</span></span>
                        </Link>

                        <div className="flex flex-col gap-8 overflow-y-auto no-scrollbar pb-10">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop All', path: '/products' },
                                { name: 'Categories', path: '/products' },
                                { name: 'Science', path: '/the-lab' },
                                { name: 'Skin Quiz', path: '/skin-quiz' },
                                { name: 'My Wishlist', path: '/wishlist' },
                                { name: 'My Orders', path: '/my-orders' },
                                { name: 'Support', path: '#' }
                            ].map((item) => (
                                <Link 
                                    key={item.name} 
                                    to={item.path} 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className="flex items-center justify-between group"
                                >
                                    <span className="text-2xl font-black italic uppercase tracking-tighter text-zinc-300 group-hover:text-black transition-all">
                                        {item.name}
                                    </span>
                                    <ArrowRight size={20} className="text-zinc-100 group-hover:text-[#007aff] transition-all -translate-x-4 group-hover:translate-x-0" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-6 pt-10 border-t border-zinc-100">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-black italic uppercase tracking-[0.3em] text-[#007aff] underline underline-offset-8">User Login</Link>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-300 ">&copy; {new Date().getFullYear()} BareSkin Skincare</span>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
};

export default Navbar;
