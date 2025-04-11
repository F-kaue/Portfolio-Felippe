
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  
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
    
    // Initialize particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
    particles.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? '#0ea5e9' : '#10b981',
      });
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle, index) => {
        // Move
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Draw
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        
        // Connect particles
        for (let j = index + 1; j < particles.current.length; j++) {
          const other = particles.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = 0.1 * (1 - distance / 150);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
        
        // React to mouse
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = dx / distance || 0;
          const directionY = dy / distance || 0;
          particle.speedX = particle.speedX - directionX * force * 0.02;
          particle.speedY = particle.speedY - directionY * force * 0.02;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationFrame = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
