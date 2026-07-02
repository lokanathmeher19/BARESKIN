import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const Login = () => {
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
                // Permanently ban admins from standard user login
                if (userData.isAdmin) {
                    logout();
                    setError('Access Denied: Administrators must use the secure Admin Portal (/admin) to log in.');
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
                    setError('Access Denied: Administrators must use the secure Admin Portal (/admin) to log in.');
                    return;
                }
                localStorage.setItem('token', data.token);
                // Trigger context reload via login method if it supports token, or just reload page
                window.location.href = '/'; 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login Failed');
        }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in px-4 mt-8">
            <div className="text-center mb-12">
                <span className="text-[10px] font-medium  tracking-[0.4em] text-gray-400 block mb-4 ">Boutique Experience</span>
                <h1 className="text-5xl font-medium mb-2 tracking-normal  ">Welcome Back<span className="text-[#007aff]">.</span></h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-5 mb-8 text-[11px] font-normal text-center border border-red-100 rounded-2xl  tracking-wider animate-shake">
                    {error}
                </div>
            )}

            {message && !error && (
                <div className="bg-green-50 text-green-600 p-5 mb-8 text-[11px] font-normal text-center border border-green-100 rounded-2xl  tracking-wider animate-fade-in">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-[10px] font-medium  tracking-[0.3em] text-gray-400 mb-3 ml-1 ">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300"
                        placeholder="yourname@gmail.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-medium  tracking-[0.3em] text-gray-400 mb-3 ml-1 ">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300"
                        placeholder="••••••••"
                        required
                    />
                </div>
                
                <button type="submit" className="w-full bg-black text-white hover:bg-[#007aff] transition-all duration-500 py-5 rounded-2xl  tracking-[0.25em] text-[11px] font-medium shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,122,255,0.3)] transform hover:-translate-y-1 active:scale-95">
                    Sign In
                </button>

                <div className="flex items-center justify-center my-6 gap-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Or continue with</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setError('Google Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                        text="continue_with"
                    />
                </div>
            </form>

            <div className="mt-12 text-center">
                <p className="text-[10px] font-normal text-gray-400  tracking-widest mb-4 ">Don't have an account?</p>
                <Link to="/register" className="inline-block px-8 py-3 bg-gray-50 rounded-full text-[10px] font-medium  tracking-widest text-black hover:bg-black hover:text-white transition-all">
                    Create Account
                </Link>
            </div>
        </div>
    );
};

export default Login;
