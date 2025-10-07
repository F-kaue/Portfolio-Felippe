import React, { useEffect, useRef } from 'react';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessCase {
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  duration: string;
  technologies: string[];
}

const SuccessCases: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const cases: SuccessCase[] = [
    {
      title: "Sistema de Gestão Empresarial",
      client: "TechStart Brasil",
      industry: "Tecnologia",
      challenge: "Processos manuais causavam perda de tempo e erros operacionais",
      solution: "Desenvolvimento de sistema web completo com automação de processos e relatórios em tempo real",
      results: [
        { metric: "Redução de Tempo", value: "70%", improvement: "Operações mais eficientes" },
        { metric: "Aumento de Produtividade", value: "150%", improvement: "Mais tempo para vendas" },
        { metric: "Redução de Erros", value: "95%", improvement: "Processos automatizados" }
      ],
      duration: "6 semanas",
      technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"]
    },
    {
      title: "E-commerce Otimizado",
      client: "E-commerce Plus",
      industry: "Varejo Online",
      challenge: "Site lento e baixa conversão de visitantes em clientes",
      solution: "Redesign completo com otimização de performance, UX/UI e integração de pagamentos",
      results: [
        { metric: "Aumento de Vendas", value: "300%", improvement: "Conversão otimizada" },
        { metric: "Velocidade do Site", value: "85%", improvement: "Carregamento mais rápido" },
        { metric: "Taxa de Conversão", value: "250%", improvement: "Mais vendas por visitante" }
      ],
      duration: "4 semanas",
      technologies: ["Next.js", "Stripe", "MongoDB", "Tailwind CSS"]
    },
    {
      title: "Sistema de Automação",
      client: "Consultoria Digital",
      industry: "Consultoria",
      challenge: "Processos repetitivos consumiam muito tempo da equipe",
      solution: "Automação inteligente de rotinas com integração de APIs e notificações automáticas",
      results: [
        { metric: "Tempo Economizado", value: "60h/mês", improvement: "Equipe mais produtiva" },
        { metric: "Redução de Custos", value: "40%", improvement: "Menos trabalho manual" },
        { metric: "Satisfação do Cliente", value: "100%", improvement: "Processos mais rápidos" }
      ],
      duration: "3 semanas",
      technologies: ["Python", "FastAPI", "PostgreSQL", "Docker"]
    }
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
    <section id="success-cases" className="relative py-20 bg-[#0a0a0a]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Casos de Sucesso</span> com Resultados Reais
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Veja como transformei desafios em oportunidades de crescimento para meus clientes
          </p>
        </div>

        <div className="space-y-12">
          {cases.map((caseItem, index) => (
            <div 
              key={index}
              className="animate-on-scroll bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/30 transition-all duration-300"
              style={{ animationDelay: `${200 * index}ms` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Informações do Projeto */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{caseItem.title}</h3>
                      <p className="text-gray-400">{caseItem.client} • {caseItem.industry}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">🎯 Desafio:</h4>
                      <p className="text-gray-300">{caseItem.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">💡 Solução:</h4>
                      <p className="text-gray-300">{caseItem.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">⏱️ Duração:</h4>
                      <p className="text-gray-300">{caseItem.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Resultados */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">📈 Resultados Alcançados:</h4>
                  <div className="space-y-4">
                    {caseItem.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300">{result.metric}</span>
                          <span className="text-2xl font-bold text-green-400">{result.value}</span>
                        </div>
                        <p className="text-sm text-gray-400">{result.improvement}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-gray-400 mb-2">Tecnologias Utilizadas:</h5>
                    <div className="flex flex-wrap gap-2">
                      {caseItem.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-on-scroll">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Quer resultados similares para seu negócio?</h3>
            <p className="text-gray-300 mb-6">
              Cada projeto é único, mas a metodologia comprovada garante resultados excepcionais. 
              Vamos conversar sobre como posso ajudar sua empresa a crescer.
            </p>
            <a 
              href="https://wa.me/5585992884178?text=Olá! Vi os casos de sucesso e gostaria de conversar sobre um projeto para minha empresa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Quero Resultados Similares</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessCases;
