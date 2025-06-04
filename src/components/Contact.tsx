
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="section-padding bg-background/50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Entre em Contato
          </h2>
          <p className="animate-on-scroll delay-200 text-gray-400 max-w-2xl mx-auto">
            Vamos conversar sobre seu próximo projeto? Estou sempre aberto a novas oportunidades e colaborações.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="animate-on-scroll delay-300">
            <h3 className="text-2xl font-bold mb-6 text-white">Informações de Contato</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-highlight-blue/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-highlight-blue" />
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <a href="mailto:contato@felippegomes.dev" className="text-white hover:text-highlight-blue transition-colors">
                    contato@felippegomes.dev
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-highlight-green/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-highlight-green" />
                </div>
                <div>
                  <p className="text-gray-400">Telefone</p>
                  <a href="tel:+5511999999999" className="text-white hover:text-highlight-green transition-colors">
                    +55 (11) 99999-9999
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400">Localização</p>
                  <p className="text-white">São Paulo, Brasil</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/F-kaue" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/felippe-kau%C3%AA-7165782b6/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="animate-on-scroll delay-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-highlight-blue focus:outline-none text-white placeholder-gray-400"
                  placeholder="Seu nome"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-highlight-blue focus:outline-none text-white placeholder-gray-400"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-highlight-blue focus:outline-none text-white placeholder-gray-400 resize-none"
                  placeholder="Sua mensagem aqui..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className={cn(
                  "w-full bg-gradient-to-r from-highlight-blue to-highlight-green",
                  "text-white px-8 py-3 rounded-lg font-medium",
                  "hover:shadow-lg hover:shadow-highlight-blue/25",
                  "transition-all duration-300 flex items-center justify-center space-x-2",
                  "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50"
                )}
              >
                <Send className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
