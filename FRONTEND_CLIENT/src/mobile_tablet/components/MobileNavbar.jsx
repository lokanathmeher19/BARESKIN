import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Heart, Sparkles, ChevronDown, ArrowRight, Cpu, Command, Droplets, Wind, Sun, Fingerprint } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../utils/api';

const MobileNavbar = () => {
    const { user } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMobileTab, setActiveMobileTab] = useState('');
    const [banners, setBanners] = useState([
        "FREE SHIPPING ON ALL ORDERS ABOVE {formatPrice(499)}",
        "FLAT 10% OFF ON YOUR FIRST ORDER | USE CODE: BARE10"
    ]);
    const [msgIndex, setMsgIndex] = useState(0);

    const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const wishlistCount = wishlist.length;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev >= (banners.length - 1) ? 0 : prev + 1));
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [banners]);

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

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const renderBannerText = (text) => {
        if (!text) return "";
        return text.replace(/{formatPrice\((\d+)\)}/gi, (match, price) => {
            return formatPrice ? formatPrice(Number(price)) : `₹${price}`;
        });
    };

    return (
        <header className="w-full fixed top-0 z-[100] transition-all duration-300 safe-top">
            {/* Top Offer Banner */}
            {!scrolled && (
                <div className="bg-black text-white h-9 flex items-center justify-center overflow-hidden relative transition-all duration-300">
                    {banners.map((text, idx) => (
                        <div 
                            key={idx}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                idx === msgIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
                            }`}
                        >
                            <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-[0.25em] text-center px-4">
                                {renderBannerText(text)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Float Nav Header */}
            <nav className={`px-4 py-3 flex flex-col gap-3 transition-all duration-300 ${
                scrolled 
                ? 'bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 shadow-md' 
                : 'bg-white border-b border-zinc-100'
            }`}>
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/LOGO.png" alt="BareSkin Logo" className="w-8 h-8 object-contain" />
                        <span className="text-lg font-black uppercase tracking-tighter">
                            BareSkin<span className="text-[#007aff]">.</span>
                        </span>
                    </Link>

                    {/* Quick Access Actions */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <Link to="/profile" className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl">
                                <User size={16} className="text-zinc-700" />
                            </Link>
                        ) : (
                            <Link to="/login" className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl">
                                <User size={16} className="text-zinc-400" />
                            </Link>
                        )}

                        <Link to="/wishlist" className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl relative">
                            <Heart size={16} className={wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-zinc-600'} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl relative">
                            <ShoppingBag size={16} className="text-zinc-700" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[#007aff] text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        <button 
                            className="p-2 bg-zinc-50 rounded-xl text-black hover:bg-zinc-100 active:scale-95 transition-all"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu size={16} />
                        </button>
                    </div>
                </div>

                {/* Inline Search Bar */}
                <div className="flex items-center rounded-xl px-4 py-2.5 bg-zinc-100/70 border border-zinc-200/50 shadow-inner">
                    <Search size={14} className="text-zinc-400 mr-2" />
                    <input 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="bg-transparent text-[10px] font-bold tracking-[0.05em] outline-none flex-grow placeholder:text-zinc-400"
                    />
                </div>
            </nav>

            {/* Sidebar Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-md transition-opacity">
                    <div className="bg-white h-full w-[85%] max-w-sm p-8 flex flex-col relative shadow-2xl overflow-y-auto">
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-zinc-100 rounded-xl"
                        >
                            <X size={16} />
                        </button>

                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 mb-10 mt-4">
                            <img src="/LOGO.png" alt="Logo" className="w-8 h-8" />
                            <span className="text-xl font-black uppercase">BareSkin<span className="text-[#007aff]">.</span></span>
                        </Link>

                        <div className="flex flex-col gap-6">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop All', path: '/products' },
                                { 
                                    name: 'Categories', 
                                    type: 'accordion',
                                    subItems: [
                                        { name: 'Face Care', path: '/products?category=Face Care' },
                                        { name: 'Lip Care', path: '/products?category=Lip Care' },
                                        { name: 'Hair Care', path: '/products?category=Hair Care' },
                                        { name: 'Body Care', path: '/products?category=Body Care' },
                                        { name: 'Makeup', path: '/products?category=Makeup' },
                                        { name: 'Beauty', path: '/products?category=Beauty' },
                                    ]
                                },
                                { 
                                    name: 'Science & Lab', 
                                    type: 'accordion',
                                    subItems: [
                                        { name: 'The Lab', path: '/the-lab' },
                                        { name: 'Ingredients', path: '/analyze-ingredients' },
                                        { name: 'Skin Quiz', path: '/skin-quiz' },
                                    ]
                                },
                                { name: 'Wishlist', path: '/wishlist' },
                                { name: 'My Orders', path: '/my-orders' },
                            ].map((item) => (
                                item.type === 'accordion' ? (
                                    <div key={item.name} className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => setActiveMobileTab(activeMobileTab === item.name ? '' : item.name)}
                                            className="flex items-center justify-between text-lg font-bold uppercase tracking-tight text-zinc-400 hover:text-black"
                                        >
                                            {item.name}
                                            <ChevronDown size={16} className={`transition-transform ${activeMobileTab === item.name ? 'rotate-180 text-black' : ''}`} />
                                        </button>
                                        
                                        {activeMobileTab === item.name && (
                                            <div className="flex flex-col gap-3 pl-4 border-l border-zinc-100">
                                                {item.subItems.map((sub) => (
                                                    <Link 
                                                        key={sub.name}
                                                        to={sub.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="text-sm font-semibold text-zinc-500 hover:text-black"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link 
                                        key={item.name} 
                                        to={item.path} 
                                        onClick={() => setIsMenuOpen(false)} 
                                        className="text-lg font-bold uppercase tracking-tight text-zinc-400 hover:text-black flex justify-between items-center"
                                    >
                                        {item.name}
                                        <ArrowRight size={14} className="opacity-0 hover:opacity-100" />
                                    </Link>
                                )
                            ))}
                        </div>

                        <div className="mt-auto pt-8 border-t border-zinc-100 flex flex-col gap-4">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-[#007aff] uppercase tracking-wider">User Account Login</Link>
                            <span className="text-[9px] uppercase tracking-widest text-zinc-300">&copy; {new Date().getFullYear()} BareSkin Skincare</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default MobileNavbar;
