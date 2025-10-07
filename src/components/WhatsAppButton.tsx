import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/5585992884178?text=Olá! Gostaria de solicitar um orçamento para desenvolvimento web."
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "bg-green-600 hover:bg-green-700 text-white",
        "w-14 h-14 rounded-full shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl",
        "animate-pulse hover:animate-none",
        "group"
      )}
      aria-label="Entrar em contato via WhatsApp"
      title="Solicitar orçamento via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Solicitar orçamento
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
