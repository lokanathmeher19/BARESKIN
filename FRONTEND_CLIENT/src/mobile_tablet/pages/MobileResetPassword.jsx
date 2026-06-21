import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';

const MobileResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await api.put(`/auth/resetpassword/${token}`, { password });
            setMessage('Password updated successfully!');
            setTimeout(() => {
                navigate('/login', { state: { message: 'Password reset successful. Please sign in.' } });
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white px-6 py-10 flex flex-col justify-center animate-fade-in pb-24">
            <div className="text-center mb-10">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-2">Security</span>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">New Password<span className="text-[#007aff]">.</span></h1>
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
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic pr-12"
                            placeholder="NEW PASSWORD"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic pr-12"
                            placeholder="CONFIRM NEW PASSWORD"
                            required
                        />
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white active:scale-95 transition-transform py-4 rounded-2xl tracking-widest text-[10px] font-black uppercase italic shadow-lg disabled:opacity-50"
                >
                    {loading ? 'SAVING...' : 'UPDATE PASSWORD'}
                </button>
            </form>

            <div className="mt-12 text-center">
                <Link to="/login" className="inline-block px-8 py-3 bg-zinc-50 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default MobileResetPassword;
