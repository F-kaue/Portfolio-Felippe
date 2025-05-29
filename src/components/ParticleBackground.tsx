
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles with improved distribution
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? Math.min(Math.floor(window.innerWidth / 15), 40) : Math.min(Math.floor(window.innerWidth / 12), 80);
    particles.current = [];
    
    const colors = ['#0ea5e9', '#10b981', '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899'];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.5;
      const maxLife = Math.random() * 200 + 100;
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        life: Math.random() * maxLife,
        maxLife: maxLife,
      });
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosition.current.x = e.touches[0].clientX;
        mousePosition.current.y = e.touches[0].clientY;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Enhanced animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.02)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle, index) => {
        // Update life cycle
        particle.life += 1;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.opacity = Math.random() * 0.5 + 0.2;
        }
        
        // Breathing effect based on life cycle
        const lifeRatio = particle.life / particle.maxLife;
        const breathe = Math.sin(lifeRatio * Math.PI) * 0.3 + 0.7;
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Smooth edge wrapping
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        
        // Enhanced mouse interaction
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = isMobile ? 100 : 150;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = dx / distance || 0;
          const directionY = dy / distance || 0;
          
          // Gentle attraction/repulsion
          particle.speedX += directionX * force * 0.01;
          particle.speedY += directionY * force * 0.01;
          
          // Enhanced particle opacity near mouse
          particle.opacity = Math.min(0.8, particle.opacity + force * 0.3);
        } else {
          // Return to normal opacity
          particle.opacity = Math.max(0.2, particle.opacity - 0.01);
        }
        
        // Apply friction to prevent excessive speed
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;
        
        // Draw particle with glow effect
        const currentSize = particle.size * breathe;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 3
        );
        glowGradient.addColorStop(0, particle.color + '20');
        glowGradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        // Main particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.round(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Inner highlight
        ctx.beginPath();
        ctx.arc(particle.x - currentSize * 0.3, particle.y - currentSize * 0.3, currentSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff' + Math.round(particle.opacity * 100).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Enhanced connection lines
        for (let j = index + 1; j < particles.current.length; j++) {
          const other = particles.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxConnectionDistance = isMobile ? 80 : 120;
          
          if (distance < maxConnectionDistance) {
            const alpha = (1 - distance / maxConnectionDistance) * Math.min(particle.opacity, other.opacity) * 0.4;
            
            // Create gradient line
            const lineGradient = ctx.createLinearGradient(
              particle.x, particle.y,
              other.x, other.y
            );
            lineGradient.addColorStop(0, particle.color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
            lineGradient.addColorStop(1, other.color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
            
            ctx.beginPath();
            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = alpha * 2;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            
            // Add shimmer effect on strong connections
            if (distance < maxConnectionDistance * 0.6) {
              const shimmer = Math.sin(Date.now() * 0.005 + distance * 0.1) * 0.5 + 0.5;
              ctx.beginPath();
              ctx.strokeStyle = '#ffffff' + Math.round(alpha * shimmer * 100).toString(16).padStart(2, '0');
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleBackground;
