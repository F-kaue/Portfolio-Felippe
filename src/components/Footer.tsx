
import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  return (
    <footer className="relative bg-background border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <a href="#hero" className="text-2xl font-bold gradient-text font-heading mb-6">
            Felippe Kauê
          </a>
          
          <div className="flex space-x-4 mb-6">
            <a 
              href="https://github.com/F-kaue" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/felippe-kau%C3%AA-7165782b6/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:f_kaue@hotmail.com" 
              className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} Felippe Kauê. Todos os direitos reservados.
          </p>
        </div>
      </div>
      
      <button 
        className={cn(
          "absolute right-8 bottom-8 w-10 h-10",
          "rounded-full bg-highlight-blue/80 text-white",
          "flex items-center justify-center shadow-lg",
          "hover:bg-highlight-blue transition-colors duration-300"
        )}
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
