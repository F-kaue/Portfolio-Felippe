
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

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
    
    return () => {
      animateElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
