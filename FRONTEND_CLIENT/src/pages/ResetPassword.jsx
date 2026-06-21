import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const ResetPassword = () => {
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
            setMessage('Password updated successfully. You can now log in.');
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
        <div className="max-w-md mx-auto animate-fade-in px-4 mt-8">
            <div className="text-center mb-12">
                <span className="text-[10px] font-medium tracking-[0.4em] text-gray-400 block mb-4">Security</span>
                <h1 className="text-4xl font-medium mb-2 tracking-normal">Set New Password<span className="text-[#007aff]">.</span></h1>
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
                    <label className="block text-[10px] font-medium tracking-[0.3em] text-gray-400 mb-3 ml-1">New Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300 pr-12"
                            placeholder="••••••••"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-medium tracking-[0.3em] text-gray-400 mb-3 ml-1">Confirm Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300 pr-12"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-[#007aff] transition-all duration-500 py-5 rounded-2xl tracking-[0.25em] text-[11px] font-medium shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,122,255,0.3)] transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Update Password'}
                </button>
            </form>

            <div className="mt-12 text-center">
                <Link to="/login" className="inline-block px-8 py-3 bg-gray-50 rounded-full text-[10px] font-medium tracking-widest text-black hover:bg-black hover:text-white transition-all">
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
