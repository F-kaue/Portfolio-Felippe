-- supabase-heartbeat-setup.sql
-- Script para configurar o sistema de heartbeat no Supabase

-- 1. Criar tabela para logs do heartbeat
CREATE TABLE IF NOT EXISTS heartbeat_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('success', 'error')),
    response_time INTEGER, -- em milissegundos
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_heartbeat_logs_timestamp ON heartbeat_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_heartbeat_logs_status ON heartbeat_logs(status);
CREATE INDEX IF NOT EXISTS idx_heartbeat_logs_created_at ON heartbeat_logs(created_at DESC);

-- 3. Criar função para limpeza automática de logs antigos (manter apenas 30 dias)
CREATE OR REPLACE FUNCTION cleanup_old_heartbeat_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM heartbeat_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Log da limpeza
    INSERT INTO heartbeat_logs (timestamp, status, error_message)
    VALUES (NOW(), 'success', 'Limpeza automática de logs antigos executada');
END;
$$ LANGUAGE plpgsql;

-- 4. Criar função para obter estatísticas do heartbeat
CREATE OR REPLACE FUNCTION get_heartbeat_stats()
RETURNS TABLE (
    total_pings BIGINT,
    successful_pings BIGINT,
    failed_pings BIGINT,
    success_rate NUMERIC,
    avg_response_time NUMERIC,
    last_24h_pings BIGINT,
    last_ping TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_pings,
        COUNT(*) FILTER (WHERE status = 'success') as successful_pings,
        COUNT(*) FILTER (WHERE status = 'error') as failed_pings,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'success')::NUMERIC / COUNT(*)) * 100, 
            2
        ) as success_rate,
        ROUND(AVG(response_time), 2) as avg_response_time,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h_pings,
        MAX(timestamp) as last_ping
    FROM heartbeat_logs;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar função para verificar se o projeto está ativo
CREATE OR REPLACE FUNCTION is_project_active()
RETURNS BOOLEAN AS $$
DECLARE
    last_successful_ping TIMESTAMPTZ;
BEGIN
    SELECT MAX(timestamp) INTO last_successful_ping
    FROM heartbeat_logs
    WHERE status = 'success';
    
    -- Considera ativo se houve ping bem-sucedido nas últimas 24 horas
    RETURN last_successful_ping IS NOT NULL AND 
           last_successful_ping > NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- 6. Configurar RLS (Row Level Security) se necessário
ALTER TABLE heartbeat_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de logs (para o sistema de heartbeat)
CREATE POLICY "Allow heartbeat log insertion" ON heartbeat_logs
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de logs (para monitoramento)
CREATE POLICY "Allow heartbeat log reading" ON heartbeat_logs
    FOR SELECT USING (true);

-- 7. Criar view para monitoramento fácil
CREATE OR REPLACE VIEW heartbeat_status AS
SELECT 
    is_project_active() as is_active,
    (SELECT timestamp FROM heartbeat_logs WHERE status = 'success' ORDER BY timestamp DESC LIMIT 1) as last_successful_ping,
    (SELECT response_time FROM heartbeat_logs WHERE status = 'success' ORDER BY timestamp DESC LIMIT 1) as last_response_time,
    (SELECT COUNT(*) FROM heartbeat_logs WHERE created_at > NOW() - INTERVAL '24 hours') as pings_last_24h,
    (SELECT COUNT(*) FROM heartbeat_logs WHERE created_at > NOW() - INTERVAL '7 days') as pings_last_7_days;

-- 8. Inserir log inicial
INSERT INTO heartbeat_logs (timestamp, status, error_message)
VALUES (NOW(), 'success', 'Sistema de heartbeat configurado com sucesso');

-- 9. Comentários para documentação
COMMENT ON TABLE heartbeat_logs IS 'Logs do sistema de heartbeat para manter o projeto Supabase ativo';
COMMENT ON FUNCTION cleanup_old_heartbeat_logs() IS 'Remove logs de heartbeat com mais de 30 dias';
COMMENT ON FUNCTION get_heartbeat_stats() IS 'Retorna estatísticas do sistema de heartbeat';
COMMENT ON FUNCTION is_project_active() IS 'Verifica se o projeto está ativo baseado nos pings recentes';
COMMENT ON VIEW heartbeat_status IS 'View para monitoramento rápido do status do heartbeat';
