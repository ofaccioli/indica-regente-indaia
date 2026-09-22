-- ==============================================================================
-- INDICA REGENTE INDAIA - SCHEMA DO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- ==============================================================================

-- 1. TABELA DE SERVIÇOS E CONTATOS
CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  telefone TEXT NOT NULL,
  telefone_numeros TEXT NOT NULL,
  cidade_bairro TEXT NOT NULL,
  descricao TEXT,
  quem_indicou TEXT,
  instagram TEXT,
  nota_media NUMERIC(3, 2) DEFAULT 5.0,
  total_avaliacoes INTEGER DEFAULT 1,
  verificado_admin BOOLEAN DEFAULT false,
  atende_fim_de_semana BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índice único no telefone (apenas números) para prevenir duplicidades na base
CREATE UNIQUE INDEX IF NOT EXISTS idx_servicos_telefone_numeros ON public.servicos(telefone_numeros);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON public.servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_nota_media ON public.servicos(nota_media DESC);

-- 2. TABELA DE AVALIAÇÕES / RECOMENDAÇÕES
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  nome_avaliador TEXT NOT NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_servico_id ON public.avaliacoes(servico_id);

-- 3. TRIGGER PARA ATUALIZAR NOTA MÉDIA E TOTAL AUTOMATICAMENTE NO SUPABASE
CREATE OR REPLACE FUNCTION public.atualizar_nota_servico()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.servicos
  SET 
    nota_media = COALESCE((
      SELECT ROUND(AVG(nota)::numeric, 2)
      FROM public.avaliacoes
      WHERE servico_id = NEW.servico_id
    ), 5.0),
    total_avaliacoes = COALESCE((
      SELECT COUNT(*)
      FROM public.avaliacoes
      WHERE servico_id = NEW.servico_id
    ), 0)
  WHERE id = NEW.servico_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_atualizar_nota_servico ON public.avaliacoes;
CREATE TRIGGER trigger_atualizar_nota_servico
AFTER INSERT OR UPDATE OR DELETE ON public.avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_nota_servico();

-- 4. HABILITAR ROW LEVEL SECURITY (RLS) - Permite leitura e escrita pública para a comunidade
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de servicos"
  ON public.servicos FOR SELECT
  USING (true);

CREATE POLICY "Permitir cadastro público de servicos"
  ON public.servicos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de servicos"
  ON public.servicos FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão de servicos"
  ON public.servicos FOR DELETE
  USING (true);

CREATE POLICY "Permitir leitura pública de avaliacoes"
  ON public.avaliacoes FOR SELECT
  USING (true);

CREATE POLICY "Permitir cadastro público de avaliacoes"
  ON public.avaliacoes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de avaliacoes"
  ON public.avaliacoes FOR DELETE
  USING (true);

-- 5. DADOS INICIAIS DE EXEMPLO PARA A COMUNIDADE INDICA REGENTE INDAIÁ
INSERT INTO public.servicos (nome, categoria, telefone, telefone_numeros, cidade_bairro, descricao, quem_indicou, nota_media, total_avaliacoes)
VALUES 
  ('Carlos Roberto Eletricista', 'Eletricista', '(18) 99712-4040', '18997124040', 'Regente Feijó - Centro', 'Instalação de padrão, fiação completa, quadro de disjuntores e chuveiros. Atende finais de semana.', 'Ricardo do Grupo', 4.95, 18),
  ('Dona Luíza Diarista e Passadeira', 'Diarista / Limpeza', '(19) 98844-3322', '19988443322', 'Indaiatuba - Morada do Sol', 'Faxina pesada, limpeza pós-obra e cuidado impecável com roupas. Muito pontual e de confiança.', 'Ana Paula Condomínio', 5.0, 24),
  ('Mecânica do Beto - Auto & Moto', 'Mecânico', '(18) 99655-1122', '18996551122', 'Regente Feijó - Vila Nova', 'Injeção eletrônica, suspensão, freios e troca de óleo rápida. Preço justo e honestidade.', 'Marcos Mecânico', 4.80, 15),
  ('Dr. Fernando Veterinário 24h', 'Pet / Veterinário', '(19) 99123-9988', '19991239988', 'Indaiatuba - Vila Avai', 'Consultas, vacinas em domicílio, cirurgias e plantão de emergência para cães e gatos.', 'Juliana Santos', 4.90, 21),
  ('Marcos Encanador & Caça Vazamentos', 'Encanador', '(18) 99877-6655', '18998776655', 'Regente Feijó - Jd das Flores', 'Localização de vazamentos ocultos sem quebrar parede à toa, troca de torneiras e caixas d água.', 'Seu Zé do Mercado', 4.85, 12),
  ('Pizzaria & Forno Artesanal Sabor da Vila', 'Restaurante / Lanche', '(19) 99766-5544', '19997665544', 'Indaiatuba - Centro', 'Melhor pizza com massa de fermentação natural, forno a lenha e entrega super rápida.', 'Família Ribeiro', 4.75, 30)
ON CONFLICT (telefone_numeros) DO NOTHING;
