import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  project: string;
}

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      name: "Maria Silva",
      company: "TechStart Brasil",
      role: "CEO",
      content: "Felippe desenvolveu nosso sistema de gestão e superou todas as expectativas. O projeto foi entregue no prazo, com qualidade excepcional e suporte completo. Recomendo para qualquer empresa que busca excelência em desenvolvimento web.",
      rating: 5,
      project: "Sistema de Gestão Empresarial"
    },
    {
      name: "João Santos",
      company: "E-commerce Plus",
      role: "Diretor Comercial",
      content: "Nosso site e-commerce teve um aumento de 300% nas vendas após a otimização feita pelo Felippe. Ele entende perfeitamente as necessidades do negócio e entrega resultados reais. Profissional excepcional!",
      rating: 5,
      project: "E-commerce Otimizado"
    },
    {
      name: "Ana Costa",
      company: "Consultoria Digital",
      role: "Fundadora",
      content: "A automação desenvolvida pelo Felippe reduziu nosso tempo de trabalho em 70%. Sistema intuitivo, rápido e confiável. Atendimento personalizado e sempre disponível para suporte. Vale cada centavo investido!",
      rating: 5,
      project: "Sistema de Automação"
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
    <section id="testimonials" className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 text-white">
            O que meus <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">clientes dizem</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Resultados reais de clientes satisfeitos com projetos que geraram impacto no negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="animate-on-scroll bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105"
              style={{ animationDelay: `${200 * index}ms` }}
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-green-400 mr-3" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-green-400 text-sm font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                    Projeto: {testimonial.project}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Estatísticas de Sucesso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
                <div className="text-gray-300">Projetos Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-gray-300">Clientes Satisfeitos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">300%</div>
                <div className="text-gray-300">Aumento Médio em Vendas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
