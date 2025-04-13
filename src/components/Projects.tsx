
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  links: {
    demo?: string;
    github?: string;
  };
  featured: boolean;
}

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Carregar projetos do localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('portfolio-projects');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Projetos padrão caso não haja dados no localStorage
      const defaultProjects = [
        {
          id: 1,
          title: 'Sistema de Controle de Estoque',
          description: 'Aplicação web para gerenciamento completo de estoque, com controle de produtos, entradas, saídas, relatórios e dashboard analítico.',
          technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'Docker', 'JWT'],
          images: ['https://placehold.co/600x400/1a1a1a/cccccc?text=Sistema+de+Estoque'],
          links: {
            demo: 'https://example.com/demo',
            github: 'https://github.com/exemplo/estoque',
          },
          featured: true,
        },
        {
          id: 2,
          title: 'Sistema de Barbearia',
          description: 'Plataforma completa para gerenciamento de barbearias, incluindo agendamento online.',
          technologies: ['Python', 'Django', 'Vue.js', 'PostgreSQL', 'RESTful API'],
          images: ['https://placehold.co/600x400/1a1a1a/cccccc?text=Sistema+de+Barbearia'],
          links: {
            demo: 'https://example.com/demo2',
            github: 'https://github.com/exemplo/barbearia',
          },
          featured: true,
        },
      ];
      
      setProjects(defaultProjects);
      localStorage.setItem('portfolio-projects', JSON.stringify(defaultProjects));
    }
  }, []);
  
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

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="relative py-20 bg-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Meus <span className="gradient-text">Projetos</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-blue mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.filter(project => project.featured).map((project, index) => (
            <div 
              key={project.id}
              className={cn(
                "animate-on-scroll relative group rounded-xl overflow-hidden card-hover",
                "border border-white/10 backdrop-blur-sm"
              )}
              style={{ animationDelay: `${200 * index}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.images && project.images.length > 0 ? project.images[0] : 'https://placehold.co/600x400/1a1a1a/cccccc?text=Sem+Imagem'} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6 relative z-10">
                <h3 className="font-heading text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span 
                      key={i} 
                      className="bg-white/10 text-xs px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="bg-white/10 text-xs px-3 py-1 rounded-full">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-4">
                  {project.links && project.links.demo && (
                    <a 
                      href={project.links.demo}
                      className="flex items-center gap-1 text-sm text-gray-300 hover:text-highlight-green transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Demo</span>
                    </a>
                  )}
                  {project.links && project.links.github && (
                    <a 
                      href={project.links.github}
                      className="flex items-center gap-1 text-sm text-gray-300 hover:text-highlight-blue transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-highlight-blue hover:bg-highlight-blue/80 text-white px-6 py-3 rounded-full transition-all duration-300 font-medium">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative bg-[#0c0c0c] border border-white/10 rounded-xl w-full max-h-[90vh] overflow-auto animate-fade-in"
            style={{ maxWidth: isMobile ? '100%' : '800px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex justify-between items-center p-3 bg-[#0c0c0c]/90 backdrop-blur-sm border-b border-white/10">
              <button 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setSelectedProject(null)}
                aria-label="Voltar aos projetos"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Voltar</span>
              </button>
              
              <button 
                className="bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors"
                onClick={() => setSelectedProject(null)}
                aria-label="Fechar detalhes do projeto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="aspect-video w-full max-h-[300px] overflow-hidden">
                <img 
                  src={selectedProject.images[0]} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-5 pt-4">
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-3">{selectedProject.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{selectedProject.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span>Tecnologias</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="bg-white/10 text-xs px-2.5 py-0.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-5">
                {selectedProject.links && selectedProject.links.demo && (
                  <a 
                    href={selectedProject.links.demo}
                    className="inline-flex items-center gap-2 bg-highlight-blue hover:bg-highlight-blue/80 text-white px-4 py-2 text-sm rounded-full transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Demo</span>
                  </a>
                )}
                
                {selectedProject.links && selectedProject.links.github && (
                  <a 
                    href={selectedProject.links.github}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm rounded-full transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Código</span>
                  </a>
                )}
                
                <button
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors ml-auto"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
