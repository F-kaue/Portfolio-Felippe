
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Code, Package, Presentation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  links: {
    demo?: string;
    github?: string;
  };
  featured: boolean;
}

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const projects: Project[] = [
    {
      id: 1,
      title: 'Sistema de Controle de Estoque',
      description: 'Aplicação web para gerenciamento completo de estoque, com controle de produtos, entradas, saídas, relatórios e dashboard analítico. Implementado com Java Spring Boot e React.',
      image: 'https://placehold.co/600x400/1a1a1a/cccccc?text=Sistema+de+Estoque',
      technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'Docker', 'JWT'],
      links: {
        demo: '#',
        github: '#',
      },
      featured: true,
    },
    {
      id: 2,
      title: 'Sistema de Barbearia',
      description: 'Plataforma completa para gerenciamento de barbearias, incluindo agendamento online, gestão de clientes, controle financeiro e cadastro de serviços. Desenvolvido com Python Django e Vue.js.',
      image: 'https://placehold.co/600x400/1a1a1a/cccccc?text=Sistema+de+Barbearia',
      technologies: ['Python', 'Django', 'Vue.js', 'PostgreSQL', 'RESTful API'],
      links: {
        demo: '#',
        github: '#',
      },
      featured: true,
    },
    {
      id: 3,
      title: 'Dashboard Analítico',
      description: 'Dashboard interativo para visualização de dados empresariais, com gráficos dinâmicos, relatórios personalizados e análises preditivas.',
      image: 'https://placehold.co/600x400/1a1a1a/cccccc?text=Dashboard+Analítico',
      technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
      links: {
        github: '#',
      },
      featured: false,
    },
    {
      id: 4,
      title: 'API de Gestão de Tarefas',
      description: 'API RESTful para gestão de tarefas e projetos, com autenticação JWT, permissões por níveis de usuário e documentação OpenAPI.',
      image: 'https://placehold.co/600x400/1a1a1a/cccccc?text=API+Tarefas',
      technologies: ['Java', 'Spring Boot', 'OAuth2', 'PostgreSQL', 'Swagger'],
      links: {
        github: '#',
      },
      featured: false,
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
    <section id="projects" className="relative py-20 bg-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Meus <span className="gradient-text">Projetos</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-blue mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className={cn(
                "animate-on-scroll relative group rounded-xl overflow-hidden card-hover",
                "border border-white/10 backdrop-blur-sm",
                project.featured ? "md:col-span-1" : ""
              )}
              style={{ animationDelay: `${200 * index}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Card content with hover overlay */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.image} 
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
                  {project.links.github && (
                    <a 
                      href={project.links.github}
                      className="flex items-center gap-1 text-sm text-gray-300 hover:text-highlight-blue transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      <span>Código</span>
                    </a>
                  )}
                  {project.links.demo && (
                    <a 
                      href={project.links.demo}
                      className="flex items-center gap-1 text-sm text-gray-300 hover:text-highlight-green transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Demo</span>
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
      
      {/* Project details modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-[#0c0c0c] border border-white/10 rounded-xl max-w-4xl w-full max-h-90vh overflow-auto animate-fade-in">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSelectedProject(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="aspect-video overflow-hidden">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">{selectedProject.title}</h3>
              <p className="text-gray-300 mb-6">{selectedProject.description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-highlight-blue" />
                  <span>Tecnologias</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="bg-white/10 text-sm px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-highlight-green" />
                  <span>Principais Recursos</span>
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Interface de usuário intuitiva e responsiva</li>
                  <li>Autenticação segura e gerenciamento de permissões</li>
                  <li>Dashboard analítico com métricas em tempo real</li>
                  <li>API RESTful bem documentada e extensível</li>
                  <li>Implantação containerizada com Docker</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-highlight-blue" />
                  <span>Links</span>
                </h4>
                <div className="flex gap-4">
                  {selectedProject.links.github && (
                    <a 
                      href={selectedProject.links.github}
                      className="flex items-center gap-2 text-gray-300 hover:text-highlight-blue transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Repositório</span>
                    </a>
                  )}
                  {selectedProject.links.demo && (
                    <a 
                      href={selectedProject.links.demo}
                      className="flex items-center gap-2 text-gray-300 hover:text-highlight-green transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Demo ao Vivo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
