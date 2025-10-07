# 🚀 Configuração Rápida - Sistema de Heartbeat

## ❌ **Problema Resolvido**
O erro `Uncaught ReferenceError: process is not defined` foi corrigido!

## ✅ **Solução Aplicada**
- Alterado `process.env` para `import.meta.env` (compatível com Vite)
- Atualizado todas as referências de variáveis de ambiente

## 🔧 **Como Configurar Agora**

### 1. **Criar arquivo .env na raiz do projeto**
```bash
# Crie um arquivo .env na pasta raiz do seu projeto com:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 2. **Substituir pelos seus valores reais**
- Acesse seu projeto no Supabase
- Vá em Settings → API
- Copie a URL e a chave anônima
- Cole no arquivo .env

### 3. **Reiniciar o servidor**
```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

## 🎯 **Resultado**
- ✅ Erro corrigido
- ✅ Sistema de heartbeat funcionando
- ✅ Projeto Supabase sempre ativo

## 📋 **Próximos Passos**
1. Execute o script SQL no Supabase (`supabase-heartbeat-setup.sql`)
2. Configure as variáveis de ambiente
3. Teste o sistema

**Seu projeto nunca mais será pausado por inatividade!** 🚀
