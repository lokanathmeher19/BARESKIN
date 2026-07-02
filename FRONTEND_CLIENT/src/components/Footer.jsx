import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-zinc-100 pt-24 md:pt-32 pb-12 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 lg:gap-24 mb-24 text-center md:text-left">
                
                {/* Brand Info */}
                <div className="flex flex-col items-center md:items-start gap-8">
                    <h3 className="text-4xl md:text-5xl italic font-black tracking-tighter text-black">
                        BareSkin<span className="text-[#007aff]">.</span>
                    </h3>
                    <p className="text-gray-400 text-[10px] md:text-[11px] font-black tracking-[0.05em] uppercase italic leading-loose max-w-sm">
                        Experience transparency in dermatologically-tested skincare. Developed with premium ingredients for visible results.
                    </p>
                    <div className="flex items-center gap-8 mt-4">
                        <Link to="#" className="text-zinc-200 hover:text-[#007aff] transition-all transform hover:-translate-y-1">
                            <Globe size={20} strokeWidth={1.5} />
                        </Link>
                        <Link to="#" className="text-zinc-200 hover:text-[#007aff] transition-all transform hover:-translate-y-1">
                            <Mail size={20} strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center md:items-start">
                    <span className="luxe-subheading text-[#007aff] block mb-8 underline underline-offset-8">Our Collections</span>
                    <ul className="flex flex-col gap-5">
                        {['Face Care', 'Cleansers', 'Moisturizers', 'Sun Protection', 'Hair Care', 'Body Care', 'Beauty', "Men's Care"].map((item) => (
                            <li key={item}>
                                <Link to="/products" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-[#007aff] opacity-0 group-hover:opacity-100 transition-all"></div>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-center md:items-start">
                    <span className="luxe-subheading text-[#007aff] block mb-8 underline underline-offset-8">Company</span>
                    <ul className="flex flex-col gap-5">
                        <li><Link to="/about" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all">About Us</Link></li>
                        <li><Link to="/transparency" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all">Transparency</Link></li>
                        <li><Link to="/profile" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all">Track Order</Link></li>
                        <li><Link to="/privacy-policy" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all">Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all">Terms of Service</Link></li>
                        <li><Link to="/return-policy" className="text-zinc-400 text-[10px] font-black tracking-widest uppercase italic hover:text-[#007aff] transition-all">Return Policy</Link></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div className="flex flex-col items-center md:items-start">
                    <span className="luxe-subheading text-[#007aff] block mb-8 underline underline-offset-8">Contact Us</span>
                    <ul className="flex flex-col gap-8 md:gap-6">
                        <li className="flex flex-col md:flex-row gap-4 items-center md:items-start text-zinc-400 text-[10px] font-black tracking-widest uppercase italic">
                            <MapPin size={18} className="shrink-0 text-black md:mt-1" strokeWidth={1.5} />
                            <span className="leading-relaxed">123 Skincare Lane, Tech Park,<br className="hidden md:block"/>Bangalore, India</span>
                        </li>
                        <li className="flex flex-col md:flex-row gap-4 items-center md:items-start text-zinc-400 text-[10px] font-black tracking-widest uppercase italic">
                            <Phone size={18} className="shrink-0 text-black" strokeWidth={1.5} />
                            <span>+91 800 123 4567</span>
                        </li>
                        <li className="flex flex-col md:flex-row gap-4 items-center md:items-start text-zinc-400 text-[10px] font-black tracking-widest uppercase italic border-t border-zinc-50 pt-8 md:pt-6 w-full justify-center md:justify-start">
                            <Mail size={18} className="shrink-0 text-black" strokeWidth={1.5} />
                            <span className="lowercase">support@bareskin.co</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-zinc-300 text-[9px] font-black tracking-[0.4em] uppercase italic text-center md:text-left">
                    &copy; {new Date().getFullYear()} BareSkin Skincare. Secure Shopping Experience.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
                    {['Visa', 'Mastercard', 'UPI', 'PayPal'].map((pay) => (
                        <span key={pay} className="text-[9px] font-black tracking-[0.5em] uppercase text-zinc-200 select-none italic hover:text-[#007aff] transition-colors">{pay}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
