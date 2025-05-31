import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, ArrowLeft, Play, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { addWorkflowAppProject } from '@/utils/addSampleProject';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  demo_link?: string;
  github_link?: string;
  youtube_link?: string;
  featured: boolean;
}

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Função para adicionar projeto de exemplo se não houver projetos
  const checkAndAddSampleProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (!error && (!data || data.length === 0)) {
      console.log('📝 Nenhum projeto encontrado, adicionando WorkflowApp...');
      await addWorkflowAppProject();
      await loadProjects();
    }
  };

  // Função para carregar projetos do Supabase
  const loadProjects = async () => {
    console.log('🔄 Iniciando carregamento de projetos do Supabase...');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        setProjects([]);
        setIsLoading(false);
        return;
      }

      console.log('📦 Raw Supabase data:', data);
      
      if (!data || !Array.isArray(data)) {
        console.log('❌ Dados não são um array válido');
        setProjects([]);
        setIsLoading(false);
        return;
      }

      // Formatação dos projetos
      const formattedProjects = data.map((proj: any) => ({
        id: proj.id,
        title: proj.title || "Projeto sem título",
        description: proj.description || "Descrição não informada",
        technologies: proj.technologies || [],
        images: proj.images && proj.images.length > 0 ? proj.images : 
               ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'],
        demo_link: proj.demo_link,
        github_link: proj.github_link,
        youtube_link: proj.youtube_link,
        featured: proj.featured
      }));
      
      console.log('✅ Projetos formatados:', formattedProjects.length, formattedProjects);
      setProjects(formattedProjects);
    } catch (error) {
      console.error('❌ Erro ao processar projetos:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregamento inicial
    const initializeProjects = async () => {
      await checkAndAddSampleProject();
      await loadProjects();
    };
    
    initializeProjects();

    // Setup realtime subscription
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('🔄 Mudança detectada na tabela projects:', payload);
          loadProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    return url.includes('embed') ? url : `https://www.youtube.com/embed/${url}`;
  };

  const forceReload = () => {
    console.log('🔄 Forçando recarregamento manual...');
    loadProjects();
  };

  const addSampleProjectManually = async () => {
    console.log('➕ Adicionando projeto WorkflowApp manualmente...');
    const result = await addWorkflowAppProject();
    if (result.success) {
      await loadProjects();
    }
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
            {projects.map((project, index) => (
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
                  
                  {project.youtube_link && (
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
                    {project.demo_link && (
                      <a 
                        href={project.demo_link}
                        className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Demo</span>
                      </a>
                    )}
                    {project.github_link && (
                      <a 
                        href={project.github_link}
                        className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Código</span>
                      </a>
                    )}
                    {project.youtube_link && (
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
                onClick={addSampleProjectManually}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2 mr-4"
              >
                ➕ Adicionar WorkflowApp
              </button>
              
              <button 
                onClick={forceReload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
              >
                🔄 Recarregar Projetos
              </button>
              
              <div className="text-xs text-gray-600 bg-gray-900 rounded-lg p-4 max-w-md mx-auto">
                <p className="font-semibold mb-2">Debug Info:</p>
                <p>Fonte: Supabase Database</p>
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
                {selectedProject.demo_link && (
                  <a 
                    href={selectedProject.demo_link}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Demo</span>
                  </a>
                )}
                
                {selectedProject.github_link && (
                  <a 
                    href={selectedProject.github_link}
                    className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Código</span>
                  </a>
                )}
                
                {selectedProject.youtube_link && (
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
      {showYouTubeModal && selectedProject?.youtube_link && (
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
                src={getYouTubeEmbedUrl(selectedProject.youtube_link)}
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
