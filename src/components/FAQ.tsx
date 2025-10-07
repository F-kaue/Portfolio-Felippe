import React, { useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      question: "Quanto custa criar um site profissional?",
      answer: "O investimento varia conforme a complexidade do projeto. Sites institucionais simples começam a partir de R$ 1.500, enquanto sistemas mais complexos podem custar entre R$ 3.000 a R$ 8.000. Ofereço orçamento gratuito e personalizado para cada cliente."
    },
    {
      question: "Em quanto tempo posso ter meu site pronto?",
      answer: "Sites institucionais simples ficam prontos em 2-3 semanas. Sistemas mais complexos podem levar de 4-8 semanas. O prazo depende da complexidade, quantidade de funcionalidades e feedback do cliente durante o desenvolvimento."
    },
    {
      question: "Você atende empresas de todo o Brasil?",
      answer: "Sim! Trabalho 100% remoto e atendo clientes de todo o Brasil. Utilizo ferramentas de comunicação eficientes para manter contato constante e garantir que o projeto atenda suas expectativas."
    },
    {
      question: "Meu site será otimizado para o Google?",
      answer: "Absolutamente! Todos os sites que desenvolvo são otimizados para SEO (Search Engine Optimization), incluindo estrutura semântica, meta tags, velocidade de carregamento e responsividade. Isso ajuda sua empresa a aparecer melhor nos resultados de busca."
    },
    {
      question: "Você oferece suporte após a entrega?",
      answer: "Sim! Ofereço 30 dias de suporte gratuito após a entrega do projeto para ajustes e correções. Após esse período, posso fornecer planos de manutenção mensal conforme sua necessidade."
    },
    {
      question: "Posso ver o progresso do meu projeto?",
      answer: "Claro! Mantenho comunicação constante durante todo o desenvolvimento, enviando atualizações regulares e permitindo que você acompanhe o progresso. Também posso disponibilizar um ambiente de teste para você visualizar o projeto antes da entrega final."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
    <section id="faq" className="relative py-20 bg-[#0a0a0a]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 text-white">
            Perguntas <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Frequentes</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Tire suas dúvidas sobre desenvolvimento web e meus serviços
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div 
                key={index}
                className="animate-on-scroll bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
                style={{ animationDelay: `${100 * index}ms` }}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
                  aria-expanded={openItems.includes(index)}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {item.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    openItems.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <p className="text-gray-400 mb-6">
            Ainda tem dúvidas? Entre em contato comigo!
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
          >
            Fale Comigo
          </a>
        </div>
      </div>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }}
      />
    </section>
  );
};

export default FAQ;
