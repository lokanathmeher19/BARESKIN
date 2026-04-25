import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, Users, LogOut, ArrowRight, ExternalLink, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = React.useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/add-product', icon: <PlusCircle size={20} />, label: 'Add Product' },
        { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
        { path: '/admin/subscriptions', icon: <Users size={20} />, label: 'Subscribers' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/banners', icon: <PlusCircle size={20} />, label: 'Offer Banners' },
        { path: '/admin/promos', icon: <PlusCircle size={20} />, label: 'Promo Codes' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`w-72 bg-[#050505] text-white shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-white-[0.05] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            {/* Header Section */}
            <div className="p-8 mb-4 flex items-center justify-between">
                <div className="relative group cursor-pointer" onClick={() => { navigate('/admin'); onClose(); }}>
                    <h2 className="text-4xl font-black tracking-tighter italic bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent group-hover:to-[#007aff] transition-all duration-700">
                        BARESKIN<span className="text-[#007aff]">.</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-[1px] w-4 bg-[#007aff]"></div>
                        <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-zinc-600 italic">Admin Panel</span>
                    </div>
                </div>

                {/* Mobile Close Button */}
                <button onClick={onClose} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-3 overflow-y-auto">
                <div className="px-4 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Management</span>
                </div>
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group overflow-hidden ${active
                                ? 'bg-white/[0.03] text-white'
                                : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            {/* Active Indicator */}
                            {active && (
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#007aff] rounded-r-full shadow-[0_0_15px_#007aff] animate-pulse"></div>
                            )}

                            <div className={`transition-all duration-500 ${active ? 'text-[#007aff] scale-110' : 'group-hover:scale-110 group-hover:text-white'}`}>
                                {item.icon}
                            </div>

                            <span className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-500 ${active ? 'opacity-100 italic' : 'opacity-50 group-hover:opacity-100'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                <div className="pt-8 px-4 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Explore Store</span>
                </div>

                <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center justify-between px-6 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-[#007aff]/10 border border-white-[0.03] hover:border-[#007aff]/30 transition-all duration-500 group"
                >
                    <div className="flex items-center gap-4">
                        <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] font-bold tracking-[0.15em] uppercase opacity-50 group-hover:opacity-100">View Website</span>
                    </div>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
            </nav>

            {/* Footer Section */}
            <div className="p-6 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-5 w-full bg-zinc-900/40 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-2xl transition-all duration-500 group border border-transparent hover:border-red-500/20"
                >
                    <div className="relative">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-[#050505]"></div>
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">Logout Account</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

