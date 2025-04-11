
import React, { useEffect, useRef } from 'react';
import TypingAnimation from './TypingAnimation';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const codingTexts = [
    'def desenvolvedor_fullstack():',
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
    
    return () => {
      animateElements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden animated-bg" ref={sectionRef}>
      <div className="section-container flex flex-col items-center justify-center text-center z-10">
        <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          Olá, eu sou <span className="gradient-text">Felippe Kauê</span>
        </h1>
        
        <div className="animate-on-scroll delay-200 text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300">
          <span className="mr-2">{'<'}</span>
          <TypingAnimation texts={codingTexts} />
          <span className="ml-2">{'/>'}</span>
        </div>
        
        <p className="animate-on-scroll delay-300 text-lg md:text-xl max-w-2xl mb-10 text-gray-400">
          Desenvolvedor de Software apaixonado por criar soluções elegantes para problemas complexos.
          Especializado em Python, Java e desenvolvimento web.
        </p>
        
        <div className="animate-on-scroll delay-500 flex flex-col sm:flex-row gap-4">
          <a href="#projects" className="bg-highlight-blue hover:bg-highlight-blue/80 text-white px-6 py-3 rounded-full transition-all duration-300 font-medium">
            Ver Projetos
          </a>
          
          <a href="#contact" className="bg-transparent border border-white/20 hover:border-highlight-green text-white px-6 py-3 rounded-full transition-all duration-300 font-medium">
            Entre em Contato
          </a>
        </div>
      </div>
      
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
