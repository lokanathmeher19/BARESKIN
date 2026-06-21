import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../utils/api';
import { CheckCircle2 } from 'lucide-react';

const MobileRegister = () => {
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
                setTimeout(() => navigate('/login', { state: { message: 'Account ready. Please sign in.' } }), 2000);
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
                setTimeout(() => navigate('/login', { state: { message: 'Account ready. Please sign in.' } }), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="w-full min-h-screen bg-white px-6 py-10 flex flex-col justify-center animate-fade-in pb-24">
            {isSuccess ? (
                <div className="text-center py-16 bg-green-50 rounded-[2rem] border border-green-100 flex flex-col items-center">
                    <CheckCircle2 size={64} className="text-green-500 mb-6" />
                    <h2 className="text-2xl font-black uppercase italic tracking-tight mb-2">Welcome<span className="text-green-500">.</span></h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">Routing to Login...</p>
                </div>
            ) : (
                <>
                <div className="text-center mb-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-2">Join the Club</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Register<span className="text-[#007aff]">.</span></h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 mb-6 text-[10px] font-bold text-center border border-red-100 rounded-2xl tracking-widest uppercase">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic"
                        placeholder="FULL NAME"
                        required
                    />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic"
                        placeholder="EMAIL ADDRESS"
                        required
                    />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#007aff]/20 rounded-2xl px-5 py-4 text-xs font-black italic outline-none transition-all placeholder:text-zinc-300 placeholder:not-italic"
                        placeholder="PASSWORD"
                        required
                    />
                    
                    <button type="submit" className="w-full bg-[#007aff] text-white active:scale-95 transition-transform py-4 rounded-2xl tracking-widest text-[10px] font-black uppercase italic shadow-lg shadow-[#007aff]/30">
                        Create Account
                    </button>

                    <div className="flex items-center justify-center my-6 gap-4">
                        <div className="h-px bg-zinc-100 flex-1"></div>
                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold">Or</span>
                        <div className="h-px bg-zinc-100 flex-1"></div>
                    </div>

                    <div className="flex justify-center scale-90">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Registration Failed')}
                            theme="filled_blue"
                            shape="pill"
                            text="signup_with"
                        />
                    </div>
                </form>

                <div className="mt-12 text-center">
                    <Link to="/login" className="inline-block px-8 py-3 bg-zinc-50 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                        Already have an account?
                    </Link>
                </div>
                </>
            )}
        </div>
    );
};

export default MobileRegister;
