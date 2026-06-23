import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BackButton from '../components/BackButton';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/contact`, formData);
            toast.success('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
            <Helmet>
                <title>Contact Us | BareSkin</title>
            </Helmet>
            
            <BackButton className="mb-12" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Info Side */}
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-6 block">Get in touch</span>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8">
                        Say <span className="text-zinc-300">Hello</span><span className="text-[#007aff]">.</span>
                    </h1>
                    <p className="text-sm text-zinc-500 leading-relaxed italic mb-12 max-w-md">
                        Whether you have a question about our products, need help with an order, or just want to share your skin journey, we're here to listen.
                    </p>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-start group">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-[#007aff] group-hover:text-white transition-colors duration-300">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest italic mb-2">Headquarters</h4>
                                <p className="text-sm text-zinc-500 italic">123 Skincare Lane, Tech Park<br />Bangalore, India 560001</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start group">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-[#007aff] group-hover:text-white transition-colors duration-300">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest italic mb-2">Email</h4>
                                <p className="text-sm text-zinc-500 italic lowercase">bareskin@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start group">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-[#007aff] group-hover:text-white transition-colors duration-300">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest italic mb-2">Phone</h4>
                                <p className="text-sm text-zinc-500 italic">+91 800 123 4567</p>
                                <p className="text-xs text-zinc-400 italic mt-1">Mon-Fri, 9am - 6pm IST</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="bg-zinc-50 p-8 md:p-12 rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest italic text-zinc-500 pl-4 block">Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white border-2 border-zinc-200 rounded-full px-6 py-4 text-sm font-bold italic focus:border-black focus:outline-none transition-colors"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest italic text-zinc-500 pl-4 block">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white border-2 border-zinc-200 rounded-full px-6 py-4 text-sm font-bold italic focus:border-black focus:outline-none transition-colors"
                                    placeholder="jane@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest italic text-zinc-500 pl-4 block">Subject</label>
                            <input 
                                type="text" 
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-zinc-200 rounded-full px-6 py-4 text-sm font-bold italic focus:border-black focus:outline-none transition-colors"
                                placeholder="How can we help?"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest italic text-zinc-500 pl-4 block">Message</label>
                            <textarea 
                                name="message"
                                required
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-zinc-200 rounded-3xl px-6 py-4 text-sm font-bold italic focus:border-black focus:outline-none transition-colors resize-none"
                                placeholder="Your message here..."
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white rounded-full py-5 text-xs font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 hover:bg-[#007aff] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/10 hover:shadow-[#007aff]/30 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? 'Sending...' : (
                                <>
                                    Send Message <Send size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
