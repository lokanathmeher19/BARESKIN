import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BackButton from '../components/BackButton';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
    {
        category: "Orders & Shipping",
        questions: [
            { q: "How long does shipping take?", a: "Standard shipping typically takes 3-5 business days within the country. Express shipping is available for 1-2 day delivery." },
            { q: "Do you ship internationally?", a: "Currently, we ship to select countries. Please check our checkout page to see if your country is supported." },
            { q: "How can I track my order?", a: "Once your order ships, you will receive an email with a tracking link. You can also track your order in your Profile under 'My Orders'." }
        ]
    },
    {
        category: "Products & Usage",
        questions: [
            { q: "Are your products cruelty-free?", a: "Yes, 100%. We never test on animals and require all our ingredient suppliers to adhere to the same standard." },
            { q: "Can I use multiple serums together?", a: "Yes, but we recommend applying them from thinnest to thickest consistency. Avoid mixing strong actives like Retinol and Vitamin C simultaneously; use one in the AM and the other in the PM." },
            { q: "Are the products safe during pregnancy?", a: "While most of our products are safe, we advise avoiding Retinol and Salicylic Acid during pregnancy. Always consult your doctor before starting a new routine." }
        ]
    },
    {
        category: "Returns & Refunds",
        questions: [
            { q: "What is your return policy?", a: "We offer a 7-day return window for unopened products. If you experience an adverse reaction, please contact our support team immediately." },
            { q: "How long do refunds take?", a: "Refunds are processed within 3-5 business days after we receive and inspect the returned item." }
        ]
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
            <Helmet>
                <title>FAQ | BareSkin</title>
            </Helmet>
            
            <BackButton className="mb-12" />
            
            <header className="mb-16 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] italic mb-6 block">Help Center</span>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                    Got <span className="text-zinc-300">Questions?</span>
                </h1>
            </header>

            <div className="space-y-16">
                {faqData.map((section, sIdx) => (
                    <div key={sIdx}>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b border-zinc-200 pb-4">{section.category}</h2>
                        <div className="space-y-4">
                            {section.questions.map((item, qIdx) => {
                                const index = `${sIdx}-${qIdx}`;
                                const isOpen = openIndex === index;
                                return (
                                    <div key={index} className="bg-zinc-50 rounded-2xl overflow-hidden transition-all duration-300">
                                        <button 
                                            className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            <span className="font-bold text-sm uppercase tracking-wider italic pr-4">{item.q}</span>
                                            {isOpen ? <ChevronUp className="text-[#007aff] shrink-0" size={20} /> : <ChevronDown className="text-zinc-400 shrink-0" size={20} />}
                                        </button>
                                        <div className={`px-6 pb-6 text-sm text-zinc-500 italic leading-relaxed transition-all duration-300 ${isOpen ? 'block animate-fade-in' : 'hidden'}`}>
                                            {item.a}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-20 text-center bg-black text-white p-12 rounded-3xl">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Still need help?</h3>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest italic mb-8">Our support team is here for you.</p>
                <a href="/contact" className="inline-block bg-white text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest italic hover:bg-[#007aff] hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10 hover:shadow-[#007aff]/30">
                    Contact Us
                </a>
            </div>
        </div>
    );
};

export default FAQ;
