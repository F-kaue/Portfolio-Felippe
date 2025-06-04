
import { supabase } from '@/integrations/supabase/client';

export const addInsightFlowProject = async () => {
  console.log('➕ Adicionando projeto Insight Flow...');
  
  try {
    const projectData = {
      title: 'Insight Flow – Sistema de Gestão de Chamados',
      description: 'Sistema web full-stack para criação, rastreamento e gestão de chamados, visando otimizar fluxos de trabalho e fornecer dados para análise gerencial. Funcionalidades principais incluem cadastro, visualização, atualização de status e filtragem de chamados por diversos critérios. Arquitetura baseada em frontend React e backend API RESTful em Node.js com banco de dados MySQL em nuvem.',
      technologies: ['React', 'Node.js', 'Express', 'MySQL', 'Aiven', 'Git', 'GitHub', 'API RESTful', 'SSL'],
      images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop&crop=center'],
      demo_link: null,
      github_link: null,
      youtube_link: 'https://youtu.be/bGMFvGgN-k4',
      featured: true
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    if (error) {
      console.error('❌ Erro ao adicionar projeto Insight Flow:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Projeto Insight Flow adicionado com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro inesperado ao adicionar projeto:', error);
    return { success: false, error: 'Erro inesperado' };
  }
};
