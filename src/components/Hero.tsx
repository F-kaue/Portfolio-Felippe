import React, { useEffect, useRef } from 'react';
import TypingAnimation from './TypingAnimation';
import ProgrammerAvatar from './ProgrammerAvatar';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  const codingTexts = [
    'def desenvolvedor_web():',
    'class DesenvolvimentoWeb:',
    '<Developer name="Felippe Kauê" />',
    'while(true) { learn(); code(); improve(); }',
    'console.log("Vamos construir algo incrível!")',
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animateElements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    animateElements?.forEach((el) => {
      observer.observe(el);
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      const elements = sectionRef.current?.querySelectorAll('.magnetic-effect');
      elements?.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.02;
        const deltaY = (e.clientY - centerY) * 0.02;
        
        (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
      });
    };

    const handleMouseLeave = () => {
      const elements = sectionRef.current?.querySelectorAll('.magnetic-effect');
      elements?.forEach((element) => {
        (element as HTMLElement).style.transform = 'translate(0, 0) scale(1)';
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      animateElements?.forEach((el) => {
        observer.unobserve(el);
      });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden animated-bg" ref={sectionRef}>
      <div className="section-container flex flex-col lg:flex-row items-center justify-center text-center lg:text-left z-10 gap-12">
        
        {/* Avatar Lottie - lado esquerdo em desktop, topo em mobile */}
        <div className="animate-on-scroll order-1 lg:order-1 flex-shrink-0">
          <div className="w-64 h-64 lg:w-80 lg:h-80 floating magnetic-effect">
            <ProgrammerAvatar />
          </div>
        </div>

        {/* Conteúdo principal - lado direito em desktop */}
        <div className="flex flex-col items-center lg:items-start order-2 lg:order-2 flex-1">
          <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-7xl font-bold mb-4 magnetic-effect">
            Olá, eu sou <span className="gradient-text pulse-glow">Felippe Kauê</span>
          </h1>
          
          <div className="animate-on-scroll delay-200 text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300 floating">
            <span className="mr-2 text-shimmer">{'<'}</span>
            <TypingAnimation texts={codingTexts} />
            <span className="ml-2 text-shimmer">{'/>'}</span>
          </div>
          
          <p className="animate-on-scroll delay-300 text-lg md:text-xl max-w-2xl mb-10 text-gray-400 magnetic-effect">
            Desenvolvedor Web apaixonado por criar soluções elegantes para problemas complexos.
            Especializado em Java, Python, React e integração de APIs com foco em automação.
          </p>
          
          <div className="animate-on-scroll delay-500 flex flex-col sm:flex-row gap-4">
            <a 
              href="#projects" 
              className="morphing-border bg-highlight-blue hover:bg-highlight-blue/80 text-white px-8 py-4 rounded-full transition-all duration-300 font-medium interactive-glow magnetic-effect"
            >
              Ver Projetos
            </a>
            
            <a 
              href="#contact" 
              className="morphing-border bg-transparent border border-white/20 hover:border-highlight-green text-white px-8 py-4 rounded-full transition-all duration-300 font-medium interactive-glow magnetic-effect"
            >
              Entre em Contato
            </a>
          </div>
        </div>
      </div>
      
      <a
        href="#about"
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          "flex items-center justify-center w-12 h-12",
          "rounded-full border border-white/20 bg-background/50",
          "animate-bounce cursor-pointer transition-all duration-300",
          "hover:border-highlight-blue hover:bg-background/80",
          "floating interactive-glow"
        )}
      >
        <ArrowDown className="w-5 h-5 text-gray-300" />
      </a>
    </section>
  );
};

export default Hero;
