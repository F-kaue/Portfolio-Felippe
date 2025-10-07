
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
      title: 'Sites Profissionais',
      description: 'Criação de sites responsivos e otimizados para SEO que aumentam a visibilidade da sua empresa no Google. Desenvolvimento com foco em conversão e performance.',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-highlight-green" />,
      title: 'Sistemas Sob Medida',
      description: 'Desenvolvimento de sistemas web personalizados para automação de processos, gestão empresarial e integração de dados. Soluções escaláveis e eficientes.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-highlight-blue" />,
      title: 'Automação Inteligente',
      description: 'Automação de rotinas e processos empresariais com integração de APIs e sistemas. Reduza custos operacionais e aumente a produtividade da sua empresa.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-highlight-green" />,
      title: 'Tecnologias Modernas',
      description: 'React, TypeScript, Node.js, Python, Java, MySQL, Git. Sempre atualizado com as melhores práticas e tecnologias mais eficientes do mercado.',
    },
  ];
  
  return (
    <section id="about" className="relative py-20 bg-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Projetos que geram resultados reais</span> para empresas e profissionais
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-blue mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center animate-on-scroll mb-16">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            <strong className="text-white">Sites profissionais otimizados para o Google</strong> que aumentam sua visibilidade online. 
            Desenvolvo <strong className="text-highlight-blue">sistemas web personalizados</strong> com alta performance e 
            <strong className="text-highlight-green"> automação inteligente</strong> para empresas e profissionais que buscam resultados reais.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Com formação em <strong className="text-white">Análise e Desenvolvimento de Sistemas</strong> e experiência prática desde 2023, 
            aplico as melhores tecnologias: <strong className="text-highlight-blue">React, TypeScript, Node.js, Python e Java</strong>. 
            Foco em soluções eficientes, escaláveis e com boas práticas de desenvolvimento.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            🎯 <strong className="text-white">Desenvolvo sistemas sob medida com foco em resultado</strong>. 
            Seja para automação de processos, criação de sites profissionais ou integração de sistemas, 
            cada projeto é pensado para gerar valor real para seu negócio.
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
