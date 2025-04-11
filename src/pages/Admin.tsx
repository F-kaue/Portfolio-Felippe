
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, UserIcon, BookOpen, Briefcase, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
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

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <UserIcon size={16} />
              <span className="hidden sm:inline">Sobre Mim</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span className="hidden sm:inline">Experiência</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone size={16} />
              <span className="hidden sm:inline">Contato</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white/5 p-6 rounded-lg backdrop-blur-md border border-white/10">
            <TabsContent value="about" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Editar Informações Pessoais</h2>
              <p className="text-gray-400 mb-6">
                Este formulário permite atualizar as informações exibidas na seção "Sobre Mim".
              </p>
              <div className="space-y-4">
                {/* Aqui entrariam formulários para editar informações pessoais */}
                <p className="text-yellow-400">
                  Funcionalidade em desenvolvimento. Em uma implementação real, este painel permitiria editar o conteúdo da seção "Sobre Mim".
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Projetos</h2>
              <p className="text-gray-400 mb-6">
                Adicione, edite ou remova projetos do seu portfólio.
              </p>
              <div className="space-y-4">
                {/* Aqui entrariam formulários para gerenciar projetos */}
                <p className="text-yellow-400">
                  Funcionalidade em desenvolvimento. Em uma implementação real, este painel permitiria adicionar, editar e remover projetos do portfólio.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Experiência Profissional</h2>
              <p className="text-gray-400 mb-6">
                Adicione, edite ou remova itens da sua experiência profissional e educação.
              </p>
              <div className="space-y-4">
                {/* Aqui entrariam formulários para gerenciar experiências */}
                <p className="text-yellow-400">
                  Funcionalidade em desenvolvimento. Em uma implementação real, este painel permitiria adicionar, editar e remover itens da seção "Experiência".
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
              <p className="text-gray-400 mb-6">
                Atualize suas informações de contato e links para redes sociais.
              </p>
              <div className="space-y-4">
                {/* Aqui entrariam formulários para editar informações de contato */}
                <p className="text-yellow-400">
                  Funcionalidade em desenvolvimento. Em uma implementação real, este painel permitiria atualizar informações de contato e links para redes sociais.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
