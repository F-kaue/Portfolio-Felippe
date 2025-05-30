
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit, Save, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar projetos do Supabase
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos:', error);
        toast({
          title: "Erro!",
          description: "Erro ao carregar projetos do banco de dados.",
          variant: "destructive"
        });
        return;
      }

      const formattedProjects = data?.map(proj => ({
        id: proj.id,
        title: proj.title,
        description: proj.description || '',
        technologies: proj.technologies || [],
        images: proj.images || [],
        demo_link: proj.demo_link,
        github_link: proj.github_link,
        youtube_link: proj.youtube_link,
        featured: proj.featured
      })) || [];

      setProjects(formattedProjects);
      console.log('Projetos carregados:', formattedProjects);
    } catch (error) {
      console.error('Erro ao processar projetos:', error);
      toast({
        title: "Erro!",
        description: "Erro ao processar dados dos projetos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setEditingProject(prev => {
      if (!prev) return prev;

      if (name === 'technologies') {
        return { ...prev, technologies: value.split(',').map(t => t.trim()).filter(t => t) };
      }

      if (name === 'images') {
        return { ...prev, images: value.split(',').map(i => i.trim()).filter(i => i) };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSaveProject = async () => {
    if (!editingProject?.title.trim()) {
      toast({
        title: "Erro!",
        description: "O título do projeto é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    try {
      const projectData = {
        title: editingProject.title.trim(),
        description: editingProject.description?.trim() || '',
        technologies: editingProject.technologies || [],
        images: editingProject.images || [],
        demo_link: editingProject.demo_link?.trim() || null,
        github_link: editingProject.github_link?.trim() || null,
        youtube_link: editingProject.youtube_link?.trim() || null,
        featured: editingProject.featured
      };

      let result;
      if (isNewProject) {
        result = await supabase
          .from('projects')
          .insert([projectData])
          .select();
      } else {
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .select();
      }

      if (result.error) {
        console.error('Erro ao salvar projeto:', result.error);
        toast({
          title: "Erro!",
          description: "Erro ao salvar projeto no banco de dados.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: `Projeto ${isNewProject ? 'criado' : 'atualizado'} com sucesso!`,
      });

      setEditingProject(null);
      setIsNewProject(false);
      await loadProjects(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast({
        title: "Erro!",
        description: "Erro inesperado ao salvar projeto.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar projeto:', error);
        toast({
          title: "Erro!",
          description: "Erro ao deletar projeto.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Projeto deletado com sucesso!",
      });

      await loadProjects(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      toast({
        title: "Erro!",
        description: "Erro inesperado ao deletar projeto.",
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
              onClick={loadProjects}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={() => navigate('/')}>
              Voltar ao Portfólio
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">
              Projetos ({isLoading ? '...' : projects.length})
            </TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gerenciar Projetos</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    id: '',
                    title: '',
                    description: '',
                    technologies: [],
                    images: [],
                    demo_link: '',
                    github_link: '',
                    youtube_link: '',
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

            {isLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando projetos...</p>
                </CardContent>
              </Card>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nenhum projeto cadastrado ainda.</p>
                  <Button
                    onClick={() => {
                      setEditingProject({
                        id: '',
                        title: '',
                        description: '',
                        technologies: [],
                        images: [],
                        demo_link: '',
                        github_link: '',
                        youtube_link: '',
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
                            {project.demo_link && (
                              <div>Demo: {project.demo_link}</div>
                            )}
                            {project.github_link && (
                              <div>GitHub: {project.github_link}</div>
                            )}
                            {project.youtube_link && (
                              <div>YouTube: {project.youtube_link}</div>
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
                    <h4 className="font-medium mb-4">Informações do Sistema</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>Banco de Dados: ✅ Supabase Conectado</div>
                      <div>Projetos Carregados: {projects.length}</div>
                      <div>Última Atualização: {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{isNewProject ? 'Novo Projeto' : 'Editar Projeto'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditingProject(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">Título *</label>
                    <Input
                      type="text"
                      name="title"
                      value={editingProject.title}
                      onChange={handleChange}
                      placeholder="Nome do projeto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">Destaque</label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={editingProject.featured}
                        onCheckedChange={(checked) => {
                          setEditingProject(prev => {
                            if (!prev) return prev;
                            return { ...prev, featured: checked };
                          });
                        }}
                      />
                      <label htmlFor="featured" className="text-sm font-medium leading-none">
                        Mostrar na página principal
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
                    placeholder="Descreva seu projeto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-none mb-1">Tecnologias (separadas por vírgula)</label>
                  <Input
                    type="text"
                    name="technologies"
                    value={editingProject.technologies.join(', ')}
                    onChange={handleChange}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-none mb-1">Imagens (URLs separados por vírgula)</label>
                  <Input
                    type="text"
                    name="images"
                    value={editingProject.images.join(', ')}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">Demo Link</label>
                    <Input
                      type="text"
                      name="demo_link"
                      value={editingProject.demo_link || ''}
                      onChange={handleChange}
                      placeholder="https://projeto-demo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">GitHub Link</label>
                    <Input
                      type="text"
                      name="github_link"
                      value={editingProject.github_link || ''}
                      onChange={handleChange}
                      placeholder="https://github.com/usuario/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-none mb-1">YouTube Link</label>
                    <Input
                      type="text"
                      name="youtube_link"
                      value={editingProject.youtube_link || ''}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
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
