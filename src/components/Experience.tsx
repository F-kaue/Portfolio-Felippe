
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Briefcase, Headset, FileText, Computer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface TimelineItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string[];
  type: 'work';
  icon: React.ComponentType<any>;
}

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Erro ao carregar experiências:', error);
        throw error;
      }
      
      return data?.map((exp) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        type: 'work' as const,
        icon: getIconForTitle(exp.icon_type || exp.title)
      })) || [];
    }
  });
  
  const getIconForTitle = (iconType: string): React.ComponentType<any> => {
    const lowerIconType = iconType.toLowerCase();
    
    if (lowerIconType.includes('headset') || lowerIconType.includes('suporte') || lowerIconType.includes('atendimento')) {
      return Headset;
    } else if (lowerIconType.includes('computer') || lowerIconType.includes('técnico') || lowerIconType.includes('tecnico') || lowerIconType.includes('informática')) {
      return Computer;
    } else if (lowerIconType.includes('file-text') || lowerIconType.includes('faturista') || lowerIconType.includes('fiscal') || lowerIconType.includes('financeiro')) {
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

  console.log('Experiências carregadas do Supabase:', experiences);

  return (
    <section id="experience" className="relative py-20 bg-background" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Minha <span className="gradient-text">Trajetória</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-green mx-auto rounded-full"></div>
        </div>
        
        {isLoading ? (
          <div className="text-center text-gray-400">
            <p>Carregando experiências...</p>
          </div>
        ) : experiences.length > 0 ? (
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
            <p>Nenhuma experiência encontrada.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
