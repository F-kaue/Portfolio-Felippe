import React, { useEffect, useRef, useState } from 'react';
import { Code, Users, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  icon: React.ReactNode;
  number: number;
  suffix: string;
  label: string;
  description: string;
}

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState<{[key: string]: number}>({});

  const stats: Stat[] = [
    {
      icon: <Code className="w-8 h-8 text-blue-400" />,
      number: 15,
      suffix: "+",
      label: "Projetos Concluídos",
      description: "Sites e sistemas desenvolvidos com sucesso"
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      number: 12,
      suffix: "+",
      label: "Clientes Satisfeitos",
      description: "Empresas que confiam no meu trabalho"
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      number: 100,
      suffix: "%",
      label: "Taxa de Satisfação",
      description: "Clientes que recomendam meus serviços"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-400" />,
      number: 2,
      suffix: " anos",
      label: "Experiência",
      description: "Desenvolvendo soluções web inovadoras"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Iniciar animação dos contadores
            stats.forEach((stat, index) => {
              const key = `stat-${index}`;
              animateCounter(key, stat.number, 2000);
            });
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

  const animateCounter = (key: string, target: number, duration: number) => {
    const startTime = Date.now();
    const startValue = 0;
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
      
      setCounters(prev => ({
        ...prev,
        [key]: currentValue
      }));
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  return (
    <section id="stats" className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Números que Comprovam</span> a Qualidade
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Resultados reais que demonstram o impacto dos meus projetos no crescimento dos negócios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="animate-on-scroll text-center group"
              style={{ animationDelay: `${200 * index}ms` }}
            >
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-800/50 rounded-full group-hover:bg-blue-600/20 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {counters[`stat-${index}`] || 0}
                    <span className="text-blue-400">{stat.suffix}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Métricas Adicionais */}
        <div className="mt-16 animate-on-scroll">
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              🎯 Impacto Médio dos Projetos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">300%</div>
                <div className="text-gray-300 font-medium">Aumento Médio em Vendas</div>
                <div className="text-sm text-gray-500 mt-1">Sites otimizados para conversão</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">70%</div>
                <div className="text-gray-300 font-medium">Redução de Tempo</div>
                <div className="text-sm text-gray-500 mt-1">Automação de processos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-gray-300 font-medium">Redução de Erros</div>
                <div className="text-sm text-gray-500 mt-1">Sistemas automatizados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-on-scroll">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Quer fazer parte dessas estatísticas de sucesso?
            </h3>
            <p className="text-gray-300 mb-6">
              Cada projeto é uma oportunidade de superar expectativas e gerar resultados excepcionais. 
              Vamos conversar sobre como posso ajudar seu negócio a crescer.
            </p>
            <a 
              href="https://wa.me/5585992884178?text=Olá! Vi suas estatísticas impressionantes e gostaria de conversar sobre um projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Award className="w-5 h-5" />
              <span>Quero Resultados Excepcionais</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
