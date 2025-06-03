import React, { useEffect, useRef } from 'react';

interface FloatingElement {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'triangle' | 'square';
  color: string;
  opacity: number;
  pulsePhase: number;
}

const FloatingElements: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<FloatingElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
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

    // Initialize floating elements
    const elementCount = 15;
    const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
    const types: Array<'circle' | 'triangle' | 'square'> = ['circle', 'triangle', 'square'];

    elementsRef.current = Array.from({ length: elementCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.1,
      pulsePhase: Math.random() * Math.PI * 2
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const drawShape = (element: FloatingElement) => {
      ctx.save();
      ctx.translate(element.x, element.y);
      ctx.rotate(element.rotation);
      
      const pulse = Math.sin(element.pulsePhase) * 0.3 + 1;
      const currentSize = element.size * pulse;
      
      ctx.globalAlpha = element.opacity;
      
      // Draw glow
      ctx.shadowColor = element.color;
      ctx.shadowBlur = 20;
      
      switch (element.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = element.color;
          ctx.fill();
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -currentSize);
          ctx.lineTo(-currentSize * 0.866, currentSize * 0.5);
          ctx.lineTo(currentSize * 0.866, currentSize * 0.5);
          ctx.closePath();
          ctx.fillStyle = element.color;
          ctx.fill();
          break;
          
        case 'square':
          ctx.fillStyle = element.color;
          ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);
          break;
      }
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      elementsRef.current.forEach((element) => {
        // Update position
        element.x += element.speedX;
        element.y += element.speedY;
        element.rotation += element.rotationSpeed;
        element.pulsePhase += 0.05;

        // Bounce off edges
        if (element.x <= 0 || element.x >= canvas.width) {
          element.speedX *= -1;
        }
        if (element.y <= 0 || element.y >= canvas.height) {
          element.speedY *= -1;
        }

        // Keep within bounds
        element.x = Math.max(0, Math.min(canvas.width, element.x));
        element.y = Math.max(0, Math.min(canvas.height, element.y));

        // Mouse interaction
        const dx = mouseRef.current.x - element.x;
        const dy = mouseRef.current.y - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          element.speedX += (dx / distance) * force * 0.001;
          element.speedY += (dy / distance) * force * 0.001;
          element.opacity = Math.min(0.8, element.opacity + force * 0.01);
          element.rotationSpeed += force * 0.001;
        } else {
          element.opacity = Math.max(0.1, element.opacity - 0.005);
          element.rotationSpeed *= 0.98;
        }

        // Apply friction
        element.speedX *= 0.99;
        element.speedY *= 0.99;

        drawShape(element);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-5 opacity-70"
      style={{ background: 'transparent' }}
    />
  );
};

export default FloatingElements;
