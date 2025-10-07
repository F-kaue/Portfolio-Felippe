#!/usr/bin/env node
// scripts/keep-supabase-active.js
// Script para manter o projeto Supabase ativo via cron job

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configurações
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
  console.error('Configure REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

class SupabaseKeepAlive {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 segundos
  }

  /**
   * Executa ping no banco de dados
   */
  async ping() {
    const startTime = Date.now();
    let retries = 0;

    while (retries < this.maxRetries) {
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
        return { success: true, responseTime };

      } catch (error) {
        retries++;
        console.error(`❌ Erro no ping #${retries}:`, error.message);

        if (retries >= this.maxRetries) {
          // Log do erro final
          await this.logHeartbeat({
            timestamp: new Date().toISOString(),
            status: 'error',
            error_message: error.message
          });

          console.error('💥 Falha após todas as tentativas');
          return { success: false, error: error.message };
        }

        // Aguarda antes da próxima tentativa
        console.log(`⏳ Aguardando ${this.retryDelay/1000}s antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  /**
   * Registra o resultado do heartbeat
   */
  async logHeartbeat(log) {
    try {
      const { error } = await supabase
        .from('heartbeat_logs')
        .insert(log);

      if (error) {
        console.warn('⚠️ Não foi possível salvar log do heartbeat:', error.message);
      } else {
        console.log('📝 Log do heartbeat salvo com sucesso');
      }
    } catch (error) {
      console.warn('⚠️ Erro ao salvar log:', error.message);
    }
  }

  /**
   * Verifica o status do projeto
   */
  async checkStatus() {
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
      console.error('❌ Erro ao verificar status:', error.message);
      return { isActive: false };
    }
  }

  /**
   * Obtém estatísticas
   */
  async getStats() {
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
        .map(log => log.response_time);
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
      console.error('❌ Erro ao obter estatísticas:', error.message);
      return {
        totalPings: 0,
        successRate: 0,
        averageResponseTime: 0,
        last24Hours: 0
      };
    }
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando Keep Supabase Active...');
  console.log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
  console.log(`🌐 URL: ${SUPABASE_URL}`);
  
  const keepAlive = new SupabaseKeepAlive();
  
  try {
    // Verifica status atual
    console.log('\n📊 Verificando status atual...');
    const status = await keepAlive.checkStatus();
    console.log(`Status: ${status.isActive ? '✅ Ativo' : '❌ Inativo'}`);
    if (status.lastPing) {
      console.log(`Último ping: ${new Date(status.lastPing).toLocaleString('pt-BR')}`);
    }

    // Executa ping
    console.log('\n🔄 Executando ping...');
    const result = await keepAlive.ping();
    
    if (result.success) {
      console.log(`✅ Ping executado com sucesso! (${result.responseTime}ms)`);
    } else {
      console.log(`❌ Falha no ping: ${result.error}`);
      process.exit(1);
    }

    // Mostra estatísticas
    console.log('\n📈 Estatísticas:');
    const stats = await keepAlive.getStats();
    console.log(`Total de pings: ${stats.totalPings}`);
    console.log(`Taxa de sucesso: ${stats.successRate.toFixed(1)}%`);
    console.log(`Tempo médio de resposta: ${stats.averageResponseTime.toFixed(0)}ms`);
    console.log(`Pings nas últimas 24h: ${stats.last24Hours}`);

    console.log('\n🎉 Keep Supabase Active executado com sucesso!');
    
  } catch (error) {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = SupabaseKeepAlive;
