
import React, { useEffect, useRef } from 'react';
import { Code, GraduationCap, Briefcase, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
  
  const cards = [
    {
      icon: <Code className="w-6 h-6 text-highlight-blue" />,
      title: 'Desenvolvimento',
      description: 'Especializado em desenvolvimento de software com foco em soluções web e aplicações empresariais, utilizando tecnologias modernas e melhores práticas.',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-highlight-green" />,
      title: 'Formação',
      description: 'Graduação em Análise e Desenvolvimento de Sistemas pela UNIFAMETRO e formação técnica em Informática pelo CEPEP.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-highlight-blue" />,
      title: 'Experiência',
      description: 'Experiência em desenvolvimento de sistemas de gestão, aplicações web e soluções de software para diversos setores empresariais.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-highlight-green" />,
      title: 'Tecnologias',
      description: 'Proficiente em Python, Java, JavaScript, HTML/CSS e frameworks modernos para desenvolvimento full-stack.',
    },
  ];
  
  return (
    <section id="about" className="relative py-20 bg-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Sobre</span> Mim
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-blue mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center animate-on-scroll mb-16">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Sou um desenvolvedor de software com paixão por criar experiências digitais elegantes e funcionais. 
            Meu objetivo é desenvolver aplicações que não apenas atendam às necessidades do cliente, 
            mas também proporcionem uma experiência excepcional ao usuário final.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Com formação em Análise e Desenvolvimento de Sistemas e experiência em diversas tecnologias, 
            estou sempre buscando aprimorar minhas habilidades e acompanhar as melhores práticas do mercado.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={cn(
                "animate-on-scroll bg-white/5 rounded-lg p-6 card-hover",
                "border border-white/10 backdrop-blur-sm"
              )}
              style={{ animationDelay: `${200 * index}ms` }}
            >
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-white/5 mr-4">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-400">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
