import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const SmartChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    "Quero um orçamento",
    "Preciso de um site",
    "Sistema personalizado",
    "Automação de processos",
    "Falar com você"
  ];

  const autoReplies = {
    "orçamento": "Perfeito! Para criar um orçamento personalizado, preciso entender melhor seu projeto. Você pode me contar: 1) Que tipo de site/sistema precisa? 2) Qual o prazo desejado? 3) Tem alguma funcionalidade específica em mente?",
    "site": "Ótimo! Desenvolvo sites profissionais otimizados para SEO. Posso criar desde sites institucionais até e-commerces completos. Que tipo de site você precisa?",
    "sistema": "Excelente! Desenvolvo sistemas web personalizados para automação e gestão. Que tipo de sistema você tem em mente?",
    "automação": "Perfeito! A automação pode reduzir custos e aumentar produtividade significativamente. Que processos você gostaria de automatizar?",
    "falar": "Claro! Estou aqui para ajudar. Pode me contar mais sobre seu projeto ou dúvidas que tenho?"
  };

  useEffect(() => {
    if (!isOpen) return;

    // Mensagem de boas-vindas automática
    const welcomeMessage = {
      id: 1,
      text: "Olá! 👋 Sou o Felippe Kauê, desenvolvedor Full Stack. Como posso ajudar você hoje?",
      isUser: false,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular resposta automática
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let reply = "Obrigado pela sua mensagem! Vou responder em breve. Enquanto isso, você pode me contatar diretamente pelo WhatsApp: (85) 99288-4178";

      // Verificar palavras-chave para resposta automática
      for (const [keyword, response] of Object.entries(autoReplies)) {
        if (lowerText.includes(keyword)) {
          reply = response;
          break;
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        text: reply,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleWhatsAppRedirect = () => {
    const message = messages.length > 1 
      ? `Olá! Estava conversando sobre: "${messages[messages.length - 1].text}"`
      : "Olá! Gostaria de conversar sobre desenvolvimento web.";
    
    window.open(`https://wa.me/5585992884178?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* Botão do Chat */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-50",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "w-14 h-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-300",
          "hover:scale-110 hover:shadow-xl",
          "animate-pulse hover:animate-none",
          "group"
        )}
        aria-label="Abrir chat de suporte"
        title="Chat de suporte - Tire suas dúvidas"
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Tire suas dúvidas
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </button>

      {/* Modal do Chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  FK
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Felippe Kauê</h3>
                  <p className="text-sm text-green-500">● Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs px-4 py-2 rounded-lg",
                      message.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-3">Respostas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Continuar no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartChat;
