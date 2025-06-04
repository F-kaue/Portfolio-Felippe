import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, ArrowLeft, Play, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { addWorkflowAppProject } from '@/utils/addSampleProject';
import { addInsightFlowProject } from '@/utils/addInsightFlowProject';

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

// Imagem padrão para projetos
const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center';

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Função para carregar projetos do Supabase
  const loadProjects = async () => {
    console.log('🔄 Carregando projetos...');
    setIsLoading(true);
    setHasError(false);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        setHasError(true);
        setProjects([]);
        return;
      }

      console.log('📦 Dados do Supabase:', data);
      
      let projectsData = data;
      
      if (!projectsData || projectsData.length === 0) {
        console.log('⚠️ Nenhum projeto encontrado, adicionando WorkflowApp...');
        await addWorkflowAppProject();
        // Tentar carregar novamente após adicionar o projeto
        const { data: newData, error: newError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (newError) {
          console.error('❌ Erro ao recarregar projetos:', newError);
          setHasError(true);
          setProjects([]);
          return;
        }
        
        projectsData = newData || [];
      }

      // Formatação dos projetos com imagem padrão
      const formattedProjects = projectsData.map((proj: any) => ({
        id: proj.id,
        title: proj.title || "Projeto sem título",
        description: proj.description || "Descrição não informada",
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        images: Array.isArray(proj.images) && proj.images.length > 0 ? proj.images : [DEFAULT_PROJECT_IMAGE],
        demo_link: proj.demo_link,
        github_link: proj.github_link,
        youtube_link: proj.youtube_link,
        featured: proj.featured || false
      }));
      
      console.log('✅ Projetos formatados:', formattedProjects);
      setProjects(formattedProjects);
    } catch (error) {
      console.error('❌ Erro ao processar projetos:', error);
      setHasError(true);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();

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
          console.log('🔄 Mudança detectada:', payload);
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

  const handleProjectClick = (project: Project) => {
    console.log('📱 Projeto clicado:', project);
    setSelectedProject(project);
    setShowYouTubeModal(false);
  };

  const handleYouTubeClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    console.log('🎥 YouTube clicado para:', project.title);
    setSelectedProject(project);
    setShowYouTubeModal(true);
  };

  const addWorkflowAppManually = async () => {
    console.log('➕ Adicionando WorkflowApp manualmente...');
    setIsLoading(true);
    const result = await addWorkflowAppProject();
    if (result.success) {
      console.log('✅ Projeto adicionado!');
      await loadProjects();
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const addInsightFlowManually = async () => {
    console.log('➕ Adicionando Insight Flow manualmente...');
    setIsLoading(true);
    const result = await addInsightFlowProject();
    if (result.success) {
      console.log('✅ Projeto Insight Flow adicionado!');
      await loadProjects();
    } else {
      setHasError(true);
      setIsLoading(false);
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
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-lg">Carregando projetos...</p>
          </div>
        ) : hasError ? (
          <div className="text-center text-gray-400 space-y-6 py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-white">Erro ao carregar projetos</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Houve um problema ao carregar os projetos. Tente novamente.
            </p>
            <button 
              onClick={loadProjects}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400 space-y-6 py-20">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white">Nenhum projeto encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Parece que não há projetos cadastrados ainda. Vamos adicionar alguns projetos de exemplo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={addWorkflowAppManually}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
              >
                ➕ Adicionar WorkflowApp
              </button>
              <button 
                onClick={addInsightFlowManually}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
              >
                ➕ Adicionar Insight Flow
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="group relative bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/25"
                style={{ animationDelay: `${200 * index}ms` }}
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative aspect-video overflow-hidden bg-gray-800">
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_PROJECT_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {project.youtube_link && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => handleYouTubeClick(e, project)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 shadow-lg"
                        title="Assistir vídeo do projeto"
                      >
                        <Youtube className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description.length > 120 ? `${project.description.substring(0, 120)}...` : project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span 
                        key={i} 
                        className="bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs px-3 py-1 rounded-full">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de detalhes do projeto */}
      {selectedProject && !showYouTubeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <button 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Voltar aos projetos</span>
              </button>
              
              <button 
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="aspect-video w-full max-h-[400px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={selectedProject.images[0]} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_PROJECT_IMAGE;
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{selectedProject.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
                {selectedProject.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Tecnologias Utilizadas</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-600 text-blue-800 dark:text-blue-300 text-sm px-4 py-2 rounded-full font-medium"
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
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Ver Demo</span>
                  </a>
                )}
                
                {selectedProject.github_link && (
                  <a 
                    href={selectedProject.github_link}
                    className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Ver Código</span>
                  </a>
                )}
                
                {selectedProject.youtube_link && (
                  <button
                    onClick={() => setShowYouTubeModal(true)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg"
                  >
                    <Youtube className="w-5 h-5" />
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
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
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
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
