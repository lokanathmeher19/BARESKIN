import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
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
            setMessage(res.data.message || 'If an account with that email exists, we sent a password reset link.');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in px-4 mt-8">
            <div className="text-center mb-12">
                <span className="text-[10px] font-medium tracking-[0.4em] text-gray-400 block mb-4">Account Recovery</span>
                <h1 className="text-4xl font-medium mb-2 tracking-normal">Forgot Password<span className="text-[#007aff]">.</span></h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-5 mb-8 text-[11px] font-normal text-center border border-red-100 rounded-2xl tracking-wider animate-shake">
                    {error}
                </div>
            )}

            {message && !error && (
                <div className="bg-green-50 text-green-600 p-5 mb-8 text-[11px] font-normal text-center border border-green-100 rounded-2xl tracking-wider animate-fade-in">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-[10px] font-medium tracking-[0.3em] text-gray-400 mb-3 ml-1">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300"
                        placeholder="yourname@gmail.com"
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-[#007aff] transition-all duration-500 py-5 rounded-2xl tracking-[0.25em] text-[11px] font-medium shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,122,255,0.3)] transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div className="mt-12 text-center">
                <Link to="/login" className="inline-block px-8 py-3 bg-gray-50 rounded-full text-[10px] font-medium tracking-widest text-black hover:bg-black hover:text-white transition-all">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
