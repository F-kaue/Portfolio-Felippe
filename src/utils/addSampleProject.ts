
import { supabase } from '@/integrations/supabase/client';

export const addWorkflowAppProject = async () => {
  try {
    const projectData = {
      title: 'WorkflowApp',
      description: 'O WorkflowApp é uma aplicação desenvolvida para facilitar e automatizar o fluxo de trabalho dentro de equipes ou empresas. O sistema permite o cadastro de tarefas, distribuição entre colaboradores, acompanhamento do progresso, notificações de prazos e gestão visual de processos. Ideal para pequenos negócios, times de tecnologia, ou setores operacionais que precisam de organização e agilidade.',
      technologies: ['React', 'Node.js', 'Firebase', 'Git', 'GitHub'],
      images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop'],
      demo_link: '',
      github_link: '',
      youtube_link: 'https://www.youtube.com/watch?v=BAzg5HDfJTo',
      featured: true
    };

    console.log('🚀 Inserindo projeto WorkflowApp...');
    
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
