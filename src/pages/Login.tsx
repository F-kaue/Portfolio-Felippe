
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Verificando as credenciais específicas
    setTimeout(() => {
      // CPF: 07710027342, Senha: 0956kaue
      if (username === '07710027342' && password === '0956kaue') {
        toast({
          title: "Login bem-sucedido!",
          description: "Bem-vindo ao painel de administração.",
        });
        // Armazenar token de autenticação no localStorage
        localStorage.setItem('authToken', 'example-token-12345');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      } else {
        toast({
          title: "Falha no login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-400 mt-2">Entre com suas credenciais para gerenciar o conteúdo</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="pl-10 bg-white/5 border-white/10 focus:border-highlight-blue focus:ring focus:ring-highlight-blue/30"
                placeholder="CPF"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 bg-white/5 border-white/10 focus:border-highlight-blue focus:ring focus:ring-highlight-blue/30"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-highlight-blue to-highlight-green hover:from-highlight-blue/90 hover:to-highlight-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-blue"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm text-gray-400 mt-4">
          <p>Credenciais de acesso:</p>
          <p>CPF: 07710027342 / Senha: 0956kaue</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
