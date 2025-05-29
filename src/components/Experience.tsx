import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Briefcase, Headset, FileText, Computer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
  type: 'work';
  icon: React.ComponentType<any>;
}

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<TimelineItem[]>([]);
  
  useEffect(() => {
    const loadExperiences = () => {
      const savedExperiences = localStorage.getItem('portfolio-experiences');
      
      if (savedExperiences) {
        try {
          const adminExperiences = JSON.parse(savedExperiences);
          
          if (Array.isArray(adminExperiences) && adminExperiences.length > 0) {
            const convertedExperiences = adminExperiences.map((exp: any) => {
              // Converter descrição de string para array se necessário
              let description = exp.description;
              if (typeof description === 'string') {
                description = description.split('\n').filter((item: string) => item.trim() !== '');
              }
              
              return {
                id: exp.id || Date.now() + Math.random(),
                title: exp.title || "Cargo não informado",
                company: exp.company || "Empresa não informada",
                period: exp.period || "Período não informado",
                description: Array.isArray(description) ? description : [description || "Descrição não informada"],
                type: 'work' as const,
                icon: getIconForTitle(exp.title || "")
              };
            });
            
            setExperiences(convertedExperiences);
          } else {
            setExperiences([]);
          }
        } catch (error) {
          console.error("Erro ao carregar experiências:", error);
          setExperiences([]);
        }
      } else {
        setExperiences([]);
      }
    };
    
    // Carregar experiências inicialmente
    loadExperiences();
    
    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio-experiences') {
        loadExperiences();
      }
    };
    
    // Escutar mudanças customizadas no localStorage
    const handleCustomStorageChange = () => {
      loadExperiences();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolioExperiencesUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolioExperiencesUpdated', handleCustomStorageChange);
    };
  }, []);
  
  const getIconForTitle = (title: string): React.ComponentType<any> => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('suporte') || lowerTitle.includes('atendimento')) {
      return Headset;
    } else if (lowerTitle.includes('técnico') || lowerTitle.includes('tecnico') || lowerTitle.includes('informática')) {
      return Computer;
    } else if (lowerTitle.includes('faturista') || lowerTitle.includes('fiscal') || lowerTitle.includes('financeiro')) {
      return FileText;
    } else {
      return Briefcase;
    }
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
  }, [experiences]);

  console.log('Experiências carregadas:', experiences);

  return (
    <section id="experience" className="relative py-20 bg-background" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Minha <span className="gradient-text">Trajetória</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-green mx-auto rounded-full"></div>
        </div>
        
        {experiences.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline center line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -ml-0.5"></div>
            
            {experiences.map((item, index) => (
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
                    "bg-highlight-blue"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5 text-white" />
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
                    "hover:border-highlight-blue/50"
                  )}>
                    <div className="flex flex-col-reverse lg:flex-col">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-highlight-blue" />
                        <span className="text-sm text-gray-400">{item.period}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    </div>
                    <p className="text-gray-300 font-medium mb-3">{item.company}</p>
                    <ul className="text-gray-400 text-sm list-disc pl-4 space-y-1">
                      {item.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>Nenhuma experiência encontrada. Adicione experiências através do painel administrativo.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
