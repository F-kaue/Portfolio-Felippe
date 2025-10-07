import React, { useEffect, useRef } from 'react';
import { Check, Clock, Gift, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Offers: React.FC = () => {
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

  return (
    <section id="offers" className="relative py-20 bg-gradient-to-b from-[#0c0c0c] to-[#0a0a0a]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">Ofertas Especiais</span> para Novos Clientes
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Aproveite estas ofertas exclusivas e comece seu projeto com condições especiais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Oferta 1: Consultoria Gratuita */}
          <div className="animate-on-scroll bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Consultoria Gratuita</h3>
                <p className="text-blue-400 font-medium">Valor: R$ 200</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              <strong className="text-white">30 minutos de consultoria gratuita</strong> para analisar suas necessidades e definir a melhor estratégia digital para seu negócio.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Análise completa do seu negócio
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Estratégia personalizada de desenvolvimento
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Orçamento detalhado sem compromisso
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Dicas de otimização para seu site atual
              </li>
            </ul>
            
            <a 
              href="https://wa.me/5585992884178?text=Olá! Gostaria de agendar a consultoria gratuita de 30 minutos."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
            >
              <Gift className="w-5 h-5" />
              <span>Agendar Consultoria Gratuita</span>
            </a>
          </div>

          {/* Oferta 2: Desconto Especial */}
          <div className="animate-on-scroll bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-8 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Desconto Especial</h3>
                <p className="text-green-400 font-medium">20% OFF no Primeiro Projeto</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              <strong className="text-white">20% de desconto</strong> no seu primeiro projeto comigo. Válido para novos clientes que fecharem até o final do mês.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Desconto aplicado em qualquer tipo de projeto
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Suporte completo incluso
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Garantia de 30 dias
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                Entrega no prazo ou dinheiro de volta
              </li>
            </ul>
            
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-yellow-300 font-medium">Oferta limitada até o final do mês!</span>
              </div>
            </div>
            
            <a 
              href="https://wa.me/5585992884178?text=Olá! Gostaria de aproveitar o desconto de 20% no primeiro projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
            >
              <Zap className="w-5 h-5" />
              <span>Aproveitar Desconto Agora</span>
            </a>
          </div>
        </div>

        {/* Garantia */}
        <div className="text-center mt-12 animate-on-scroll">
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">🛡️ Garantia Total de Satisfação</h3>
            <p className="text-gray-300 leading-relaxed">
              Se você não ficar 100% satisfeito com o resultado, devolvo seu dinheiro. 
              <strong className="text-white"> Sem perguntas, sem complicações.</strong> 
              Meu objetivo é seu sucesso, não apenas a entrega do projeto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
