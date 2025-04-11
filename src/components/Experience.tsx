
import React, { useEffect, useRef } from 'react';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      title: "Desenvolvedor Fullstack",
      company: "Empresa XYZ",
      period: "2021 - Presente",
      description: "Desenvolvimento de sistemas web completos utilizando React, Node.js e PostgreSQL. Implementação de APIs RESTful e integração com serviços externos.",
      type: "work"
    },
    {
      id: 2,
      title: "Técnico em Desenvolvimento",
      company: "Empresa ABC",
      period: "2019 - 2021",
      description: "Manutenção e desenvolvimento de sistemas legados em Java. Migração gradual para arquitetura de microsserviços.",
      type: "work"
    },
    {
      id: 3,
      title: "Análise e Desenvolvimento de Sistemas",
      company: "UNIFAMETRO",
      period: "2018 - 2022",
      description: "Graduação com foco em desenvolvimento de software, programação orientada a objetos e engenharia de software.",
      type: "education"
    },
    {
      id: 4,
      title: "Técnico em Informática",
      company: "CEPEP",
      period: "2016 - 2018",
      description: "Formação técnica com ênfase em programação, redes e banco de dados.",
      type: "education"
    },
    {
      id: 5,
      title: "Estágio em Desenvolvimento",
      company: "Startup DEF",
      period: "2018 - 2019",
      description: "Desenvolvimento de aplicações web com Python Django e frontend em jQuery.",
      type: "work"
    },
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
    <section id="experience" className="relative py-20 bg-background" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Minha <span className="gradient-text">Trajetória</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-green mx-auto rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline center line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -ml-0.5"></div>
          
          {timelineItems.map((item, index) => (
            <div 
              key={item.id} 
              className={cn(
                "relative animate-on-scroll mb-12 last:mb-0",
                "flex flex-col lg:flex-row",
                index % 2 === 0 ? "lg:text-right lg:flex-row-reverse" : ""
              )}
              style={{ animationDelay: `${200 * index}ms` }}
            >
              {/* Timeline dot */}
              <div 
                className={cn(
                  "absolute left-4 lg:left-1/2 -ml-3.5 mt-6",
                  "w-7 h-7 rounded-full flex items-center justify-center z-10",
                  "border-2 border-white/10",
                  item.type === "work" ? "bg-highlight-blue" : "bg-highlight-green"
                )}
              >
                {item.type === "work" ? (
                  <Briefcase className="w-3.5 h-3.5 text-white" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              
              {/* Timeline content */}
              <div className={cn(
                "ml-12 lg:ml-0 lg:w-1/2",
                index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"
              )}>
                <div className={cn(
                  "bg-white/5 rounded-lg p-6 card-hover",
                  "border border-white/10 backdrop-blur-sm",
                  "transition-all duration-300",
                  item.type === "work" ? "hover:border-highlight-blue/50" : "hover:border-highlight-green/50"
                )}>
                  <div className="flex flex-col-reverse lg:flex-col">
                    <div className="flex items-center mb-2">
                      <Calendar 
                        className={cn(
                          "w-4 h-4 mr-2",
                          item.type === "work" ? "text-highlight-blue" : "text-highlight-green"
                        )}
                      />
                      <span className="text-sm text-gray-400">{item.period}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  </div>
                  <p className="text-gray-300 font-medium mb-3">{item.company}</p>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
