
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import Offers from '@/components/Offers';
import SuccessCases from '@/components/SuccessCases';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';
import NetworkBackground from '@/components/NetworkBackground';
import ParticleField from '@/components/ParticleField';
import SnakeAnimation from '@/components/SnakeAnimation';
import FloatingElements from '@/components/FloatingElements';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmartChat from '@/components/SmartChat';
import HeartbeatMonitor from '@/components/HeartbeatMonitor';
import heartbeat from '@/utils/supabaseHeartbeat';

const Index = () => {
  useEffect(() => {
    // Initialize intersection observer for scroll animations
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
    
    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => {
      observer.observe(el);
    });

    // Iniciar sistema de heartbeat do Supabase
    console.log('🚀 Iniciando sistema de heartbeat do Supabase...');
    heartbeat.start();
    
    return () => {
      animateElements.forEach((el) => {
        observer.unobserve(el);
      });
      // Parar heartbeat ao desmontar componente
      heartbeat.stop();
    };
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <NetworkBackground />
      <ParticleField />
      <FloatingElements />
      <SnakeAnimation />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Stats />
        <SuccessCases />
        <Testimonials />
        <Experience />
        <Offers />
        <FAQ />
        <Contact />
        {/* Monitor de Heartbeat - Remover em produção se não desejar */}
        {import.meta.env.DEV && (
          <section className="section-container">
            <HeartbeatMonitor />
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
      <SmartChat />
    </div>
  );
};

export default Index;
