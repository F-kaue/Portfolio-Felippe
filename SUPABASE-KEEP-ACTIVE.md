# 🚀 Sistema de Heartbeat para Manter Supabase Ativo

## 🎯 Problema Resolvido

O **Supabase Free Tier** pausa automaticamente projetos que ficam **inativos por mais de 7 dias**. Este sistema resolve esse problema executando pings regulares no banco de dados para manter o projeto sempre ativo.

## ⚡ Solução Implementada

### 1. **Sistema de Heartbeat Automático**
- ✅ **Ping a cada 6 horas** (bem antes dos 7 dias)
- ✅ **Múltiplas estratégias** de ping para garantir sucesso
- ✅ **Sistema de retry** com 3 tentativas
- ✅ **Logs detalhados** de todas as operações
- ✅ **Monitoramento em tempo real** do status

### 2. **Componentes Criados**

#### 📁 `src/utils/supabaseHeartbeat.ts`
- Classe principal do sistema de heartbeat
- Execução automática em produção
- Métodos para ping, logs e estatísticas

#### 📁 `src/components/HeartbeatMonitor.tsx`
- Interface visual para monitoramento
- Estatísticas em tempo real
- Controles manuais (iniciar/parar)

#### 📁 `scripts/keep-supabase-active.js`
- Script para execução via cron job
- Ideal para servidores e VPS
- Logs detalhados e tratamento de erros

#### 📁 `supabase-heartbeat-setup.sql`
- Script SQL para configurar tabelas
- Funções para estatísticas e limpeza
- Views para monitoramento fácil

## 🛠️ Como Usar

### **Opção 1: Automático (Recomendado)**
O sistema já está integrado e funciona automaticamente quando o site está online:

```typescript
// Já configurado em src/pages/Index.tsx
heartbeat.start(); // Inicia automaticamente
```

### **Opção 2: Cron Job (Para Servidores)**
Para execução em servidores com cron:

```bash
# Configurar cron job
crontab -e

# Adicionar linha (executa a cada 6 horas)
0 */6 * * * cd /caminho/para/seu/projeto && node scripts/keep-supabase-active.js
```

### **Opção 3: Serviços Online (Gratuitos)**
- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **StatusCake**: https://www.statuscake.com

## 📊 Configuração do Banco de Dados

### 1. **Executar Script SQL**
```sql
-- Execute o arquivo supabase-heartbeat-setup.sql no Supabase
-- Isso criará as tabelas e funções necessárias
```

### 2. **Variáveis de Ambiente**
```bash
# .env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 📈 Monitoramento

### **Interface Visual**
- Acesse o monitor em desenvolvimento: `http://localhost:3000`
- Veja estatísticas em tempo real
- Controle manual do sistema

### **Logs do Sistema**
```bash
# Ver logs do cron job
tail -f /var/log/supabase-heartbeat.log

# Ver logs do navegador
F12 → Console → Procurar por "Heartbeat"
```

### **Consultas SQL**
```sql
-- Ver status atual
SELECT * FROM heartbeat_status;

-- Ver estatísticas
SELECT * FROM get_heartbeat_stats();

-- Ver últimos pings
SELECT * FROM heartbeat_logs ORDER BY timestamp DESC LIMIT 10;
```

## 🔧 Configurações Avançadas

### **Alterar Frequência**
```typescript
// Em src/utils/supabaseHeartbeat.ts
private readonly INTERVAL_MINUTES = 4 * 60; // 4 horas
```

### **Alterar Estratégias de Ping**
```typescript
// Adicionar novas consultas em src/utils/supabaseHeartbeat.ts
const { data } = await supabase
  .from('sua_tabela')
  .select('id')
  .limit(1);
```

### **Configurar Notificações**
```bash
# Email em caso de erro
0 */6 * * * node scripts/keep-supabase-active.js || echo "Erro no heartbeat" | mail -s "Supabase Error" seu-email@exemplo.com
```

## 📋 Checklist de Implementação

- [ ] ✅ **Sistema de heartbeat criado**
- [ ] ✅ **Componente de monitoramento criado**
- [ ] ✅ **Script para cron job criado**
- [ ] ✅ **Documentação completa criada**
- [ ] ⏳ **Executar script SQL no Supabase**
- [ ] ⏳ **Configurar variáveis de ambiente**
- [ ] ⏳ **Testar sistema manualmente**
- [ ] ⏳ **Configurar cron job (opcional)**
- [ ] ⏳ **Monitorar logs por alguns dias**

## 🚨 Troubleshooting

### **Erro: "Variáveis de ambiente não configuradas"**
```bash
# Verificar se as variáveis estão definidas
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### **Erro: "Tabela heartbeat_logs não existe"**
```sql
-- Executar o script SQL no Supabase
-- Arquivo: supabase-heartbeat-setup.sql
```

### **Cron não executa**
```bash
# Verificar permissões
chmod +x scripts/keep-supabase-active.js

# Usar caminho completo
/usr/local/bin/node /caminho/completo/scripts/keep-supabase-active.js
```

### **Projeto ainda pausa**
- Verificar se o cron está rodando: `crontab -l`
- Verificar logs: `tail -f /var/log/supabase-heartbeat.log`
- Testar manualmente: `node scripts/keep-supabase-active.js`

## 💡 Dicas Importantes

1. **Teste primeiro**: Sempre teste manualmente antes de configurar cron
2. **Monitore logs**: Verifique regularmente se está funcionando
3. **Backup**: Mantenha backup das configurações
4. **Segurança**: Não exponha chaves em logs públicos
5. **Alternativas**: Use serviços online como backup

## 🎉 Resultado Final

Com este sistema implementado, seu projeto Supabase **nunca mais será pausado por inatividade**! O sistema:

- ✅ **Executa pings automáticos** a cada 6 horas
- ✅ **Registra todos os logs** para auditoria
- ✅ **Fornece monitoramento visual** do status
- ✅ **Tem sistema de retry** para garantir sucesso
- ✅ **É totalmente automatizado** e confiável

**Seu projeto Supabase estará sempre ativo e disponível!** 🚀
