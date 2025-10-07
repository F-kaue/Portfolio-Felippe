// src/utils/supabaseHeartbeat.ts
// Sistema de Heartbeat para manter o projeto Supabase ativo

import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Sistema de heartbeat desabilitado.');
  console.warn('📝 Crie um arquivo .env na raiz do projeto com:');
  console.warn('VITE_SUPABASE_URL=https://seu-projeto.supabase.co');
  console.warn('VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anonima');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface HeartbeatLog {
  id?: number;
  timestamp: string;
  status: 'success' | 'error';
  response_time?: number;
  error_message?: string;
}

class SupabaseHeartbeat {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly INTERVAL_MINUTES = 6 * 60; // 6 horas (bem antes dos 7 dias)
  private readonly MAX_RETRIES = 3;

  /**
   * Inicia o sistema de heartbeat
   */
  public start(): void {
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado. Heartbeat não pode ser iniciado.');
      return;
    }

    if (this.isRunning) {
      console.log('🔄 Heartbeat já está rodando');
      return;
    }

    console.log('🚀 Iniciando Supabase Heartbeat...');
    this.isRunning = true;

    // Executa imediatamente
    this.ping();

    // Agenda execuções regulares
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.INTERVAL_MINUTES * 60 * 1000);

    console.log(`✅ Heartbeat configurado para executar a cada ${this.INTERVAL_MINUTES} minutos`);
  }

  /**
   * Para o sistema de heartbeat
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Heartbeat parado');
  }

  /**
   * Executa um ping no banco de dados
   */
  private async ping(): Promise<void> {
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado. Ping não pode ser executado.');
      return;
    }

    const startTime = Date.now();
    let retries = 0;

    while (retries < this.MAX_RETRIES) {
      try {
        console.log(`🔄 Executando ping #${retries + 1}...`);

        // Estratégia 1: Consulta simples na tabela de projetos
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id')
          .limit(1);

        if (projectsError) {
          console.warn('⚠️ Erro na consulta de projetos, tentando estratégia alternativa...');
          
          // Estratégia 2: Consulta de sistema (mais leve)
          const { error: systemError } = await supabase
            .from('projects')
            .select('count')
            .limit(0);

          if (systemError) {
            throw systemError;
          }
        }

        const responseTime = Date.now() - startTime;
        
        // Log do sucesso
        await this.logHeartbeat({
          timestamp: new Date().toISOString(),
          status: 'success',
          response_time: responseTime
        });

        console.log(`✅ Ping bem-sucedido! Tempo de resposta: ${responseTime}ms`);
        return;

      } catch (error) {
        retries++;
        console.error(`❌ Erro no ping #${retries}:`, error);

        if (retries >= this.MAX_RETRIES) {
          // Log do erro final
          await this.logHeartbeat({
            timestamp: new Date().toISOString(),
            status: 'error',
            error_message: error instanceof Error ? error.message : 'Erro desconhecido'
          });

          console.error('💥 Falha após todas as tentativas');
          return;
        }

        // Aguarda antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  /**
   * Registra o resultado do heartbeat
   */
  private async logHeartbeat(log: HeartbeatLog): Promise<void> {
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado. Log não pode ser salvo.');
      return;
    }

    try {
      // Tenta inserir na tabela de logs (se existir)
      const { error } = await supabase
        .from('heartbeat_logs')
        .insert(log);

      if (error) {
        console.warn('⚠️ Não foi possível salvar log do heartbeat:', error.message);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao salvar log:', error);
    }
  }

  /**
   * Verifica o status do projeto
   */
  public async checkStatus(): Promise<{
    isActive: boolean;
    lastPing?: string;
    responseTime?: number;
  }> {
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado. Status não pode ser verificado.');
      return { isActive: false };
    }

    try {
      const { data, error } = await supabase
        .from('heartbeat_logs')
        .select('timestamp, response_time')
        .eq('status', 'success')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      const lastPing = data?.timestamp;
      const isActive = lastPing ? 
        (Date.now() - new Date(lastPing).getTime()) < (24 * 60 * 60 * 1000) : // 24 horas
        false;

      return {
        isActive,
        lastPing,
        responseTime: data?.response_time
      };
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      return { isActive: false };
    }
  }

  /**
   * Obtém estatísticas do heartbeat
   */
  public async getStats(): Promise<{
    totalPings: number;
    successRate: number;
    averageResponseTime: number;
    last24Hours: number;
  }> {
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado. Estatísticas não podem ser obtidas.');
      return {
        totalPings: 0,
        successRate: 0,
        averageResponseTime: 0,
        last24Hours: 0
      };
    }

    try {
      const { data, error } = await supabase
        .from('heartbeat_logs')
        .select('status, response_time, timestamp');

      if (error) {
        throw error;
      }

      const totalPings = data.length;
      const successfulPings = data.filter(log => log.status === 'success').length;
      const successRate = totalPings > 0 ? (successfulPings / totalPings) * 100 : 0;
      
      const responseTimes = data
        .filter(log => log.response_time)
        .map(log => log.response_time!);
      const averageResponseTime = responseTimes.length > 0 ? 
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;

      const last24Hours = data.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        return (Date.now() - logTime) < (24 * 60 * 60 * 1000);
      }).length;

      return {
        totalPings,
        successRate,
        averageResponseTime,
        last24Hours
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return {
        totalPings: 0,
        successRate: 0,
        averageResponseTime: 0,
        last24Hours: 0
      };
    }
  }
}

// Instância singleton
const heartbeat = new SupabaseHeartbeat();

// Auto-start em produção
if (import.meta.env.PROD) {
  heartbeat.start();
}

export default heartbeat;
export { SupabaseHeartbeat };
