import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../utils/api';

const MobileLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(email, password);
            if (userData) {
                if (userData.isAdmin) {
                    logout();
                    setError('Admins must use Desktop Portal.');
                    return;
                }
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
            if (data.success) {
                if (data.isAdmin) {
                    logout();
                    setError('Admins must use Desktop Portal.');
                    return;
                }
                localStorage.setItem('token', data.token);
                window.location.href = '/'; 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login Failed');
        }
    };

    return (
        <div className="w-full min-h-screen bg-white px-6 py-10 flex flex-col justify-center animate-fade-in pb-24">
            <div className="text-center mb-10">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-2">BareSkin App</span>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Sign In<span className="text-[#007aff]">.</span></h1>
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
                <div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic"
                        placeholder="PASSWORD"
                        required
                    />
                </div>
                
                <button type="submit" className="w-full bg-black text-white active:scale-95 transition-transform py-4 rounded-2xl tracking-widest text-[10px] font-black uppercase italic shadow-lg">
                    Sign In
                </button>

                <div className="flex items-center justify-center my-6 gap-4">
                    <div className="h-px bg-zinc-100 flex-1"></div>
                    <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold">Or</span>
                    <div className="h-px bg-zinc-100 flex-1"></div>
                </div>

                <div className="flex justify-center scale-90">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                        theme="filled_black"
                        shape="pill"
                        text="continue_with"
                    />
                </div>
            </form>

            <div className="mt-12 text-center">
                <Link to="/register" className="inline-block px-8 py-3 bg-zinc-50 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Create New Account
                </Link>
            </div>
        </div>
    );
};

export default MobileLogin;
