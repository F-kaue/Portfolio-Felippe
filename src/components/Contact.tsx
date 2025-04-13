
import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  subject: z.string().min(3, { message: "Assunto deve ter pelo menos 3 caracteres" }),
  message: z.string().min(10, { message: "Mensagem deve ter pelo menos 10 caracteres" }),
});

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      message: "",
    },
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Format the message for WhatsApp
    const whatsappMessage = `*Nome:* ${values.name}%0A*Assunto:* ${values.subject}%0A*Mensagem:* ${values.message}`;
    
    // Create WhatsApp URL with the formatted message
    const whatsappUrl = `https://wa.me/5585992884178?text=${whatsappMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success toast
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será redirecionado para continuar a conversa no WhatsApp.",
    });
    
    // Reset form
    form.reset();
  };

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
            Preencha o formulário abaixo para me enviar uma mensagem pelo WhatsApp.
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
                  <a href="mailto:f_kaue@hotmail.com" className="text-gray-400 hover:text-highlight-blue transition-colors">
                    f_kaue@hotmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-highlight-green/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-highlight-green" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">WhatsApp</h3>
                  <a href="https://wa.me/5585992884178" className="text-gray-400 hover:text-highlight-green transition-colors">
                    +55 (85) 99288-4178
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
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome" 
                          className={cn(
                            "bg-white/5 border border-white/10",
                            "text-white placeholder:text-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50"
                          )}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Assunto</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Assunto da mensagem" 
                          className={cn(
                            "bg-white/5 border border-white/10",
                            "text-white placeholder:text-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50"
                          )}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Mensagem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Sua mensagem aqui..." 
                          className={cn(
                            "bg-white/5 border border-white/10",
                            "text-white placeholder:text-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-highlight-blue/50",
                            "min-h-[150px] resize-y"
                          )}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className={cn(
                    "w-full md:w-auto px-6 py-3",
                    "bg-gradient-to-r from-highlight-blue to-highlight-green",
                    "text-white font-medium",
                    "flex items-center justify-center gap-2",
                    "transition-all duration-300",
                    "hover:shadow-lg hover:shadow-highlight-blue/20"
                  )}
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
