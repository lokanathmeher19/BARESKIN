import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, Calendar, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const today = new Date().toLocaleDateString(undefined, { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });

    return (
        <div className="flex min-h-screen bg-[#fafafa] overflow-x-hidden">
            {/* Dedicated Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Workspace Area */}
            <div className={`flex-1 transition-all duration-500 min-h-screen flex flex-col relative ${isSidebarOpen ? 'ml-0' : 'lg:ml-72'}`}>
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-[#007aff]/[0.02] blur-[150px] pointer-events-none"></div>
                
                {/* Top System Bar */}
                <header className="h-20 px-6 md:px-10 flex items-center justify-between border-b border-zinc-100/50 relative z-30 backdrop-blur-md bg-white/30 sticky top-0">
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Mobile Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-3 bg-black text-white rounded-2xl shadow-xl shadow-black/20 transform active:scale-95 transition-all"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className="hidden sm:flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Stable</span>
                            </div>
                            <div className="h-4 w-[1px] bg-zinc-100"></div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Calendar size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{today}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#007aff] hidden xs:block">Secure v4.2</span>
                        <ShieldCheck size={18} className="text-[#007aff]" />
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 relative z-10">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
                
                <footer className="px-10 py-10 text-center text-zinc-300 text-[9px] font-black uppercase tracking-[0.5em] border-t border-zinc-100/50">
                    Designed for BareSkin &copy; 2026 // Admin Panel Active
                </footer>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                ></div>
            )}
        </div>
    );
};

export default AdminLayout;
