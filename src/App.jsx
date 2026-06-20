import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Instagram, Rocket, Users, ChevronRight, Globe, Wrench, 
  ArrowRight, Menu, X, Target, Zap, Sun, Moon, Cpu, Code, 
  Award, Star, ShieldCheck, Layers, Github,
  BookOpen, Network
} from 'lucide-react';
// --- CONTESTO TEMA ---
const ThemeContext = React.createContext({ isDark: true, toggleTheme: () => {} });

// --- HOOK ANIMAZIONI BASE ---
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (containerRef.current) observer.unobserve(containerRef.current);
      }
    }, options);

    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

const FadeInSection = ({ children, delay = 'delay-0', className = "" }) => {
  const [ref, isVisible] = useElementOnScreen({ threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out will-change-transform ${isVisible ? `opacity-100 translate-y-0 ${delay}` : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
};

// --- FASCIO NEON GLOBALE (Solo Linea, No Flare) ---
const GlobalNeonBeam = () => {
  const trackRef = useRef(null);
  const { isDark } = React.useContext(ThemeContext);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const progress = h > 0 ? window.scrollY / h : 0;
      
      if (trackRef.current) {
        trackRef.current.style.transform = `scaleY(${progress})`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-1.5 h-full z-50 pointer-events-none">
      {/* Binario spento */}
      <div className={`absolute inset-0 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}></div>
      
      {/* Linea Neon */}
      <div 
        ref={trackRef} 
        className={`w-full h-full origin-top will-change-transform ${
          isDark 
            ? 'bg-gradient-to-b from-cyan-400 via-purple-500 to-emerald-400 shadow-[0_0_15px_1px_rgba(168,85,247,0.6)]' 
            : 'bg-gradient-to-b from-blue-400 via-purple-400 to-emerald-400 shadow-[0_0_10px_1px_rgba(168,85,247,0.4)]'
        }`}
        style={{ transform: 'scaleY(0)' }}
      ></div>
    </div>
  );
};

// --- BACKGROUND NEURONALE ---
const NeuralNetworkBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = React.useContext(ThemeContext);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000, radiusSq: 22500 }; 
    
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseOut = () => { mouse.x = -1000; mouse.y = -1000; };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 70); 
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.2 + 0.8
        });
      }
    };

    const drawParticles = () => {
      ctx.fillStyle = isDark ? '#0a0a0e' : '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';
      const lineColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,'; 
      const accentColors = isDark 
        ? ['rgba(59, 130, 246,', 'rgba(16, 185, 129,', 'rgba(234, 179, 8,'] 
        : ['rgba(37, 99, 235,', 'rgba(5, 150, 105,', 'rgba(202, 138, 4,'];

      ctx.fillStyle = particleColor;
      
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let distSq = dx*dx + dy*dy;
          
          if (distSq < 14400) { 
            let dist = Math.sqrt(distSq);
            let opacity = 1 - (dist / 120);
            let drawColor = ((i + j) % 15 === 0) ? accentColors[i % 3] : lineColor;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${drawColor} ${opacity * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        let mdx = p.x - mouse.x;
        let mdy = p.y - mouse.y;
        let mDistSq = mdx*mdx + mdy*mdy;
        if (mDistSq < mouse.radiusSq) {
           let distMouse = Math.sqrt(mDistSq);
           let opacityMouse = 1 - (distMouse / 150);
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.strokeStyle = isDark ? `rgba(234, 179, 8, ${opacityMouse * 0.5})` : `rgba(37, 99, 235, ${opacityMouse * 0.5})`; 
           ctx.lineWidth = 0.8;
           ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000" />;
};

// --- COMPONENTI LOGHI EUROPEI SVG ---
const EUFlag = () => {
  const stars = [];
  for(let i=0; i<12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const x = 50 + 25 * Math.sin(angle);
    const y = 50 - 25 * Math.cos(angle);
    stars.push(<polygon key={i} points="0,-4 1.1,-1 4,-1 1.7,1 2.5,4 0,2.3 -2.5,4 -1.7,1 -4,-1 -1.1,-1" fill="#FFCC00" transform={`translate(${x}, ${y}) scale(1.2)`} />);
  }
  return (
    <svg className="w-14 h-9 shadow-sm shrink-0 rounded-[2px]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#003399"/>{stars}
    </svg>
  );
};

const MinisteroEmblem = ({ isDark }) => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? "#94a3b8" : "#0f172a"} strokeWidth="2" strokeDasharray="6 4" />
    <circle cx="50" cy="50" r="32" fill="none" stroke={isDark ? "#94a3b8" : "#0f172a"} strokeWidth="5" />
    <polygon points="50,15 58,40 85,40 63,55 72,80 50,65 28,80 37,55 15,40 42,40" fill={isDark ? "#e2e8f0" : "#1e293b"} />
    <path d="M10,50 Q10,90 50,95 Q90,90 90,50" fill="none" stroke={isDark ? "#94a3b8" : "#0f172a"} strokeWidth="3" />
    <path d="M20,60 L15,70 M80,60 L85,70 M25,75 L20,85 M75,75 L80,85" stroke={isDark ? "#94a3b8" : "#0f172a"} strokeWidth="3" />
  </svg>
);

// --- COMPONENTE LOGO DEEPBOT ---
const DeepbotLogo = () => {
  const { isDark } = React.useContext(ThemeContext);
  return (
    <div className="flex flex-col items-center justify-center group cursor-pointer">
      <div className={`flex items-center text-2xl md:text-3xl font-black italic tracking-tighter transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <span className="pr-0.5">deepb</span>
        <div className="relative w-5 h-5 md:w-6 md:h-6 mx-0.5 rounded-full bg-yellow-400 border-[3px] border-black flex items-center justify-center overflow-hidden group-hover:rotate-180 transition-transform duration-700 shadow-md">
          <div className="absolute inset-0 flex items-center justify-center rotate-45"><div className="w-full h-1 bg-black"></div></div>
          <div className="absolute inset-0 flex items-center justify-center -rotate-45"><div className="w-full h-1 bg-black"></div></div>
          <div className="w-2 h-2 bg-black rounded-full z-10"></div>
        </div>
        <span className="pl-0.5">t</span>
      </div>
      <div className="w-[95%] h-1 mt-1 flex rounded-full overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity shadow-sm">
        <div className="h-full bg-[#009246] flex-1"></div>
        <div className="h-full bg-white flex-1"></div>
        <div className="h-full bg-[#CE2B37] flex-1"></div>
      </div>
    </div>
  );
};

// --- MENU FLUIDO ---
const FluidMenu = () => {
  const { isDark } = React.useContext(ThemeContext);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const menuItems = [
    { label: "Home", href: "#home" },
    { label: "Garage", href: "#progetti" },
    { label: "Road To", href: "#roadtoftc" },
    { label: "Il Team", href: "#team-persone" }
  ];

  return (
    <nav className={`hidden lg:flex relative p-1.5 rounded-full backdrop-blur-md transition-colors duration-500 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/50 border-slate-300 shadow-inner'}`} onMouseLeave={() => setHoveredIndex(null)}>
      <div 
        className="absolute top-1.5 bottom-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-300 ease-out will-change-transform"
        style={{ opacity: hoveredIndex !== null ? 1 : 0, left: hoveredIndex !== null ? `calc(${hoveredIndex * (100 / menuItems.length)}% + 6px)` : '6px', width: `calc(${100 / menuItems.length}% - 12px)` }}
      ></div>
      {menuItems.map((item, index) => (
        <a key={item.label} href={item.href} className={`relative z-10 w-24 text-center py-2 text-sm font-bold transition-colors duration-300 ${hoveredIndex === index ? 'text-black' : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`} onMouseEnter={() => setHoveredIndex(index)}>
          {item.label}
        </a>
      ))}
    </nav>
  );
};

// --- INFINITE CAROUSEL COMPONENT ---
const InfiniteCarousel = ({ items, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const extendedItems = [
    items[items.length - 2],
    items[items.length - 1],
    ...items,
    items[0],
    items[1]
  ];

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev + 1);
  };
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
  };

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (currentIndex === items.length) setCurrentIndex(0);
      else if (currentIndex === -1) setCurrentIndex(items.length - 1);
    }, 500); 
    return () => clearTimeout(timer);
  }, [currentIndex, items.length, isAnimating]);

  return (
    <div className="relative w-full overflow-hidden px-4 md:px-0">
      <div 
        className={`flex gap-6 ease-in-out will-change-transform ${isAnimating ? 'transition-transform duration-500' : ''}`}
        style={{ transform: `translateX(calc(-${(currentIndex + 2) * 344}px + 50vw - 160px))` }}
      >
        {extendedItems.map((member, i) => (
          <div key={`${member.name}-${i}`} className={`w-80 shrink-0 group rounded-[2rem] border overflow-hidden transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#151720]/80 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`relative w-full aspect-square overflow-hidden flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
               <span className={`font-black text-4xl tracking-widest transition-transform duration-500 group-hover:scale-110 ${isDark ? 'text-blue-500/30' : 'text-blue-400/50'}`}>IMG</span>
               <div className={`absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity ${isDark ? 'from-[#151720] via-transparent to-transparent' : 'from-white via-transparent to-transparent'}`}></div>
            </div>
            <div className="p-6 relative z-10 -mt-12 text-left">
               <span className="inline-block px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 shadow-md">{member.area}</span>
               <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{member.name}</h3>
               <p className={`text-sm font-medium mb-5 ${isDark ? 'text-yellow-500' : 'text-blue-600'}`}>{member.role}</p>
               <div className="flex gap-3">
                  <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'}`}><Instagram className="w-4 h-4" /></a>
                  <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'}`}><Github className="w-4 h-4" /></a>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-20">
         <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${isDark ? 'bg-[#12141c]/90 border-white/20 text-white hover:bg-white/20' : 'bg-white/90 border-slate-300 text-slate-800 hover:bg-slate-100 shadow-md backdrop-blur-sm'}`} onClick={handlePrev}>
           <ChevronRight className="w-6 h-6 rotate-180" />
         </button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 z-20">
         <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${isDark ? 'bg-[#12141c]/90 border-white/20 text-white hover:bg-white/20' : 'bg-white/90 border-slate-300 text-slate-800 hover:bg-slate-100 shadow-md backdrop-blur-sm'}`} onClick={handleNext}>
           <ChevronRight className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

// --- ROAD TO FTC ---
const RoadToFTC = () => {
  const { isDark } = React.useContext(ThemeContext);
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);

  const timelineData = [
    { year: "2024", title: "Il Debutto", desc: "Le prime sfide ingegneristiche e l'apprendimento del lavoro di squadra sotto pressione.", status: "Foundation", color: "emerald", icon: <Target className="w-6 h-6" />, threshold: 0.15 },
    { year: "2025", title: "Stagione in Corso", desc: "Ottimizzazione della telemetria, riduzione dei pesi e miglioramento dei materiali costruttivi.", status: "Current Era", color: "yellow", icon: <Zap className="w-6 h-6" />, threshold: 0.50 },
    { year: "2026", title: "Visione Futura", desc: "Studio di logiche autonome guidate da AI vision, machine learning e sensori avanzati.", status: "Next Gen", color: "purple", icon: <Rocket className="w-6 h-6" />, threshold: 0.85 }
  ];

  useEffect(() => {
    let ticking = false;
    const updateTimeline = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const scrollDistance = viewportCenter - rect.top;
        let progress = Math.max(0, Math.min(1, scrollDistance / rect.height));
        
        if (lineRef.current) {
          lineRef.current.style.transform = `scaleY(${progress})`;
        }

        timelineData.forEach((item, index) => {
          const node = nodeRefs.current[index];
          if (node) {
            if (progress > item.threshold) {
              node.classList.add('node-active');
            } else {
              node.classList.remove('node-active');
            }
          }
        });
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTimeline);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateTimeline();
    return () => window.removeEventListener('scroll', onScroll);
  }, [timelineData]);

  return (
    <section id="roadtoftc" ref={containerRef} className={`relative z-10 py-24 transition-colors duration-500 border-y overflow-hidden ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .timeline-node { transition: all 0.5s ease; opacity: 0.4; transform: scale(1); }
        .timeline-node.node-active { opacity: 1; transform: scale(1.15); box-shadow: 0 0 25px currentColor; }
        .timeline-node-inner { transition: border-color 0.5s ease; border-color: transparent; }
        .timeline-node.node-active .timeline-node-inner { border-color: currentColor; }
      `}} />

       <div className="container mx-auto px-6 lg:px-12">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className={`text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Road To <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">FTC</span>
            </h2>
            <p className={`text-lg font-medium mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>L'evoluzione competitiva del team anno dopo anno.</p>
          </div>
        </FadeInSection>

        <div className="max-w-5xl mx-auto relative">
          
          <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <div 
              ref={lineRef}
              className={`absolute top-0 left-0 w-full h-full rounded-full origin-top will-change-transform ${isDark ? 'bg-gradient-to-b from-emerald-500 via-yellow-400 to-purple-500 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'bg-gradient-to-b from-emerald-400 via-yellow-400 to-purple-500 shadow-[0_0_10px_rgba(250,204,21,0.4)]'}`}
              style={{ transform: 'scaleY(0)' }}
            >
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>

          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;
            const colorClasses = {
              emerald: { text: "text-emerald-500", border: "border-emerald-500", glow: "shadow-[0_0_25px_rgba(16,185,129,0.8)]" },
              yellow: { text: "text-yellow-500", border: "border-yellow-500", glow: "shadow-[0_0_25px_rgba(234,179,8,0.8)]" },
              purple: { text: "text-purple-500", border: "border-purple-500", glow: "shadow-[0_0_25px_rgba(168,85,247,0.8)]" }
            };
            const c = colorClasses[item.color];

            return (
              <FadeInSection key={item.year} delay={`delay-${index * 100}`}>
                <div className="relative flex flex-col md:flex-row justify-between items-center w-full mb-16 md:mb-24">
                  
                  <div 
                    ref={el => nodeRefs.current[index] = el}
                    className={`timeline-node hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 z-10 items-center justify-center ${c.text}
                      ${isDark ? `bg-[#0a0a0e] border-[#0a0a0e]` : `bg-slate-50 border-white`}
                    `}
                  >
                    <div className={`timeline-node-inner w-full h-full rounded-full flex items-center justify-center border-2 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                       {item.icon}
                    </div>
                  </div>

                  <div className={`w-full md:w-[45%] ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                    <div className={`p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${isDark ? 'bg-[#12141c]/80 border-white/10 backdrop-blur-md' : 'bg-white border-slate-200'}`}>
                       <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 ${c.text} ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>{item.status}</span>
                       <h3 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.year} <span className="text-xl font-bold opacity-70 block md:inline md:ml-2">{item.title}</span></h3>
                       <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                       
                       {/* PLACEHOLDER IMG */}
                       <div className={`w-full h-48 rounded-xl overflow-hidden border flex items-center justify-center relative group ${isDark ? 'border-white/10 bg-blue-900/30' : 'border-slate-200 bg-blue-100'}`}>
                          <span className={`font-black text-4xl tracking-widest transition-transform duration-500 group-hover:scale-110 ${isDark ? 'text-blue-500/30' : 'text-blue-400/50'}`}>IMG</span>
                          <div className={`absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity ${isDark ? 'from-[#151720] via-transparent to-transparent' : 'from-white via-transparent to-transparent'}`}></div>
                       </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </div>
       </div>
    </section>
  );
};


// --- MAIN APP ---
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if(!ticking) {
        window.requestAnimationFrame(() => {
           setScrolled(window.scrollY > 20);
           ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeContextValue = { isDark, toggleTheme };
  const bgClass = isDark ? 'bg-[#0a0a0e] text-slate-200' : 'bg-[#f8fafc] text-slate-800';

  const teamMembers = [
    { name: "Membro Team 1", role: "Team Captain / Lead Dev", area: "Polo Volta" },
    { name: "Membro Team 2", role: "Capo Meccanica CNC", area: "ENDOFAP" },
    { name: "Membro Team 3", role: "Programmatore Visione AI", area: "Polo Volta" },
    { name: "Membro Team 4", role: "Social & PR Manager", area: "Artù APS" },
    { name: "Membro Team 5", role: "Driver / Telemetria", area: "ENDOFAP" },
    { name: "Membro Team 6", role: "Assemblaggio Hardware", area: "ENDOFAP" }
  ];

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className={`min-h-screen font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden transition-colors duration-500 relative ${bgClass}`}>
        
        {/* FASCIO NEON GLOBALE - Solo linea */}
        <GlobalNeonBeam />

        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          html { scroll-behavior: smooth; }
        `}} />

        {/* BACKGROUNDS OPTIMIZED */}
        <NeuralNetworkBackground />
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen blur-[180px] opacity-30 animate-pulse ${isDark ? 'bg-blue-600/20' : 'bg-blue-300/40'}`} style={{animationDuration: '10s'}}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen blur-[180px] opacity-30 animate-pulse ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-300/40'}`} style={{animationDuration: '14s'}}></div>
        </div>

        {/* HEADER */}
        <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out will-change-transform ${scrolled ? `top-4 w-[95%] max-w-6xl rounded-full border shadow-lg py-2 backdrop-blur-xl ${isDark ? 'bg-[#0f111a]/85 border-white/10' : 'bg-white/85 border-slate-200'}` : `top-6 w-[95%] max-w-7xl rounded-2xl border py-4 backdrop-blur-md ${isDark ? 'bg-[#0f111a]/50 border-white/5' : 'bg-white/50 border-white/40 shadow-sm'}`}`}>
          <div className="px-6 md:px-8 flex justify-between items-center h-full">
            <div className="flex-shrink-0 z-50"><DeepbotLogo /></div>
            <div className="hidden lg:block"><FluidMenu /></div>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className={`group relative overflow-hidden backdrop-blur-sm px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border ${isDark ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' : 'bg-black hover:bg-slate-800 border-black text-white shadow-md'}`}>
                <Instagram className={`w-4 h-4 ${isDark ? 'text-pink-500' : 'text-pink-400'}`} /> Seguici
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2 z-50">
               <button onClick={toggleTheme} className={`p-2 rounded-full ${isDark ? 'text-yellow-400 bg-white/5' : 'text-slate-700 bg-slate-200'}`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className={`p-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-200'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className={`lg:hidden absolute top-full left-0 w-full mt-2 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300 origin-top border backdrop-blur-2xl ${isDark ? 'bg-[#0f111a]/95 border-white/10' : 'bg-white/95 border-slate-200'} ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
            {['Home', 'Garage', 'RoadToFTC', 'Team'].map((item) => (
               <a key={item} href={`#${item.toLowerCase().replace(' ','-')}`} onClick={() => setMobileMenuOpen(false)} className={`text-lg font-bold border-b pb-2 ${isDark ? 'text-white border-white/10' : 'text-slate-900 border-slate-100'}`}>{item}</a>
            ))}
          </div>
        </header>

        {/* HERO */}
        <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 z-10">
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10 pointer-events-none">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-md ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-emerald-100 border-emerald-200 text-emerald-700 shadow-sm'}`}>
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`}></span></span>
                Team FTC #23372
              </div>
              
              <h1 className={`text-5xl lg:text-7xl xl:text-8xl font-black leading-[1.05] tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Costruiamo il <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">Futuro</span><br/>
                della Robotica.
              </h1>
              
              <p className={`text-lg md:text-xl max-w-xl leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Siamo un team studentesco di Borgonovo V.T. Progettiamo, programmiamo e gareggiamo nella FIRST Tech Challenge.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 pointer-events-auto">
                <button className={`px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-black/10'}`}>
                  Esplora il Garage <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className={`relative w-full aspect-[4/5] md:aspect-[4/3] rounded-[2rem] overflow-hidden border shadow-2xl group pointer-events-none ${isDark ? 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-1000"></div>
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0a0a0e]' : 'from-slate-50/80'} via-transparent to-transparent`}></div>
              
              <div className={`absolute bottom-8 left-8 right-8 backdrop-blur-2xl border p-6 rounded-2xl shadow-2xl flex items-center gap-5 animate-bounce ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/90 border-white'}`} style={{ animationDuration: '4s' }}>
                 <div className="w-14 h-14 bg-yellow-400/20 rounded-xl flex items-center justify-center border border-yellow-400/30 shrink-0">
                   <Wrench className="w-7 h-7 text-yellow-500" />
                 </div>
                 <div>
                   <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest mb-1">In Lavorazione</p>
                   <p className={`text-xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Progetto E-Horizon</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="relative z-20 container mx-auto px-6 lg:px-12 -mt-12 mb-24 pointer-events-none">
          <div className={`backdrop-blur-2xl border rounded-[2rem] p-8 md:p-12 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x transition-colors duration-500 ${isDark ? 'bg-[#151720]/80 border-white/10 divide-white/5' : 'bg-white/90 border-slate-200 divide-slate-100'}`}>
            {[{ value: "#23372", label: "Team ID" }, { value: "3", label: "Poli Educativi" }, { value: "10+", label: "Sponsor Locali" }, { value: "2024", label: "Fondazione" }].map((stat, i) => (
               <div key={i} className={i % 2 !== 0 ? "border-none lg:border-solid" : ""}>
                 <p className={`text-4xl md:text-5xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                 <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
               </div>
            ))}
          </div>
        </section>

        {/* PROGETTI / GARAGE */}
        <section id="progetti" className={`relative z-10 py-24 transition-colors duration-500 border-y pointer-events-none ${isDark ? 'bg-[#050508]/40 border-white/5 backdrop-blur-md' : 'bg-slate-100/30 border-slate-200 backdrop-blur-sm'}`}>
          <div className="container mx-auto px-6 lg:px-12">
            <FadeInSection>
              <div className="mb-16 max-w-2xl">
                <span className={`text-sm font-bold uppercase tracking-widest mb-4 block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>R&D Hardware</span>
                <h2 className={`text-4xl md:text-6xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dentro al <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-white to-slate-500' : 'bg-gradient-to-r from-slate-900 to-slate-500'}`}>Garage</span></h2>
              </div>
            </FadeInSection>

            <div className="grid lg:grid-cols-12 gap-6">
              <FadeInSection className="lg:col-span-8">
                <div className={`group relative rounded-[2.5rem] overflow-hidden border h-[450px] lg:h-[550px] shadow-2xl ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                    <div className="bg-yellow-400 text-black text-xs font-black uppercase tracking-widest py-2 px-4 rounded-full w-max mb-6">In Evidenza</div>
                    <h3 className="text-4xl md:text-5xl font-black mb-4 text-white">E-Horizon</h3>
                    <p className="text-slate-200 mb-8 max-w-xl text-lg md:text-xl drop-shadow-lg">Rover sperimentale. Integra sistemi di visione artificiale e meccanismi di presa personalizzati stampati in 3D in materiali ultraleggeri.</p>
                  </div>
                </div>
              </FadeInSection>
              
              <div className="lg:col-span-4 flex flex-col gap-6">
                 <FadeInSection delay="delay-100" className="h-full">
                  <div className={`group relative rounded-[2.5rem] overflow-hidden border flex-1 p-8 flex flex-col justify-center shadow-lg transition-all hover:-translate-y-2 ${isDark ? 'border-white/10 bg-[#12141c]' : 'border-slate-300 bg-white'}`}>
                    <Layers className="w-10 h-10 text-yellow-500 mb-6" />
                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Stampa 3D Custom</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Disegniamo CAD e stampiamo in sede l'80% dei componenti strutturali per massimizzare la resistenza e ridurre il peso complessivo.</p>
                  </div>
                </FadeInSection>
                <FadeInSection delay="delay-200" className="h-full">
                  <div className={`group relative rounded-[2.5rem] overflow-hidden border flex-1 p-8 flex flex-col justify-center shadow-lg transition-all hover:-translate-y-2 ${isDark ? 'border-white/10 bg-gradient-to-br from-blue-900/40 to-[#12141c]' : 'border-slate-300 bg-gradient-to-br from-blue-50 to-white'}`}>
                    <Code className="w-10 h-10 text-blue-500 mb-6" />
                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Logica di Controllo</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sviluppo software per la telemetria in tempo reale e gestione dei sensori durante i periodi di navigazione completamente autonoma.</p>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </div>
        </section>

        {/* PREMI E CERTIFICAZIONI */}
        <section id="premi" className={`relative z-10 py-24 transition-colors duration-500 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
          <div className="container mx-auto px-6 lg:px-12">
            <FadeInSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                 <span className={`text-sm font-bold uppercase tracking-widest mb-4 block ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Riconoscimenti</span>
                <h2 className={`text-4xl md:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Certificazioni & <span className="text-yellow-500">Premi</span></h2>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Award/>, title: "Innovate Award", desc: "Per la soluzione meccanica più creativa presentata durante le qualificazioni regionali.", color: "text-purple-500", glow: "shadow-purple-500/20" },
                { icon: <Star/>, title: "Design Excellence", desc: "Riconoscimento per l'eccellenza nella modellazione CAD e per l'estetica industriale.", color: "text-yellow-500", glow: "shadow-yellow-500/20" },
                { icon: <ShieldCheck/>, title: "Impatto STEM", desc: "Certificazione locale per la promozione attiva della cultura robotica tra i giovani.", color: "text-emerald-500", glow: "shadow-emerald-500/20" }
              ].map((award, i) => (
                <FadeInSection key={i} delay={`delay-${i * 100}`}>
                  <div className={`p-8 rounded-[2rem] border relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${award.glow} backdrop-blur-md
                    ${isDark ? 'bg-[#151720]/80 border-white/10' : 'bg-white/90 border-slate-200'}
                  `}>
                    <div className={`absolute -top-4 -right-4 p-6 opacity-5 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700 ${award.color}`}>
                       {React.cloneElement(award.icon, { className: 'w-32 h-32' })}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border backdrop-blur-md relative z-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'} ${award.color}`}>
                      {React.cloneElement(award.icon, { className: 'w-6 h-6' })}
                    </div>
                    <h3 className={`text-xl font-bold mb-3 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>{award.title}</h3>
                    <p className={`text-sm leading-relaxed relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{award.desc}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ROAD TO FTC (Timeline 120Hz Optimized) */}
        <RoadToFTC />

        {/* IL NOSTRO TEAM (Carosello) */}
        <section id="team-persone" className={`relative z-10 py-32 transition-colors duration-500 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
          <div className="container mx-auto px-6 lg:px-12 mb-16 text-center pointer-events-none">
            <FadeInSection>
              <div className="max-w-2xl mx-auto">
                <Users className={`w-12 h-12 mx-auto mb-6 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
                <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Le menti dietro ai <span className="text-blue-500">Robot</span></h2>
                <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Studenti, programmatori, meccanici. Il cuore pulsante del progetto Deepbot.</p>
              </div>
            </FadeInSection>
          </div>

          <InfiniteCarousel items={teamMembers} isDark={isDark} />
        </section>

        {/* CAPSULA LOGHI EUROPEI / CERTIFICAZIONI */}
        <section className="relative z-20 pb-16 pt-8 pointer-events-none">
          <div className="container mx-auto px-6 lg:px-12 flex justify-center">
             <div className={`inline-flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-10 px-10 py-6 md:px-16 md:py-8 rounded-3xl md:rounded-full border backdrop-blur-2xl shadow-2xl pointer-events-auto transition-colors duration-500
               ${isDark ? 'bg-[#151720]/90 border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.6)]' : 'bg-white/90 border-slate-200 shadow-[0_15px_50px_rgba(0,0,0,0.1)]'}
             `}>
                
                <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-default group">
                   <EUFlag />
                   <div className="flex flex-col">
                     <span className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cofinanziato da</span>
                     <span className={`text-sm font-black uppercase tracking-wider leading-none ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>Unione Europea</span>
                     <span className={`text-[9px] font-bold tracking-widest mt-1 text-blue-500`}>NextGenerationEU</span>
                   </div>
                </div>
                
                <div className={`w-px h-12 hidden md:block ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                <div className={`h-px w-32 block md:hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                
                <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-default group">
                   <MinisteroEmblem isDark={isDark} />
                   <div className="flex flex-col">
                     <span className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ministero</span>
                     <span className={`text-sm font-black uppercase tracking-wider leading-none ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>Istruzione e Merito</span>
                   </div>
                </div>

                <div className={`w-px h-12 hidden md:block ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                <div className={`h-px w-32 block md:hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                
                <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-default group">
                   <div className="flex flex-col font-black leading-none tracking-tighter text-blue-600 text-3xl">PON</div>
                   <div className="flex flex-col">
                     <span className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fondi Strutturali</span>
                     <span className={`text-sm font-black uppercase tracking-wider leading-none ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>Per la Scuola</span>
                     <span className={`text-[9px] font-bold tracking-widest mt-1 text-emerald-500`}>2014 - 2020</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={`border-t relative z-10 pt-20 pb-10 transition-colors duration-500 ${isDark ? 'border-white/10 bg-[#050508]' : 'border-slate-300 bg-slate-100'}`}>
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-12 gap-12 mb-16 relative z-10">
              <div className="md:col-span-5">
                <div className="mb-6 inline-block"><DeepbotLogo /></div>
                <p className={`text-sm mb-8 leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Team di robotica studentesca. Progettiamo e programmiamo robot per la FIRST Tech Challenge. L'innovazione parte dai banchi di scuola.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/deepbot.robotics" target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full border flex items-center justify-center hover:scale-110 transition-transform ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-pink-500 hover:border-pink-500' : 'bg-white border-slate-300 text-slate-600 hover:text-pink-600 hover:border-pink-600 shadow-sm'}`}>
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="md:col-span-3">
                <h4 className={`font-bold text-lg mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Poli Educativi</h4>
                <ul className={`space-y-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> ENDOFAP Borgonovo</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> Polo Volta Castel S.G.</li>
                </ul>
              </div>
              <div className={`md:col-span-4 rounded-3xl p-8 border backdrop-blur-md ${isDark ? 'bg-[#12141c]/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-lg'}`}>
                <h4 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Contattaci</h4>
                <p className={`text-sm mb-6 flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><MapPin className="w-5 h-5 shrink-0 text-red-500" /> Borgonovo V.T. (PC)</p>
                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white shadow-md'}`}>Richiedi Info</button>
              </div>
            </div>
            <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase ${isDark ? 'border-white/10 text-slate-600' : 'border-slate-300 text-slate-400'}`}>
              <p>&copy; 2026 Team FTC #23372 - Deepbot Robotics</p>
              <p>Engineering the future</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}