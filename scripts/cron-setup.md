# Configuração de Cron Jobs para Manter Supabase Ativo

## 🎯 Objetivo
Manter o projeto Supabase ativo executando pings regulares no banco de dados para evitar a pausa automática após 7 dias de inatividade.

## 📋 Pré-requisitos

1. **Node.js instalado** no servidor
2. **Variáveis de ambiente configuradas**:
   ```bash
   export REACT_APP_SUPABASE_URL="https://seu-projeto.supabase.co"
   export REACT_APP_SUPABASE_ANON_KEY="sua-chave-anonima"
   ```

## 🚀 Configuração

### 1. Tornar o script executável
```bash
chmod +x scripts/keep-supabase-active.js
```

### 2. Testar o script manualmente
```bash
cd /caminho/para/seu/projeto
node scripts/keep-supabase-active.js
```

### 3. Configurar Cron Job

#### Opção A: A cada 6 horas (Recomendado)
```bash
# Editar crontab
crontab -e

# Adicionar linha (executa a cada 6 horas)
0 */6 * * * cd /caminho/para/seu/projeto && node scripts/keep-supabase-active.js >> /var/log/supabase-heartbeat.log 2>&1
```

#### Opção B: A cada 4 horas (Mais seguro)
```bash
# Executa a cada 4 horas
0 */4 * * * cd /caminho/para/seu/projeto && node scripts/keep-supabase-active.js >> /var/log/supabase-heartbeat.log 2>&1
```

#### Opção C: Diariamente às 9h
```bash
# Executa todo dia às 9h
0 9 * * * cd /caminho/para/seu/projeto && node scripts/keep-supabase-active.js >> /var/log/supabase-heartbeat.log 2>&1
```

## 🔧 Configurações Avançadas

### Logs Detalhados
```bash
# Com timestamp nos logs
0 */6 * * * cd /caminho/para/seu/projeto && echo "$(date): Executando heartbeat" >> /var/log/supabase-heartbeat.log && node scripts/keep-supabase-active.js >> /var/log/supabase-heartbeat.log 2>&1
```

### Notificações por Email (Opcional)
```bash
# Com notificação de erro por email
0 */6 * * * cd /caminho/para/seu/projeto && node scripts/keep-supabase-active.js || echo "Erro no heartbeat Supabase" | mail -s "Supabase Heartbeat Failed" seu-email@exemplo.com
```

## 📊 Monitoramento

### Verificar logs
```bash
# Ver últimos logs
tail -f /var/log/supabase-heartbeat.log

# Ver logs das últimas 24h
grep "$(date '+%Y-%m-%d')" /var/log/supabase-heartbeat.log
```

### Verificar cron jobs ativos
```bash
# Listar cron jobs
crontab -l

# Verificar se o cron está rodando
systemctl status cron
```

## 🌐 Alternativas Online

### 1. UptimeRobot (Gratuito)
- Acesse: https://uptimerobot.com
- Configure monitoramento HTTP para seu site
- Frequência: 5 minutos (gratuito)
- Vantagem: Monitora também a disponibilidade do site

### 2. Pingdom (Gratuito)
- Acesse: https://www.pingdom.com
- Configure monitoramento HTTP
- Frequência: 1 minuto (gratuito)
- Vantagem: Relatórios detalhados

### 3. StatusCake (Gratuito)
- Acesse: https://www.statuscake.com
- Configure monitoramento HTTP
- Frequência: 5 minutos (gratuito)
- Vantagem: Alertas por email/SMS

## 🔄 Scripts de Backup

### Script para Windows (Task Scheduler)
```batch
@echo off
cd /d "C:\caminho\para\seu\projeto"
node scripts/keep-supabase-active.js
```

### Script para macOS (LaunchAgent)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.supabase.heartbeat</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/caminho/para/seu/projeto/scripts/keep-supabase-active.js</string>
    </array>
    <key>StartInterval</key>
    <integer>21600</integer>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

## ⚠️ Importante

1. **Teste primeiro**: Sempre teste o script manualmente antes de configurar o cron
2. **Monitore logs**: Verifique regularmente se o cron está executando
3. **Backup**: Mantenha backup das configurações
4. **Segurança**: Não exponha as chaves do Supabase em logs públicos

## 🆘 Troubleshooting

### Cron não executa
```bash
# Verificar permissões
ls -la scripts/keep-supabase-active.js

# Verificar PATH do Node
which node

# Usar caminho completo no cron
/usr/local/bin/node /caminho/completo/scripts/keep-supabase-active.js
```

### Erro de permissão
```bash
# Dar permissão de execução
chmod +x scripts/keep-supabase-active.js

# Verificar proprietário
chown usuario:grupo scripts/keep-supabase-active.js
```

### Variáveis de ambiente não carregam
```bash
# Carregar no cron
0 */6 * * * cd /caminho/para/seu/projeto && source .env && node scripts/keep-supabase-active.js
```
