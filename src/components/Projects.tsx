
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Função melhorada para carregar projetos
  const loadProjects = () => {
    console.log('🔄 Iniciando carregamento de projetos...');
    setIsLoading(true);
    
    try {
      const savedProjects = localStorage.getItem('portfolio-projects');
      console.log('📦 Raw localStorage data:', savedProjects);
      
      if (!savedProjects || savedProjects === 'null' || savedProjects === 'undefined') {
        console.log('❌ localStorage está vazio ou inválido');
        setProjects([]);
        setIsLoading(false);
        return;
      }

      const parsedProjects = JSON.parse(savedProjects);
      console.log('📋 Projetos parseados:', parsedProjects);
      
      if (!Array.isArray(parsedProjects)) {
        console.log('❌ Dados não são um array válido');
        setProjects([]);
        setIsLoading(false);
        return;
      }

      // Validação e normalização melhorada
      const validProjects = parsedProjects
        .filter(proj => proj && typeof proj === 'object' && proj.title)
        .map((proj: any) => ({
          id: proj.id || Date.now() + Math.random(),
          title: proj.title || "Projeto sem título",
          description: proj.description || "Descrição não informada",
          technologies: Array.isArray(proj.technologies) ? proj.technologies : 
                       typeof proj.technologies === 'string' ? proj.technologies.split(',').map((t: string) => t.trim()) : [],
          images: Array.isArray(proj.images) ? proj.images.filter(img => img && img.trim()) : 
                 typeof proj.images === 'string' && proj.images.trim() ? [proj.images.trim()] : 
                 ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'],
          links: {
            demo: proj.links?.demo || proj.demo || '',
            github: proj.links?.github || proj.github || '',
            youtube: proj.links?.youtube || proj.youtube || ''
          },
          featured: proj.featured !== false
        }));
      
      console.log('✅ Projetos válidos processados:', validProjects.length, validProjects);
      setProjects(validProjects);
    } catch (error) {
      console.error('❌ Erro ao processar projetos:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregamento inicial imediato
    loadProjects();

    // Event listeners para sincronização
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio-projects') {
        console.log('🔄 Storage change event detectado');
        setTimeout(loadProjects, 100);
      }
    };

    const handleCustomUpdate = () => {
      console.log('🔄 Custom update event detectado');
      setTimeout(loadProjects, 100);
    };

    const handleFocus = () => {
      console.log('🔄 Foco na janela - recarregando');
      setTimeout(loadProjects, 200);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Página visível - recarregando');
        setTimeout(loadProjects, 200);
      }
    };

    // Polling para garantir sincronização
    const pollInterval = setInterval(() => {
      const currentData = localStorage.getItem('portfolio-projects');
      if (currentData && currentData !== 'null') {
        try {
          const currentProjects = JSON.parse(currentData);
          if (Array.isArray(currentProjects) && currentProjects.length !== projects.length) {
            console.log('🔄 Polling detectou mudança no número de projetos');
            loadProjects();
          }
        } catch (error) {
          console.error('❌ Erro no polling:', error);
        }
      }
    }, 1000);

    // Registrar todos os listeners
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
  }, [projects.length]);

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
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    return url.includes('embed') ? url : `https://www.youtube.com/embed/${url}`;
  };

  const forceReload = () => {
    console.log('🔄 Forçando recarregamento manual...');
    setIsLoading(true);
    setTimeout(() => {
      loadProjects();
      window.dispatchEvent(new Event('portfolioProjectsUpdated'));
    }, 500);
  };

  return (
    <section id="projects" className="relative py-20 bg-[#0a0a0a] min-h-screen" ref={sectionRef}>
      <div className="section-container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 text-white">
            Meus <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Projetos</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Explore meus trabalhos e projetos desenvolvidos com diferentes tecnologias
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center text-gray-400 py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Carregando projetos...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(project => project.featured).map((project, index) => (
              <div 
                key={project.id}
                className={cn(
                  "animate-on-scroll relative group rounded-xl overflow-hidden",
                  "bg-gray-900 border border-gray-800 hover:border-gray-600",
                  "transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl",
                  "cursor-pointer"
                )}
                style={{ animationDelay: `${200 * index}ms` }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {project.links?.youtube && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setShowYouTubeModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                        title="Assistir vídeo do projeto"
                      >
                        <Youtube className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span 
                        key={i} 
                        className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 text-sm">
                    {project.links?.demo && (
                      <a 
                        href={project.links.demo}
                        className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Demo</span>
                      </a>
                    )}
                    {project.links?.github && (
                      <a 
                        href={project.links.github}
                        className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Código</span>
                      </a>
                    )}
                    {project.links?.youtube && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setShowYouTubeModal(true);
                        }}
                        className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        <span>Vídeo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 space-y-6 py-20">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white">Nenhum projeto encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Parece que não há projetos cadastrados ainda. Adicione alguns projetos através do painel administrativo.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={forceReload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
              >
                🔄 Recarregar Projetos
              </button>
              
              <div className="text-xs text-gray-600 bg-gray-900 rounded-lg p-4 max-w-md mx-auto">
                <p className="font-semibold mb-2">Debug Info:</p>
                <p>localStorage: {localStorage.getItem('portfolio-projects') ? 'Presente' : 'Vazio'}</p>
                <p>Projetos carregados: {projects.length}</p>
                <p>Última verificação: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de detalhes do projeto */}
      {selectedProject && !showYouTubeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative bg-gray-900 border border-gray-700 rounded-xl w-full max-h-[90vh] overflow-auto animate-fade-in"
            style={{ maxWidth: isMobile ? '100%' : '900px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
              <button 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Voltar</span>
              </button>
              
              <button 
                className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="aspect-video w-full max-h-[400px] overflow-hidden">
                <img 
                  src={selectedProject.images[0]} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedProject.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedProject.description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Tecnologias Utilizadas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="bg-gray-800 border border-gray-600 text-gray-300 text-sm px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {selectedProject.links?.demo && (
                  <a 
                    href={selectedProject.links.demo}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
                    className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Assistir Vídeo</span>
                  </button>
                )}
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
            className="relative bg-black rounded-xl w-full max-h-[90vh] overflow-hidden animate-fade-in shadow-2xl"
            style={{ maxWidth: isMobile ? '100%' : '1000px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
              <h3 className="text-white font-semibold text-lg">{selectedProject.title} - Demonstração</h3>
              <button 
                className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                onClick={() => setShowYouTubeModal(false)}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(selectedProject.links.youtube)}
                title={`Vídeo demonstrativo do projeto ${selectedProject.title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
            
            <div className="p-4 bg-gray-900">
              <p className="text-gray-300 text-sm text-center">
                Pressione ESC para fechar ou clique fora do vídeo
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
