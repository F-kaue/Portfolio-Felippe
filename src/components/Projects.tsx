import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, ArrowLeft, Play, Youtube } from 'lucide-react';
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
    youtube?: string;
  };
  featured: boolean;
}

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Função melhorada para carregar projetos do localStorage
  const loadProjects = () => {
    try {
      const savedProjects = localStorage.getItem('portfolio-projects');
      console.log('Raw localStorage data:', savedProjects);
      
      if (savedProjects && savedProjects !== 'undefined' && savedProjects !== 'null') {
        const parsedProjects = JSON.parse(savedProjects);
        console.log('Parsed projects:', parsedProjects);
        
        if (Array.isArray(parsedProjects)) {
          const validProjects = parsedProjects
            .filter(proj => proj && typeof proj === 'object')
            .map((proj: any) => ({
              id: proj.id || Date.now() + Math.random(),
              title: proj.title || "Projeto sem título",
              description: proj.description || "Descrição não informada",
              technologies: Array.isArray(proj.technologies) ? proj.technologies : 
                           typeof proj.technologies === 'string' ? proj.technologies.split(',').map((t: string) => t.trim()) : [],
              images: Array.isArray(proj.images) ? proj.images : 
                     typeof proj.images === 'string' ? [proj.images] : [],
              links: {
                demo: proj.links?.demo || proj.demo || '',
                github: proj.links?.github || proj.github || '',
                youtube: proj.links?.youtube || proj.youtube || ''
              },
              featured: proj.featured !== false
            }));
          
          console.log('Valid projects loaded:', validProjects);
          setProjects(validProjects);
          return;
        }
      }
      
      console.log('No valid projects found in localStorage');
      setProjects([]);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      setProjects([]);
    }
  };
  
  // Sistema de sincronização aprimorado
  useEffect(() => {
    // Carregamento inicial
    loadProjects();
    
    // Listener para mudanças no localStorage (outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio-projects') {
        console.log('Storage change detected:', e.newValue);
        loadProjects();
      }
    };
    
    // Listener para evento customizado (mesma aba)
    const handleCustomUpdate = () => {
      console.log('Custom update event detected');
      loadProjects();
    };
    
    // Polling para garantir sincronização
    const pollInterval = setInterval(() => {
      const currentData = localStorage.getItem('portfolio-projects');
      if (currentData) {
        try {
          const currentProjects = JSON.parse(currentData);
          if (JSON.stringify(currentProjects) !== JSON.stringify(projects)) {
            console.log('Polling detected change');
            loadProjects();
          }
        } catch (error) {
          console.error('Error parsing during polling:', error);
        }
      }
    }, 1000); // Verificar a cada segundo
    
    // Focus event para recarregar quando a aba ganha foco
    const handleFocus = () => {
      console.log('Tab focused, reloading projects');
      loadProjects();
    };
    
    // Visibility change para recarregar quando a página fica visível
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, reloading projects');
        loadProjects();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolioProjectsUpdated', handleCustomUpdate);
    window.addEventListener('localStorageChange', handleCustomUpdate);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolioProjectsUpdated', handleCustomUpdate);
      window.removeEventListener('localStorageChange', handleCustomUpdate);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(pollInterval);
    };
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
      if (e.key === 'Escape') {
        if (showYouTubeModal) {
          setShowYouTubeModal(false);
        } else if (selectedProject) {
          setSelectedProject(null);
        }
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedProject, showYouTubeModal]);

  useEffect(() => {
    if (selectedProject || showYouTubeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject, showYouTubeModal]);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Extrair ID do vídeo de diferentes formatos de URL do YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    return url;
  };

  console.log('Rendering Projects with', projects.length, 'projects:', projects);

  return (
    <section id="projects" className="relative py-20 bg-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Meus <span className="gradient-text">Projetos</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-blue mx-auto rounded-full"></div>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.filter(project => project.featured).map((project, index) => (
              <div 
                key={project.id}
                className={cn(
                  "animate-on-scroll relative group rounded-xl overflow-hidden card-hover",
                  "border border-white/10 backdrop-blur-sm cursor-pointer"
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
                  
                  {project.links?.youtube && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setShowYouTubeModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                        title="Ver vídeo"
                      >
                        <Youtube className="w-4 h-4" />
                      </button>
                    </div>
                  )}
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
        ) : (
          <div className="text-center text-gray-400">
            <p>Nenhum projeto encontrado. Adicione projetos através do painel administrativo.</p>
            <p className="text-sm mt-2">Debug: Verificando localStorage...</p>
            <button 
              onClick={loadProjects}
              className="mt-4 bg-highlight-blue hover:bg-highlight-blue/80 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Recarregar Projetos
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de detalhes do projeto */}
      {selectedProject && !showYouTubeModal && (
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
                {selectedProject.links?.demo && (
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
                
                {selectedProject.links?.github && (
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
                
                {selectedProject.links?.youtube && (
                  <button
                    onClick={() => setShowYouTubeModal(true)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-full transition-all duration-300"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Ver Vídeo</span>
                  </button>
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
      
      {/* Modal do YouTube */}
      {showYouTubeModal && selectedProject?.links?.youtube && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowYouTubeModal(false)}
        >
          <div 
            className="relative bg-black rounded-xl w-full max-h-[90vh] overflow-hidden animate-fade-in"
            style={{ maxWidth: isMobile ? '100%' : '900px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 bg-black/90 backdrop-blur-sm">
              <h3 className="text-white font-semibold">{selectedProject.title} - Vídeo</h3>
              <button 
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                onClick={() => setShowYouTubeModal(false)}
                aria-label="Fechar vídeo"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(selectedProject.links.youtube)}
                title={`Vídeo do projeto ${selectedProject.title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
