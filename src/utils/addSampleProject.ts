
import { supabase } from '@/integrations/supabase/client';

export const addWorkflowAppProject = async () => {
  try {
    // Primeiro verificar se já existe
    const { data: existing, error: checkError } = await supabase
      .from('projects')
      .select('*')
      .eq('title', 'WorkflowApp')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar projetos existentes:', checkError);
      return { success: false, error: checkError };
    }

    if (existing && existing.length > 0) {
      console.log('✅ WorkflowApp já existe no banco');
      return { success: true, data: existing[0] };
    }

    const projectData = {
      title: 'WorkflowApp',
      description: 'O WorkflowApp é uma aplicação desenvolvida para facilitar e automatizar o fluxo de trabalho dentro de equipes ou empresas. O sistema permite o cadastro de tarefas, distribuição entre colaboradores, acompanhamento do progresso, notificações de prazos e gestão visual de processos. Ideal para pequenos negócios, times de tecnologia, ou setores operacionais que precisam de organização e agilidade.\n\nO app foi desenvolvido com foco em usabilidade, responsividade e automação de processos, permitindo inclusive a integração com APIs externas no futuro.\n\nFuncionalidades principais:\n• Cadastro e gerenciamento de tarefas\n• Design responsivo para mobile e desktop\n• Registro de atividades por usuário\n• Notificações de status e prazos\n• Interface limpa e intuitiva',
      technologies: ['React', 'Node.js', 'Firebase', 'Git', 'GitHub'],
      images: ['/lovable-uploads/d1ed4d81-7793-4a84-8227-549e965f1701.png'],
      demo_link: '',
      github_link: '',
      youtube_link: 'https://www.youtube.com/watch?v=BAzg5HDfJTo',
      featured: true
    };

    console.log('🚀 Inserindo projeto WorkflowApp...');
    console.log('📋 Dados do projeto:', projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    if (error) {
      console.error('❌ Erro ao inserir projeto:', error);
      return { success: false, error };
    }

    console.log('✅ Projeto inserido com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return { success: false, error };
  }
};
