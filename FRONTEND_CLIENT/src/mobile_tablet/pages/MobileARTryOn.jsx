import React, { useRef, useState, useEffect } from 'react';
import { X, Sparkles, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MobileARTryOn = () => {
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
        { id: 'lavender', name: 'Lavender', color: '#e6e6fa' }
    ];

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 480, height: 640 } 
            });
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            setIsCameraReady(true);
            toast.success('Bio-Optical Link Active', {
                style: { background: '#000', color: '#fff', borderRadius: '15px', fontSize: '10px', fontWeight: '900' }
            });
        } catch (err) {
            toast.error("Camera Access Denied.");
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

    useEffect(() => {
        if (!isCameraReady || !activeShade) return;
        let animationFrame;
        const render = () => {
            if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                const video = videoRef.current;
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;

                ctx.drawImage(video, 0, 0);

                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = activeShade.color;
                ctx.globalAlpha = intensity;
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                
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
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => navigate(-1)} className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white">
                    <ChevronLeft size={16} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#007aff] italic">Mobile AR</span>
                    <h1 className="text-sm font-black italic text-white tracking-tighter uppercase">Bio-Metric<span className="text-[#007aff]">.</span></h1>
                </div>
                <div className="w-10 h-10 bg-[#007aff] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={16} />
                </div>
            </div>

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

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] border-2 border-white/20 rounded-[3rem] flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-[#007aff]/40 rounded-[3rem] animate-pulse"></div>
                        <div className="w-full h-[1px] bg-[#007aff]/50 absolute animate-scan"></div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-t-[2.5rem] p-6 pb-8 space-y-6 animate-slide-in-bottom">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-[#007aff] italic">Tint Intensity</h3>
                    <input 
                        type="range" min="0" max="0.8" step="0.05" value={intensity} 
                        onChange={(e) => setIntensity(parseFloat(e.target.value))}
                        className="w-full accent-black"
                    />
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    <button 
                        onClick={() => setActiveShade(null)}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl border bg-zinc-50 border-zinc-100 text-zinc-400 min-w-[80px]"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center">
                            <X size={12} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-center italic">Clear</span>
                    </button>
                    {shades.map((shade) => (
                        <button
                            key={shade.id}
                            onClick={() => setActiveShade(shade)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all min-w-[80px] ${
                                activeShade?.id === shade.id 
                                ? 'bg-black text-white border-black scale-105' 
                                : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                            }`}
                        >
                            <div 
                                className="w-8 h-8 rounded-full shadow-inner" 
                                style={{ backgroundColor: shade.color }}
                            ></div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-center italic">{shade.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileARTryOn;
