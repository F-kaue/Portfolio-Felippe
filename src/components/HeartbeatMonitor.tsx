// src/components/HeartbeatMonitor.tsx
// Componente para monitorar o status do heartbeat do Supabase

import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, XCircle, TrendingUp, Database } from 'lucide-react';
import heartbeat from '@/utils/supabaseHeartbeat';

interface HeartbeatStats {
  totalPings: number;
  successRate: number;
  averageResponseTime: number;
  last24Hours: number;
}

interface ProjectStatus {
  isActive: boolean;
  lastPing?: string;
  responseTime?: number;
}

const HeartbeatMonitor: React.FC = () => {
  const [stats, setStats] = useState<HeartbeatStats | null>(null);
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [statsData, statusData] = await Promise.all([
        heartbeat.getStats(),
        heartbeat.checkStatus()
      ]);
      
      setStats(statsData);
      setStatus(statusData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao buscar dados do heartbeat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Nunca';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return 'N/A';
    return `${time}ms`;
  };

  if (isLoading) {
    return (
      <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Monitor Supabase</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Monitor Supabase</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
        </div>
      </div>

      {/* Status Principal */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {status?.isActive ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={`font-medium ${status?.isActive ? 'text-green-400' : 'text-red-400'}`}>
            {status?.isActive ? 'Projeto Ativo' : 'Projeto Inativo'}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Último ping: {formatTime(status?.lastPing)}
        </p>
        {status?.responseTime && (
          <p className="text-sm text-gray-400">
            Tempo de resposta: {formatResponseTime(status.responseTime)}
          </p>
        )}
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Taxa de Sucesso</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {stats.successRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Pings (24h)</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {stats.last24Hours}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Tempo Médio</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {formatResponseTime(stats.averageResponseTime)}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">Total Pings</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {stats.totalPings}
            </p>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex space-x-3">
        <button
          onClick={fetchData}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Atualizar Agora
        </button>
        <button
          onClick={() => heartbeat.start()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Iniciar Heartbeat
        </button>
        <button
          onClick={() => heartbeat.stop()}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Parar Heartbeat
        </button>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 <strong>Dica:</strong> O sistema executa pings a cada 6 horas para manter seu projeto Supabase ativo. 
          Projetos gratuitos são pausados após 7 dias de inatividade.
        </p>
      </div>
    </div>
  );
};

export default HeartbeatMonitor;
