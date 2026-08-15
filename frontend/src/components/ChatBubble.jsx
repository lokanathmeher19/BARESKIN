import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import api from '../utils/api';

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: "Hello! I'm your BareSkin AI Assistant. Tell me about your skin concerns (e.g., acne, dryness, aging) and I'll find the perfect formulation for you." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [products, setProducts] = useState([]);
    
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data.data || []));
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const generateAIResponse = (userText) => {
        const text = userText.toLowerCase();
        let recommended = [];
        let responseText = "I'm still learning! Could you describe your specific skin concern (e.g., acne, dryness, aging, dark spots)?";

        if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
             return { text: "Hello! How can I help you achieve your best skin today?" };
        }

        const concerns = [
            { keywords: ['acne', 'pimple', 'breakout', 'clear', 'blemish'], tag: 'Acne' },
            { keywords: ['dry', 'flakey', 'hydration', 'moisture', 'thirsty'], tag: 'Dryness' },
            { keywords: ['aging', 'wrinkle', 'fine line', 'youth', 'firm'], tag: 'Aging' },
            { keywords: ['dull', 'bright', 'glow', 'radiant'], tag: 'Dullness' },
            { keywords: ['dark spot', 'pigmentation', 'scar', 'uneven', 'spot'], tag: 'Dark Spots' },
            { keywords: ['sensitive', 'red', 'irritated', 'calm', 'soothe'], tag: 'Sensitivity' }
        ];

        let matchedConcerns = [];
        concerns.forEach(c => {
            if (c.keywords.some(k => text.includes(k))) {
                matchedConcerns.push(c.tag);
            }
        });

        if (matchedConcerns.length > 0) {
            // Find products matching tags
            recommended = products.filter(p => 
                p.skinType?.some(st => matchedConcerns.includes(st)) ||
                (p.description && matchedConcerns.some(mc => p.description.toLowerCase().includes(mc.toLowerCase())))
            );

            // Sort by rating or price to get best matches
            recommended.sort((a, b) => b.rating - a.rating);
            recommended = recommended.slice(0, 2); // Return top 2

            if (recommended.length > 0) {
                responseText = `Based on your concerns with ${matchedConcerns.join(' and ').toLowerCase()}, I've analyzed our clinical catalog. These formulations are exactly what you need.`;
            } else {
                responseText = `I see you're concerned about ${matchedConcerns.join(', ').toLowerCase()}, but it looks like we might be out of stock for those specific targeted treatments right now.`;
            }
        } else if (text.includes('price') || text.includes('cost') || text.includes('cheap')) {
            responseText = "Our premium formulations range from budget-friendly essentials to luxury serums. Check out the 'Store' tab to filter by your preferred price range!";
        }

        return { text: responseText, products: recommended };
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const aiResponse = generateAIResponse(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', ...aiResponse }]);
            setIsTyping(false);
        }, 1200 + Math.random() * 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[340px] sm:w-[400px] h-[550px] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in origin-bottom-right transform transition-all">
                    {/* Header */}
                    <div className="bg-black text-white px-6 py-5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <Sparkles size={16} className="text-[#007aff]" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest italic">BareSkin AI</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-zinc-50/50 scrollbar-hide">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-zinc-200 text-zinc-500' : 'bg-black text-white'}`}>
                                        {msg.sender === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className={`p-4 rounded-2xl text-[11px] leading-relaxed font-medium ${
                                            msg.sender === 'user' 
                                            ? 'bg-[#007aff] text-white rounded-tr-sm' 
                                            : 'bg-white border border-zinc-200 text-black rounded-tl-sm shadow-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        
                                        {/* Product Recommendations Array */}
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="flex flex-col gap-3 mt-1">
                                                {msg.products.map(p => (
                                                    <div key={p._id} onClick={() => { setIsOpen(false); navigate(`/product/${p._id}`); }} className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-[#007aff] hover:shadow-md transition-all group">
                                                        <div className="w-12 h-12 bg-zinc-50 rounded-lg overflow-hidden shrink-0">
                                                            <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <h4 className="text-[10px] font-black uppercase line-clamp-1 italic">{p.name}</h4>
                                                            <p className="text-[9px] font-bold text-[#007aff]">{formatPrice(p.price)}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="text-zinc-300 group-hover:text-[#007aff] group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%] flex-row">
                                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-1 bg-black text-white">
                                        <Sparkles size={12} />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-black rounded-tl-sm shadow-sm flex items-center gap-1.5 h-10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-zinc-100 shrink-0">
                        <div className="relative flex items-center">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Describe your skin concern..." 
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-6 pr-14 py-4 text-[11px] font-medium outline-none focus:border-[#007aff] focus:bg-white transition-all placeholder:text-zinc-400"
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#007aff] disabled:opacity-50 disabled:hover:bg-black transition-colors"
                            >
                                <Send size={14} className={input.trim() ? "translate-x-0.5" : ""} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bubble Button */}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 relative group flex items-center justify-center hover:bg-[#007aff]">
                    <Sparkles size={24} className="sm:size-[26px]" />
                    <span className="absolute -top-1 -right-1 bg-[#007aff] w-4 h-4 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                        <span className="text-[9px] font-black">1</span>
                    </span>
                    {/* Tooltip */}
                    <span className="absolute right-[120%] top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl hidden sm:block italic">
                        Ask AI Assistant
                    </span>
                </button>
            )}
        </div>
    );
};

export default ChatBubble;
