
import React, { useEffect, useRef } from 'react';

interface SnakeSegment {
  x: number;
  y: number;
}

const SnakeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<SnakeSegment[]>([]);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

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

    // Initialize snake
    const segmentCount = 20;
    const segmentSize = 8;
    const speed = 2;

    // Create initial snake segments
    snakeRef.current = Array.from({ length: segmentCount }, (_, i) => ({
      x: 100 + i * segmentSize,
      y: canvas.height / 2
    }));

    const animate = () => {
      timeRef.current += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update snake movement with sine wave pattern
      const head = snakeRef.current[0];
      const newHead = {
        x: head.x + speed,
        y: canvas.height / 2 + Math.sin(timeRef.current) * 100
      };

      // Wrap around screen edges
      if (newHead.x > canvas.width + segmentSize * segmentCount) {
        newHead.x = -segmentSize * segmentCount;
      }

      // Update snake segments (follow the leader)
      snakeRef.current.unshift(newHead);
      snakeRef.current.pop();

      // Smooth following movement
      for (let i = 1; i < snakeRef.current.length; i++) {
        const current = snakeRef.current[i];
        const target = snakeRef.current[i - 1];
        
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > segmentSize) {
          const ratio = segmentSize / distance;
          current.x = target.x - dx * ratio;
          current.y = target.y - dy * ratio;
        }
      }

      // Draw snake with gradient and glow effect
      snakeRef.current.forEach((segment, index) => {
        const alpha = (snakeRef.current.length - index) / snakeRef.current.length;
        const size = segmentSize * (0.5 + alpha * 0.5);
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, size * 2, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(
          segment.x, segment.y, 0,
          segment.x, segment.y, size * 2
        );
        glowGradient.addColorStop(0, `rgba(16, 185, 129, ${alpha * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw main segment
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          segment.x - size * 0.3, segment.y - size * 0.3, 0,
          segment.x, segment.y, size
        );
        
        if (index === 0) {
          // Head - special color
          gradient.addColorStop(0, `rgba(14, 165, 233, ${alpha})`);
          gradient.addColorStop(1, `rgba(16, 185, 129, ${alpha * 0.8})`);
        } else {
          // Body segments
          gradient.addColorStop(0, `rgba(16, 185, 129, ${alpha})`);
          gradient.addColorStop(1, `rgba(6, 78, 59, ${alpha * 0.6})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add shine effect
        ctx.beginPath();
        ctx.arc(segment.x - size * 0.3, segment.y - size * 0.3, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 opacity-60"
      style={{ background: 'transparent' }}
    />
  );
};

export default SnakeAnimation;
