
import React, { useEffect, useRef } from 'react';
import TypingAnimation from './TypingAnimation';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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

    // Subtle mouse movement effect
    const handleMouseMove = (e: MouseEvent) => {
      const elements = sectionRef.current?.querySelectorAll('.magnetic-effect');
      elements?.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.008;
        const deltaY = (e.clientY - centerY) * 0.008;
        
        (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    };

    const handleMouseLeave = () => {
      const elements = sectionRef.current?.querySelectorAll('.magnetic-effect');
      elements?.forEach((element) => {
        (element as HTMLElement).style.transform = 'translate(0, 0)';
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
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center overflow-hidden animated-bg" 
      ref={sectionRef}
    >
      <div className="section-container flex flex-col items-center justify-center text-center z-10">
        {/* Main Title - Clean and Simple */}
        <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-7xl font-bold mb-6 magnetic-effect">
          <span className="block text-white mb-2">Desenvolvedor Full Stack —</span>
          <span className="block gradient-text">Criação de Sites e Sistemas Personalizados</span>
        </h1>
        
        {/* Typing Animation - Simplified */}
        <div className="animate-on-scroll delay-200 text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300">
          <span className="text-blue-400">{'<'}</span>
          <TypingAnimation texts={codingTexts} />
          <span className="text-blue-400">{'/>'}</span>
        </div>
        
        {/* Description - Clean */}
        <p className="animate-on-scroll delay-300 text-lg md:text-xl max-w-2xl mb-10 text-gray-400 magnetic-effect">
          Sou <strong className="text-white">Felippe Kauê</strong>, desenvolvedor Full Stack especializado em criar 
          <strong className="text-highlight-blue"> sites profissionais</strong>, 
          <strong className="text-highlight-green"> sistemas sob medida</strong> e 
          <strong className="text-purple-400"> automações inteligentes</strong> que geram resultados reais para empresas e profissionais.
        </p>
        
        {/* CTA Buttons - Clean Design */}
        <div className="animate-on-scroll delay-500 flex flex-col sm:flex-row gap-4">
          <a 
            href="#projects" 
            className="bg-highlight-blue hover:bg-highlight-blue/80 text-white px-8 py-4 rounded-full transition-all duration-300 font-medium magnetic-effect"
            aria-label="Ver projetos desenvolvidos por Felippe Kauê"
          >
            🚀 Ver Meus Projetos
          </a>
          
          <a 
            href="#contact" 
            className="bg-transparent border border-white/20 hover:border-highlight-green text-white px-8 py-4 rounded-full transition-all duration-300 font-medium magnetic-effect"
            aria-label="Solicitar orçamento gratuito para desenvolvimento web"
          >
            💬 Solicitar Orçamento Gratuito
          </a>
        </div>
        
        {/* Stats - Simple */}
        <div className="animate-on-scroll delay-700 mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">✅ Mais de 15 projetos concluídos com sucesso</p>
          <p className="text-sm text-gray-500">🌐 Atendimento 100% remoto em todo o Brasil</p>
        </div>
      </div>
      
      {/* Scroll Indicator - Simple */}
      <a
        href="#about"
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          "flex items-center justify-center w-12 h-12",
          "rounded-full border border-white/20 bg-background/50",
          "animate-bounce cursor-pointer transition-all duration-300",
          "hover:border-highlight-blue hover:bg-background/80"
        )}
      >
        <ArrowDown className="w-5 h-5 text-gray-300" />
      </a>
    </section>
  );
};

export default Hero;
