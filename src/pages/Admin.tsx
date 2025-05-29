import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LogOut, 
  UserIcon, 
  BookOpen, 
  Briefcase, 
  Phone, 
  Plus, 
  Trash2, 
  Edit,
  Image,
  Link,
  Save,
  X,
  Youtube
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Interfaces
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

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

interface AboutInfo {
  summary: string;
  education: string[];
  interests: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Project State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  // New project form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTechnologies, setProjectTechnologies] = useState('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectDemoLink, setProjectDemoLink] = useState('');
  const [projectGithubLink, setProjectGithubLink] = useState('');
  const [projectYoutubeLink, setProjectYoutubeLink] = useState('');
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  
  // Experience State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  
  // Contact Info State
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'f_kaue@hotmail.com',
    phone: '+55 (85) 99288-4178',
    linkedin: 'https://linkedin.com/in/felippegomes',
    github: 'https://github.com/felippegomes'
  });
  
  // About Info State
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    summary: 'Desenvolvedor de Software com experiência em Python, Java e desenvolvimento web.',
    education: ['Análise e Desenvolvimento de Sistemas (UNIFAMETRO)', 'Técnico em Informática (CEPEP)'],
    interests: ['Desenvolvimento Web', 'Inteligência Artificial', 'Desenvolvimento Mobile']
  });

  useEffect(() => {
    // Verificar autenticação
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar autenticado para acessar esta página.",
        variant: "destructive",
      });
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      
      // Carregar dados do localStorage ou usar dados de exemplo
      loadData();
    }
  }, [navigate, toast]);

  // Função para carregar dados do localStorage ou usar dados de exemplo
  const loadData = () => {
    // Carregar projetos
    const savedProjects = localStorage.getItem('portfolio-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Dados iniciais de exemplo para projetos
      setProjects([
        {
          id: 1,
          title: 'Sistema de Controle de Estoque',
          description: 'Aplicação web para gerenciamento completo de estoque, com controle de produtos, entradas, saídas, relatórios e dashboard analítico.',
          technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'Docker', 'JWT'],
          images: ['https://placehold.co/600x400/1a1a1a/cccccc?text=Sistema+de+Estoque'],
          links: {
            demo: 'https://example.com/demo',
            github: 'https://github.com/exemplo/estoque',
            youtube: ''
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
            youtube: ''
          },
          featured: true,
        },
      ]);
      
      localStorage.setItem('portfolio-projects', JSON.stringify([
        {
          id: 1,
          title: 'Sistema de Controle de Estoque',
          description: 'Aplicação web para gerenciamento completo de estoque, com controle de produtos, entradas, saídas, relatórios e dashboard analítico.',
          technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'Docker', 'JWT'],
          images: ['https://placehold.co/600x400/1a1a1a/cccccc?text=Sistema+de+Estoque'],
          links: {
            demo: 'https://example.com/demo',
            github: 'https://github.com/exemplo/estoque',
            youtube: ''
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
            youtube: ''
          },
          featured: true,
        },
      ]));
    }

    // Carregar experiências
    const savedExperiences = localStorage.getItem('portfolio-experiences');
    if (savedExperiences) {
      setExperiences(JSON.parse(savedExperiences));
    } else {
      // Dados iniciais de exemplo para experiências
      const defaultExperiences = [
        {
          id: 1,
          title: "Analista de Suporte",
          company: "I & B TECNOLOGIA LTDA",
          period: "Atual",
          description: "Suporte em sistema sindical\nAuxílio em demandas de desenvolvimento\nResolução de problemas técnicos relacionados ao sistema\nColaboração com a equipe de desenvolvimento para melhorar e atualizar funcionalidades"
        },
        {
          id: 2,
          title: "Técnico de Informática",
          company: "Quarta Etapa",
          period: "Anterior",
          description: "Atendimento de chamados e resolução de problemas à distância por meio de ferramentas de acesso remoto\nRegistro de procedimentos, resolução de problemas, atualizações e mudanças realizadas no ambiente de TI\nGerenciamento de chamados e atendimento conforme os níveis de SLA acordados\nGerenciamento de inventário de equipamentos e peças, incluindo organização, reposição e descarte de itens obsoletos"
        },
        {
          id: 3,
          title: "Aprendiz Faturista",
          company: "Rede Oto Kora Saúde",
          period: "Anterior",
          description: "Análise e conferência de contas médicas para faturamento\nAuditoria interna para correção de inconsistências\nManutenção de registros financeiros e relatórios"
        }
      ];
      
      setExperiences(defaultExperiences);
      localStorage.setItem('portfolio-experiences', JSON.stringify(defaultExperiences));
    }

    // Carregar informações de contato
    const savedContactInfo = localStorage.getItem('portfolio-contact');
    if (savedContactInfo) {
      setContactInfo(JSON.parse(savedContactInfo));
    } else {
      // Dados iniciais para contato
      const defaultContactInfo = {
        email: 'f_kaue@hotmail.com',
        phone: '+55 (85) 99288-4178',
        linkedin: 'https://linkedin.com/in/felippegomes',
        github: 'https://github.com/felippegomes'
      };
      
      setContactInfo(defaultContactInfo);
      localStorage.setItem('portfolio-contact', JSON.stringify(defaultContactInfo));
    }

    // Carregar informações sobre mim
    const savedAboutInfo = localStorage.getItem('portfolio-about');
    if (savedAboutInfo) {
      setAboutInfo(JSON.parse(savedAboutInfo));
    } else {
      // Dados iniciais de exemplo para informações sobre
      const defaultAboutInfo = {
        summary: 'Desenvolvedor de Software com experiência em Python, Java e desenvolvimento web.',
        education: ['Análise e Desenvolvimento de Sistemas (UNIFAMETRO)', 'Técnico em Informática (CEPEP)'],
        interests: ['Desenvolvimento Web', 'Inteligência Artificial', 'Desenvolvimento Mobile']
      };
      
      setAboutInfo(defaultAboutInfo);
      localStorage.setItem('portfolio-about', JSON.stringify(defaultAboutInfo));
    }
  };

  // Função para salvar dados no localStorage e disparar eventos de sincronização
  const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    
    // Disparar evento customizado para sincronização
    window.dispatchEvent(new CustomEvent('portfolioProjectsUpdated'));
    
    // Disparar evento customizado adicional
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: { key, value: JSON.stringify(data) }
    }));
    
    toast({
      title: "Dados salvos",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  // Funções para gerenciar projetos
  const handleAddProject = () => {
    // Validar campos obrigatórios
    if (!projectTitle || !projectDescription || !projectTechnologies) {
      toast({
        title: "Erro ao adicionar projeto",
        description: "Por favor, preencha pelo menos o título, descrição e tecnologias.",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      title: projectTitle,
      description: projectDescription,
      technologies: projectTechnologies.split(',').map(tech => tech.trim()),
      images: projectImages,
      links: {
        demo: projectDemoLink || undefined,
        github: projectGithubLink || undefined,
        youtube: projectYoutubeLink || undefined,
      },
      featured: projectFeatured
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveData('portfolio-projects', updatedProjects);

    // Limpar formulário
    resetProjectForm();
    setShowProjectForm(false);
  };

  const handleUpdateProject = () => {
    if (!currentProject) return;

    // Atualizar o projeto com os dados do formulário
    const updatedProject = {
      ...currentProject,
      title: projectTitle,
      description: projectDescription,
      technologies: projectTechnologies.split(',').map(tech => tech.trim()),
      images: projectImages,
      links: {
        demo: projectDemoLink || undefined,
        github: projectGithubLink || undefined,
        youtube: projectYoutubeLink || undefined,
      },
      featured: projectFeatured
    };

    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    
    setProjects(updatedProjects);
    saveData('portfolio-projects', updatedProjects);
    
    // Limpar formulário
    resetProjectForm();
    setIsEditing(false);
    setCurrentProject(null);
    setShowProjectForm(false);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectTechnologies(project.technologies.join(', '));
    setProjectImages(project.images || []);
    setProjectDemoLink(project.links.demo || '');
    setProjectGithubLink(project.links.github || '');
    setProjectYoutubeLink(project.links.youtube || '');
    setProjectFeatured(project.featured);
    setIsEditing(true);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (id: number) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    saveData('portfolio-projects', updatedProjects);
    
    toast({
      title: "Projeto excluído",
      description: "O projeto foi removido com sucesso.",
    });
  };

  const resetProjectForm = () => {
    setProjectTitle('');
    setProjectDescription('');
    setProjectTechnologies('');
    setProjectImages([]);
    setProjectDemoLink('');
    setProjectGithubLink('');
    setProjectYoutubeLink('');
    setProjectFeatured(false);
    setTempImageUrl('');
  };

  const handleAddImageUrl = () => {
    if (tempImageUrl && !projectImages.includes(tempImageUrl)) {
      const newImages = [...projectImages, tempImageUrl];
      setProjectImages(newImages);
      setTempImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...projectImages];
    newImages.splice(index, 1);
    setProjectImages(newImages);
  };

  // Funções para gerenciar experiências
  const handleSaveExperiences = () => {
    saveData('portfolio-experiences', experiences);
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: 'Novo Cargo',
      company: 'Nova Empresa',
      period: 'Período',
      description: 'Descrição da experiência'
    };

    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    saveData('portfolio-experiences', updatedExperiences);
  };

  const handleUpdateExperience = (updatedExp: Experience) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === updatedExp.id ? updatedExp : exp
    );
    
    setExperiences(updatedExperiences);
    saveData('portfolio-experiences', updatedExperiences);
  };

  const handleDeleteExperience = (id: number) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    saveData('portfolio-experiences', updatedExperiences);
  };

  // Funções para gerenciar informações de contato
  const handleSaveContact = () => {
    saveData('portfolio-contact', contactInfo);
  };

  // Funções para gerenciar informações sobre mim
  const handleSaveAbout = () => {
    saveData('portfolio-about', aboutInfo);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 p-4 bg-white/5 rounded-lg backdrop-blur-md border border-white/10">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie o conteúdo do seu portfólio</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Sair
          </Button>
        </header>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span className="hidden sm:inline">Experiência</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <UserIcon size={16} />
              <span className="hidden sm:inline">Sobre Mim</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone size={16} />
              <span className="hidden sm:inline">Contato</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white/5 p-6 rounded-lg backdrop-blur-md border border-white/10">
            {/* Tab de Projetos */}
            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold mb-4">Gerenciar Projetos</h2>
                <Button 
                  onClick={() => {
                    resetProjectForm();
                    setIsEditing(false);
                    setShowProjectForm(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Novo Projeto
                </Button>
              </div>

              {/* Tabela de projetos */}
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tecnologias</TableHead>
                      <TableHead>Destaque</TableHead>
                      <TableHead>Imagens</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, i) => (
                              <span key={i} className="bg-white/10 text-xs px-2 py-1 rounded-full">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="bg-white/10 text-xs px-2 py-1 rounded-full">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.featured ? (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                              Sim
                            </span>
                          ) : (
                            <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full">
                              Não
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{project.images ? project.images.length : 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditProject(project)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit size={14} />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteProject(project.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 size={14} />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {projects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-400">
                          Nenhum projeto cadastrado. Adicione seu primeiro projeto!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Formulário de projeto (slide-over) */}
              {showProjectForm && (
                <Sheet open={showProjectForm} onOpenChange={setShowProjectForm}>
                  <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{isEditing ? 'Editar Projeto' : 'Adicionar Projeto'}</SheetTitle>
                      <SheetDescription>
                        {isEditing 
                          ? 'Edite as informações do projeto selecionado.' 
                          : 'Preencha os detalhes para adicionar um novo projeto.'}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                          Título *
                        </label>
                        <Input
                          id="title"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          placeholder="Nome do projeto"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                          Descrição *
                        </label>
                        <Textarea
                          id="description"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          placeholder="Descrição detalhada do projeto"
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="technologies" className="block text-sm font-medium mb-1">
                          Tecnologias * (separadas por vírgula)
                        </label>
                        <Input
                          id="technologies"
                          value={projectTechnologies}
                          onChange={(e) => setProjectTechnologies(e.target.value)}
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-3">Imagens</label>
                        
                        {/* Preview de imagens */}
                        {projectImages.length > 0 && (
                          <div className="mb-4">
                            <Carousel className="w-full">
                              <CarouselContent>
                                {projectImages.map((img, index) => (
                                  <CarouselItem key={index}>
                                    <div className="relative aspect-video">
                                      <img 
                                        src={img} 
                                        alt={`Preview ${index + 1}`} 
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 h-8 w-8 p-0"
                                        onClick={() => handleRemoveImage(index)}
                                      >
                                        <X size={14} />
                                      </Button>
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="-left-3" />
                              <CarouselNext className="-right-3" />
                            </Carousel>
                          </div>
                        )}
                        
                        {/* Adicionar nova imagem */}
                        <div className="flex gap-2">
                          <Input
                            value={tempImageUrl}
                            onChange={(e) => setTempImageUrl(e.target.value)}
                            placeholder="URL da imagem"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddImageUrl}
                          >
                            <Image size={16} className="mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="demoLink" className="block text-sm font-medium mb-1">
                          Link para Demo
                        </label>
                        <Input
                          id="demoLink"
                          value={projectDemoLink}
                          onChange={(e) => setProjectDemoLink(e.target.value)}
                          placeholder="https://exemplo.com/demo"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="githubLink" className="block text-sm font-medium mb-1">
                          Link para GitHub
                        </label>
                        <Input
                          id="githubLink"
                          value={projectGithubLink}
                          onChange={(e) => setProjectGithubLink(e.target.value)}
                          placeholder="https://github.com/usuario/projeto"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="youtubeLink" className="block text-sm font-medium mb-1">
                          Link para Vídeo do YouTube
                        </label>
                        <Input
                          id="youtubeLink"
                          value={projectYoutubeLink}
                          onChange={(e) => setProjectYoutubeLink(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Cole o link completo do YouTube (pode ser não listado)
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={projectFeatured}
                          onChange={(e) => setProjectFeatured(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="featured" className="text-sm font-medium">
                          Projeto em destaque
                        </label>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <SheetClose asChild>
                          <Button variant="outline" onClick={() => {
                            resetProjectForm();
                            setIsEditing(false);
                            setCurrentProject(null);
                          }}>
                            Cancelar
                          </Button>
                        </SheetClose>
                        <Button
                          onClick={isEditing ? handleUpdateProject : handleAddProject}
                        >
                          {isEditing ? 'Atualizar' : 'Adicionar'} Projeto
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </TabsContent>
            
            {/* Tab de Experiência */}
            <TabsContent value="experience" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold mb-4">Experiência Profissional</h2>
                <Button 
                  onClick={handleAddExperience}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Nova Experiência
                </Button>
              </div>
              
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-medium">{exp.title} @ {exp.company}</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`title-${exp.id}`} className="block text-sm font-medium mb-1">
                          Cargo
                        </label>
                        <Input
                          id={`title-${exp.id}`}
                          value={exp.title}
                          onChange={(e) => {
                            const updatedExp = { ...exp, title: e.target.value };
                            handleUpdateExperience(updatedExp);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`company-${exp.id}`} className="block text-sm font-medium mb-1">
                          Empresa
                        </label>
                        <Input
                          id={`company-${exp.id}`}
                          value={exp.company}
                          onChange={(e) => {
                            const updatedExp = { ...exp, company: e.target.value };
                            handleUpdateExperience(updatedExp);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`period-${exp.id}`} className="block text-sm font-medium mb-1">
                          Período
                        </label>
                        <Input
                          id={`period-${exp.id}`}
                          value={exp.period}
                          onChange={(e) => {
                            const updatedExp = { ...exp, period: e.target.value };
                            handleUpdateExperience(updatedExp);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`description-${exp.id}`} className="block text-sm font-medium mb-1">
                          Descrição (uma responsabilidade por linha)
                        </label>
                        <Textarea
                          id={`description-${exp.id}`}
                          value={exp.description}
                          onChange={(e) => {
                            const updatedExp = { ...exp, description: e.target.value };
                            handleUpdateExperience(updatedExp);
                          }}
                          className="min-h-[120px]"
                          placeholder="Responsabilidade 1&#10;Responsabilidade 2&#10;Responsabilidade 3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {experiences.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    Nenhuma experiência cadastrada. Adicione sua primeira experiência!
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveExperiences}
                    className="flex items-center gap-2"
                  >
                    <Save size={16} />
                    Salvar Todas Alterações
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Tab de Sobre Mim */}
            <TabsContent value="about" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
              
              <div>
                <label htmlFor="summary" className="block text-sm font-medium mb-1">
                  Resumo Profissional
                </label>
                <Textarea
                  id="summary"
                  value={aboutInfo.summary}
                  onChange={(e) => setAboutInfo({...aboutInfo, summary: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Formação (uma por linha)
                </label>
                <Textarea
                  value={aboutInfo.education.join('\n')}
                  onChange={(e) => setAboutInfo({
                    ...aboutInfo, 
                    education: e.target.value.split('\n').filter(item => item.trim() !== '')
                  })}
                  className="min-h-[100px]"
                  placeholder="Análise e Desenvolvimento de Sistemas (UNIFAMETRO)
Técnico em Informática (CEPEP)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interesses (um por linha)
                </label>
                <Textarea
                  value={aboutInfo.interests.join('\n')}
                  onChange={(e) => setAboutInfo({
                    ...aboutInfo, 
                    interests: e.target.value.split('\n').filter(item => item.trim() !== '')
                  })}
                  className="min-h-[100px]"
                  placeholder="Desenvolvimento Web
Inteligência Artificial"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveAbout}
                  className="flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar Alterações
                </Button>
              </div>
            </TabsContent>
            
            {/* Tab de Contato */}
            <TabsContent value="contact" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Telefone (com código do país e DDD)
                </label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  placeholder="+55 (85) 99288-4178"
                />
              </div>
              
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                  URL do LinkedIn
                </label>
                <Input
                  id="linkedin"
                  value={contactInfo.linkedin}
                  onChange={(e) => setContactInfo({...contactInfo, linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/felippegomes"
                />
              </div>
              
              <div>
                <label htmlFor="github" className="block text-sm font-medium mb-1">
                  URL do GitHub
                </label>
                <Input
                  id="github"
                  value={contactInfo.github}
                  onChange={(e) => setContactInfo({...contactInfo, github: e.target.value})}
                  placeholder="https://github.com/felippegomes"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveContact}
                  className="flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar Alterações
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
