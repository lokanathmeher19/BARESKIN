import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const { register, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await register(name, email, password);
            if (success) {
                logout(); 
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login', { state: { message: 'Your account is ready. Please sign in.' } });
                }, 3000);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
            if (data.success) {
                logout(); 
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login', { state: { message: 'Your account is ready. Please sign in.' } });
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google Registration Failed');
        }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in px-4 mt-8">
            {isSuccess ? (
                <div className="text-center py-20 bg-green-50/30 rounded-[3rem] border border-green-100 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-medium  tracking-normal  mb-4">Registration Successful<span className="text-green-500">.</span></h2>
                    <p className="text-[10px] font-normal text-gray-500  tracking-[0.3em] mb-10 ">Your account has been created. Please sign in to continue.</p>
                    <Link to="/login" className="px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-medium  tracking-widest hover:bg-[#007aff] transition-all">
                        Proceed to Login
                    </Link>
                </div>
            ) : (
                <>
                <div className="text-center mb-12">
                    <span className="text-[10px] font-medium  tracking-[0.4em] text-gray-400 block mb-4 ">Boutique Community</span>
                    <h1 className="text-5xl font-medium mb-2 tracking-normal  ">Join Us<span className="text-[#007aff]">.</span></h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-5 mb-8 text-[11px] font-normal text-center border border-red-100 rounded-2xl  tracking-wider animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-medium  tracking-[0.3em] text-gray-400 mb-3 ml-1 ">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300"
                            placeholder="e.g. Rahul Sharma"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-medium  tracking-[0.3em] text-gray-400 mb-3 ml-1 ">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4.5 text-[13px] font-normal focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all placeholder:text-gray-300"
                            placeholder="rahul@example.com"
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
                        Create Account
                    </button>

                    <div className="flex items-center justify-center my-6 gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Or register with</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                setError('Google Registration Failed');
                            }}
                            theme="filled_black"
                            shape="pill"
                            text="signup_with"
                        />
                    </div>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-normal text-gray-400  tracking-widest mb-4 ">Already Registered?</p>
                    <Link to="/login" className="inline-block px-8 py-3 bg-gray-50 rounded-full text-[10px] font-medium  tracking-widest text-black hover:bg-black hover:text-white transition-all">
                        Login
                    </Link>
                </div>
                </>
            )}
        </div>
    );
};

export default Register;
