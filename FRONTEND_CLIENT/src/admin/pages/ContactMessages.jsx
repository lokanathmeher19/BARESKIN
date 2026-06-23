import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/contact`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages(data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch contact messages');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/contact/${id}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Message marked as read');
            fetchMessages();
        } catch (error) {
            toast.error('Failed to update message');
        }
    };

    const deleteMessage = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/contact/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                toast.success('Message deleted');
                fetchMessages();
            } catch (error) {
                toast.error('Failed to delete message');
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center italic text-zinc-500 uppercase tracking-widest text-xs font-bold">Loading Messages...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Customer <span className="text-[#007aff]">Queries</span></h1>
                    <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase italic mt-2">Manage contact form submissions</p>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                    Total: {messages.length}
                </div>
            </header>

            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl shadow-zinc-200/50">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <Mail className="mx-auto text-zinc-300 mb-4" size={48} />
                        <p className="text-zinc-500 italic text-sm">No messages received yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div key={msg._id} className={`p-6 rounded-2xl border transition-all ${msg.isRead ? 'bg-zinc-50 border-zinc-100' : 'bg-white border-[#007aff]/30 shadow-md shadow-[#007aff]/5'}`}>
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            {msg.isRead ? <MailOpen size={16} className="text-zinc-400" /> : <Mail size={16} className="text-[#007aff]" />}
                                            <h3 className="text-sm font-black uppercase tracking-widest italic">{msg.subject}</h3>
                                        </div>
                                        <p className="text-xs text-zinc-500 italic"><span className="font-bold text-black">{msg.name}</span> ({msg.email})</p>
                                    </div>
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic whitespace-nowrap">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                <p className="text-sm text-zinc-600 leading-relaxed italic bg-white p-4 rounded-xl border border-zinc-100 mt-4 mb-6">
                                    {msg.message}
                                </p>

                                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                                    {!msg.isRead && (
                                        <button 
                                            onClick={() => markAsRead(msg._id)}
                                            className="text-[10px] font-black uppercase tracking-widest italic text-[#007aff] hover:text-blue-800 transition-colors px-4 py-2 bg-[#007aff]/10 rounded-full"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteMessage(msg._id)}
                                        className="text-[10px] font-black uppercase tracking-widest italic text-red-500 hover:text-red-700 transition-colors px-4 py-2 bg-red-500/10 rounded-full flex items-center gap-2"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactMessages;
