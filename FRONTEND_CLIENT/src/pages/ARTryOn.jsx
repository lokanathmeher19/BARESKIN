import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Sparkles, RefreshCw, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ARTryOn = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [stream, setStream] = useState(null);
    const [activeShade, setActiveShade] = useState(null);
    const [intensity, setIntensity] = useState(0.3);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const shades = [
        { id: 'natural', name: 'Natural Glow', color: '#ffdbac' },
        { id: 'sand', name: 'Golden Sand', color: '#f1c27d' },
        { id: 'bronze', name: 'Deep Bronze', color: '#8d5524' },
        { id: 'rose', name: 'Rose Tint', color: '#ffb6c1' },
        { id: 'lavender', name: 'Cool Lavender', color: '#e6e6fa' }
    ];

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 1280, height: 720 } 
            });
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            setIsCameraReady(true);
            toast.success('Bio-Optical Link Established', {
                style: { background: '#000', color: '#fff', borderRadius: '15px', fontSize: '10px', fontStyle: 'italic', fontWeight: '900' }
            });
        } catch (err) {
            console.error("Camera error:", err);
            toast.error("Optical Access Denied. Check permissions.");
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // AR Simulation Loop
    useEffect(() => {
        if (!isCameraReady || !activeShade) return;

        let animationFrame;
        const render = () => {
            if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                const video = videoRef.current;
                
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;

                // Draw Camera Feed
                ctx.drawImage(video, 0, 0);

                // Apply Molecular Tint (AR Overlay)
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = activeShade.color;
                ctx.globalAlpha = intensity;
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                
                // Add Glow effect
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.1;
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                ctx.globalCompositeOperation = 'source-over';
            }
            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [isCameraReady, activeShade, intensity]);

    return (
        <div className="fixed inset-0 bg-black z-[2000] flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-8 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => navigate(-1)} className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white/20 transition-all">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#007aff] italic">Molecular AR Mirror</span>
                    <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">Bio-Metric Analysis<span className="text-[#007aff]">.</span></h1>
                </div>
                <div className="w-12 h-12 bg-[#007aff] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#007aff]/30">
                    <Sparkles size={20} />
                </div>
            </div>

            {/* Camera Viewport */}
            <div className="flex-grow relative flex items-center justify-center">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                />
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                />

                {/* AR Scanning UI Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-white/20 rounded-[4rem] flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-[#007aff]/40 rounded-[4rem] animate-pulse"></div>
                        <div className="w-full h-[1px] bg-[#007aff]/50 absolute animate-scan"></div>
                    </div>
                </div>

                {/* Status HUD */}
                <div className="absolute bottom-40 left-8 space-y-4">
                    <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Face Sync: Optimized</span>
                    </div>
                </div>
            </div>

            {/* Bottom Shade Selector */}
            <div className="bg-white rounded-t-[3rem] p-10 pb-16 space-y-10 animate-slide-in-bottom">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#007aff] mb-2 italic">Tint Intensity</h3>
                        <input 
                            type="range" min="0" max="0.8" step="0.05" value={intensity} 
                            onChange={(e) => setIntensity(parseFloat(e.target.value))}
                            className="w-64 accent-black"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Select Molecular Formula</span>
                         <div className="h-[1px] w-12 bg-zinc-100"></div>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {shades.map((shade) => (
                        <button
                            key={shade.id}
                            onClick={() => setActiveShade(shade)}
                            className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border transition-all min-w-[140px] ${
                                activeShade?.id === shade.id 
                                ? 'bg-black text-white border-black scale-105 shadow-2xl' 
                                : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-300'
                            }`}
                        >
                            <div 
                                className="w-12 h-12 rounded-full shadow-inner" 
                                style={{ backgroundColor: shade.color }}
                            ></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-center italic">{shade.name}</span>
                        </button>
                    ))}
                    <button 
                        onClick={() => setActiveShade(null)}
                        className="flex flex-col items-center gap-4 p-6 rounded-[2rem] border bg-zinc-50 border-zinc-100 text-zinc-400 min-w-[140px]"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center">
                            <X size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-center italic">Clear Bio-Link</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ARTryOn;
