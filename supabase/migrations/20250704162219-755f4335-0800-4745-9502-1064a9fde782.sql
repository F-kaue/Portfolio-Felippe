
-- Criar tabela para experiências profissionais
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT[] NOT NULL DEFAULT '{}',
  icon_type TEXT DEFAULT 'briefcase',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública das experiências
CREATE POLICY "Experiências são públicas para leitura" 
  ON public.experiences 
  FOR SELECT 
  USING (true);

-- Criar política para permitir inserção, atualização e exclusão (para administração)
CREATE POLICY "Permitir inserção de experiências" 
  ON public.experiences 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de experiências" 
  ON public.experiences 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir exclusão de experiências" 
  ON public.experiences 
  FOR DELETE 
  USING (true);

-- Inserir dados de exemplo baseados no que vi no localStorage
INSERT INTO public.experiences (title, company, period, description, icon_type, display_order) VALUES 
(
  'Analista de Suporte',
  'I & B TECNOLOGIA LTDA',
  'Atual',
  ARRAY[
    'Suporte em sistema sindical',
    'Auxílio em demandas de desenvolvimento',
    'Resolução de problemas técnicos relacionados ao sistema',
    'Colaboração com a equipe de desenvolvimento para melhorar e atualizar funcionalidades'
  ],
  'headset',
  1
),
(
  'Técnico de Informática',
  'Quarta Etapa',
  'Anterior',
  ARRAY[
    'Atendimento de chamados e resolução de problemas à distância por meio de ferramentas de acesso remoto',
    'Registro de procedimentos, resolução de problemas, atualizações e mudanças realizadas no ambiente de TI',
    'Gerenciamento de chamados e atendimento conforme os níveis de SLA acordados',
    'Gerenciamento de inventário de equipamentos e peças, incluindo organização, reposição e descarte de itens obsoletos'
  ],
  'computer',
  2
),
(
  'Aprendiz Faturista',
  'Rede Oto Kora Saúde',
  'Anterior',
  ARRAY[
    'Análise e conferência de contas médicas para faturamento',
    'Auditoria interna para correção de inconsistências',
    'Manutenção de registros financeiros e relatórios'
  ],
  'file-text',
  3
);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON public.experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_experiences_updated_at();
