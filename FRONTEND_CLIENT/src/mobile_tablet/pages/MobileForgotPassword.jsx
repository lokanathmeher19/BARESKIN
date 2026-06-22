import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MobileForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/forgotpassword', { 
                email,
                frontendUrl: window.location.origin
            });
            setMessage(res.data.message || 'Check your email for the reset link.');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white px-6 py-10 flex flex-col justify-center animate-fade-in pb-24">
            <div className="text-center mb-10">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-2">Account Recovery</span>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Forgot Password<span className="text-[#007aff]">.</span></h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 mb-6 text-[10px] font-bold text-center border border-red-100 rounded-2xl tracking-widest uppercase">
                    {error}
                </div>
            )}

            {message && !error && (
                <div className="bg-green-50 text-green-600 p-4 mb-6 text-[10px] font-bold text-center border border-green-100 rounded-2xl tracking-widest uppercase">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic"
                        placeholder="EMAIL ADDRESS"
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white active:scale-95 transition-transform py-4 rounded-2xl tracking-widest text-[10px] font-black uppercase italic shadow-lg disabled:opacity-50"
                >
                    {loading ? 'SENDING...' : 'SEND RESET LINK'}
                </button>
            </form>

            <div className="mt-12 text-center">
                <Link to="/login" className="inline-block px-8 py-3 bg-zinc-50 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default MobileForgotPassword;
