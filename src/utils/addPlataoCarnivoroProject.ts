import { supabase } from '@/integrations/supabase/client';

export const addPlataoCarnivoroProject = async () => {
  try {
    // Verificar se já existe
    const { data: existing, error: checkError } = await supabase
      .from('projects')
      .select('*')
      .eq('title', 'Platão Carnívoro')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar projetos existentes:', checkError);
      return { success: false, error: checkError };
    }

    if (existing && existing.length > 0) {
      console.log('✅ Platão Carnívoro já existe no banco');
      return { success: true, data: existing[0] };
    }

    const projectData = {
      title: 'Platão Carnívoro',
      description: 'Site completo desenvolvido para a marca Platão Carnívoro, focado em transmitir a identidade forte e autêntica do cliente. O projeto oferece uma experiência visual moderna, responsiva e prática para os amantes de um bom churrasco.\n\nPrincipais características:\n• Design responsivo e atrativo\n• Performance otimizada\n• Interface simples, clara e envolvente\n• Experiência pensada para destacar os diferenciais da marca\n• Desenvolvimento completo do zero\n• Foco na identidade visual da marca\n\nEste projeto representa bem como trabalho lado a lado com o cliente para transformar ideias em realidade digital, criando uma presença online que reflete os valores e a qualidade do negócio.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Design Responsivo', 'UI/UX Design'],
      images: ['https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop&crop=center'],
      demo_link: null,
      github_link: 'https://github.com/F-kaue/Platao-carnivoro',
      youtube_link: 'https://youtu.be/Z0F4xOm1WnE',
      featured: true
    };

    console.log('🚀 Inserindo projeto Platão Carnívoro...');
    console.log('📋 Dados do projeto:', projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    if (error) {
      console.error('❌ Erro ao inserir projeto:', error);
      return { success: false, error };
    }

    console.log('✅ Projeto Platão Carnívoro inserido com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return { success: false, error };
  }
};