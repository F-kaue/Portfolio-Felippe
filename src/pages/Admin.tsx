import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Save, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Função para carregar projetos do localStorage
  const loadProjects = () => {
    try {
      const savedProjects = localStorage.getItem('portfolio-projects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        if (Array.isArray(parsedProjects)) {
          setProjects(parsedProjects);
        } else {
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      setProjects([]);
    }
  };

  // Função melhorada para salvar no localStorage e forçar sincronização
  const saveProjectsToStorage = (projectsToSave: Project[]) => {
    try {
      const dataToSave = JSON.stringify(projectsToSave);
      localStorage.setItem('portfolio-projects', dataToSave);
      console.log('💾 Projetos salvos no localStorage:', dataToSave);
      
      // Disparar múltiplos eventos para garantir sincronização
      window.dispatchEvent(new Event('portfolioProjectsUpdated'));
      window.dispatchEvent(new Event('localStorageChange'));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'portfolio-projects',
        newValue: dataToSave,
        storageArea: localStorage
      }));
      
      console.log('📡 Eventos de sincronização disparados');
      
      // Forçar uma nova verificação após um delay
      setTimeout(() => {
        window.dispatchEvent(new Event('portfolioProjectsUpdated'));
      }, 100);
      
      toast({
        title: "Sucesso!",
        description: "Projetos salvos e sincronizados com sucesso.",
      });
    } catch (error) {
      console.error('❌ Erro ao salvar projetos:', error);
      toast({
        title: "Erro!",
        description: "Erro ao salvar projetos. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadProjects();

    const handleStorageChange = () => {
      loadProjects();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;

    setEditingProject(prev => {
      if (!prev) return prev;

      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      }

      if (name === 'technologies') {
        return { ...prev, technologies: value.split(',').map(t => t.trim()) };
      }

      if (name === 'images') {
        return { ...prev, images: value.split(',').map(i => i.trim()) };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        links: {
          ...prev.links,
          [name]: value
        }
      };
    });
  };

  const handleSaveProject = () => {
    if (!editingProject?.title.trim()) {
      toast({
        title: "Erro!",
        description: "O título do projeto é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    let updatedProjects;
    if (isNewProject) {
      const newProject = {
        ...editingProject,
        id: Date.now()
      };
      updatedProjects = [...projects, newProject];
    } else {
      updatedProjects = projects.map(p => 
        p.id === editingProject.id ? editingProject : p
      );
    }

    setProjects(updatedProjects);
    saveProjectsToStorage(updatedProjects);
    setEditingProject(null);
    setIsNewProject(false);
  };

  const handleDeleteProject = (id: number) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    saveProjectsToStorage(updatedProjects);
  };

  // Função para forçar sincronização manual
  const forceSyncProjects = () => {
    console.log('🔄 Forçando sincronização manual...');
    const currentData = localStorage.getItem('portfolio-projects');
    if (currentData) {
      window.dispatchEvent(new Event('portfolioProjectsUpdated'));
      window.dispatchEvent(new Event('localStorageChange'));
      toast({
        title: "Sincronização forçada!",
        description: "Os projetos devem aparecer na página principal agora.",
      });
    } else {
      toast({
        title: "Aviso!",
        description: "Nenhum projeto encontrado para sincronizar.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-gray-600 mt-2">Gerencie seu portfólio</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={forceSyncProjects}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </Button>
            <Button onClick={() => navigate('/')}>
              Voltar ao Portfólio
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projetos ({projects.length})</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gerenciar Projetos</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    id: 0,
                    title: '',
                    description: '',
                    technologies: [],
                    images: [],
                    links: { demo: '', github: '', youtube: '' },
                    featured: true
                  });
                  setIsNewProject(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Projeto
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nenhum projeto cadastrado ainda.</p>
                  <Button
                    onClick={() => {
                      setEditingProject({
                        id: 0,
                        title: '',
                        description: '',
                        technologies: [],
                        images: [],
                        links: { demo: '', github: '', youtube: '' },
                        featured: true
                      });
                      setIsNewProject(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Projeto
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {project.title}
                            {project.featured && (
                              <Badge variant="secondary">Destaque</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProject(project);
                              setIsNewProject(false);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Tecnologias:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Links:</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {project.links.demo && (
                              <div>Demo: {project.links.demo}</div>
                            )}
                            {project.links.github && (
                              <div>GitHub: {project.links.github}</div>
                            )}
                            {project.links.youtube && (
                              <div>YouTube: {project.links.youtube}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure as opções gerais do portfólio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Projetos Total:</label>
                      <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Projetos em Destaque:</label>
                      <p className="text-2xl font-bold text-green-600">
                        {projects.filter(p => p.featured).length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4">Debug Information</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>localStorage Status: {localStorage.getItem('portfolio-projects') ? '✅ Presente' : '❌ Vazio'}</div>
                      <div>Projetos Carregados: {projects.length}</div>
                      <div>Última Atualização: {new Date().toLocaleString()}</div>
                    </div>
                    
                    <Button
                      onClick={forceSyncProjects}
                      variant="outline"
                      className="mt-4 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Forçar Sincronização
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="max-w-2xl w-full">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{isNewProject ? 'Novo Projeto' : 'Editar Projeto'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditingProject(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">Título</label>
                    <Input
                      type="text"
                      name="title"
                      value={editingProject.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">Destaque</label>
                    <div className="space-y-2">
                      <label htmlFor="featured" className="inline-flex items-center space-x-2">
                        <Input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={editingProject.featured}
                          onChange={handleChange}
                        />
                        <span className="text-sm font-medium leading-none">
                          Mostrar na página principal
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-none mb-1">Descrição</label>
                  <Textarea
                    name="description"
                    value={editingProject.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-none mb-1">Tecnologias (separadas por vírgula)</label>
                  <Input
                    type="text"
                    name="technologies"
                    value={editingProject.technologies.join(', ')}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-none mb-1">Imagens (URLs separados por vírgula)</label>
                  <Input
                    type="text"
                    name="images"
                    value={editingProject.images.join(', ')}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">Demo Link</label>
                    <Input
                      type="text"
                      name="demo"
                      value={editingProject.links.demo || ''}
                      onChange={handleLinkChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">GitHub Link</label>
                    <Input
                      type="text"
                      name="github"
                      value={editingProject.links.github || ''}
                      onChange={handleLinkChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">YouTube Link</label>
                    <Input
                      type="text"
                      name="youtube"
                      value={editingProject.links.youtube || ''}
                      onChange={handleLinkChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setEditingProject(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProject}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
