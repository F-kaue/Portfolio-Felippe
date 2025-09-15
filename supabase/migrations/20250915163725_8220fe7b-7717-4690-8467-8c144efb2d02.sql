-- Atualizar imagem do projeto Platão Carnívoro para usar a imagem padrão de código
UPDATE public.projects 
SET images = ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center']
WHERE title = 'Platão Carnívoro';