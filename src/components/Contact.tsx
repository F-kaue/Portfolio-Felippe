
import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado por entrar em contato. Responderei em breve.",
      });
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animateElements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    animateElements?.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      animateElements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="contact" className="relative py-20 bg-[#0c0c0c]" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Entre em <span className="gradient-text">Contato</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-blue mx-auto rounded-full"></div>
          <p className="animate-on-scroll text-gray-400 mt-6 max-w-lg mx-auto">
            Tem um projeto interessante ou uma oportunidade? Eu adoraria conversar!
            Preencha o formulário abaixo ou me encontre nas redes sociais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 animate-on-scroll">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-highlight-blue/10 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">E-mail</h3>
                  <a href="mailto:contato@felippegomes.dev" className="text-gray-400 hover:text-highlight-blue transition-colors">
                    contato@felippegomes.dev
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-highlight-green/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-highlight-green" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Telefone</h3>
                  <a href="tel:+5585999999999" className="text-gray-400 hover:text-highlight-green transition-colors">
                    +55 (85) 99999-9999
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-highlight-blue/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Localização</h3>
                  <p className="text-gray-400">
                    Fortaleza, Ceará, Brasil
                  </p>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="font-medium text-lg mb-3">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/felippegomes" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all duration-300"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/felippegomes" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all duration-300"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3 animate-on-scroll">
            <form 
              className="bg-white/5 rounded-lg p-6 border border-white/10"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nome
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg",
                      "bg-white/5 border border-white/10",
                      "text-white placeholder:text-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50"
                    )}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg",
                      "bg-white/5 border border-white/10",
                      "text-white placeholder:text-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50"
                    )}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Assunto
                </label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg",
                    "bg-white/5 border border-white/10",
                    "text-white placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50"
                  )}
                  placeholder="Assunto da mensagem"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensagem
                </label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg",
                    "bg-white/5 border border-white/10",
                    "text-white placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50",
                    "min-h-[150px] resize-y"
                  )}
                  placeholder="Sua mensagem aqui..."
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={cn(
                  "w-full md:w-auto px-6 py-3 rounded-lg",
                  "bg-gradient-to-r from-highlight-blue to-highlight-green",
                  "text-white font-medium",
                  "flex items-center justify-center gap-2",
                  "transition-all duration-300",
                  "hover:shadow-lg hover:shadow-highlight-blue/20",
                  "disabled:opacity-70 disabled:cursor-not-allowed"
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
