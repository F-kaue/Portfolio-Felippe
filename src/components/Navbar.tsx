
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Zap, Briefcase, Mail, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'nes.css/css/nes.min.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home, description: 'Base principal' },
    { name: 'About', href: '#about', icon: User, description: 'Perfil do jogador' },
    { name: 'Skills', href: '#skills', icon: Zap, description: 'Habilidades' },
    { name: 'Projects', href: '#projects', icon: FolderOpen, description: 'Inventário de projetos' },
    { name: 'Experience', href: '#experience', icon: Briefcase, description: 'Histórico de batalhas' },
    { name: 'Contact', href: '#contact', icon: Mail, description: 'Comunicação' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'py-2' : 'py-4'
      )}
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="nes-container is-dark with-title p-4"
          style={{ 
            backgroundColor: '#212529',
            border: '4px solid #0c7cff',
            boxShadow: '0 0 20px rgba(12, 124, 255, 0.3)'
          }}
        >
          <p className="title text-white text-xs mb-0">INVENTORY</p>
          
          <div className="flex justify-between items-center">
            <a 
              href="#hero" 
              className="text-lg font-bold text-white hover:text-yellow-400 transition-colors duration-200"
              style={{ fontSize: '12px' }}
            >
              {'<FELIPPE.DEV/>'}
            </a>
            
            {/* Desktop Navigation - Grid Style Inventory */}
            <div className="hidden md:grid grid-cols-6 gap-2">
              {navLinks.map((link, index) => (
                <div key={link.name} className="relative group">
                  <a
                    href={link.href}
                    className="nes-btn is-primary block w-12 h-12 p-2 text-center hover:scale-110 transition-transform duration-200"
                    title={`${link.name} - ${link.description}`}
                    style={{ 
                      fontSize: '10px',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <link.icon size={16} />
                  </a>
                  
                  {/* Tooltip estilo jogo */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div 
                      className="nes-balloon from-left p-2 whitespace-nowrap"
                      style={{ 
                        fontSize: '8px',
                        backgroundColor: '#212529',
                        color: '#fff',
                        border: '2px solid #0c7cff'
                      }}
                    >
                      <p className="m-0">{link.name}</p>
                      <p className="m-0 text-gray-300">{link.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="nes-btn is-warning"
                style={{ fontSize: '10px' }}
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Vertical Inventory */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 mx-4">
          <div 
            className="nes-container is-dark p-4"
            style={{ 
              backgroundColor: '#212529',
              border: '4px solid #0c7cff',
              boxShadow: '0 0 20px rgba(12, 124, 255, 0.3)'
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nes-btn is-primary text-center p-3 hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ 
                    fontSize: '8px',
                    minHeight: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <link.icon size={16} />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
