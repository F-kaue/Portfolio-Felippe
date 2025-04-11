import React, { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  color: string;
}

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const skills: Skill[] = [
    { name: 'Python', level: 90, category: 'backend', color: '#3776AB' },
    { name: 'Java', level: 85, category: 'backend', color: '#f89820' },
    { name: 'JavaScript', level: 80, category: 'frontend', color: '#F7DF1E' },
    { name: 'React', level: 75, category: 'frontend', color: '#61DAFB' },
    { name: 'HTML/CSS', level: 85, category: 'frontend', color: '#E34F26' },
    { name: 'SQL', level: 80, category: 'backend', color: '#4479A1' },
    { name: 'Git', level: 85, category: 'tools', color: '#F05032' },
    { name: 'Spring Boot', level: 75, category: 'backend', color: '#6DB33F' },
  ];

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'tools', name: 'Ferramentas' },
  ];

  const [activeCategory, setActiveCategory] = React.useState('all');
  const [visibleSkills, setVisibleSkills] = React.useState<Skill[]>(skills);

  useEffect(() => {
    if (activeCategory === 'all') {
      setVisibleSkills(skills);
    } else {
      setVisibleSkills(skills.filter(skill => skill.category === activeCategory));
    }
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Start progress bar animation when visible
            setTimeout(() => {
              const progressBars = sectionRef.current?.querySelectorAll('.skill-progress');
              progressBars?.forEach((bar) => {
                const width = bar.getAttribute('data-width');
                if (width) {
                  (bar as HTMLElement).style.width = `${width}%`;
                }
              });
            }, 300);
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
  }, [visibleSkills]);

  return (
    <section id="skills" className="relative py-20 bg-background" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
            Minhas <span className="gradient-text">Habilidades</span>
          </h2>
          <div className="animate-on-scroll w-20 h-1 bg-highlight-green mx-auto rounded-full"></div>
        </div>
        
        <div className="flex justify-center mb-12 animate-on-scroll">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  activeCategory === category.id 
                    ? 'bg-highlight-blue text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-on-scroll">
          {visibleSkills.map((skill, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-lg">{skill.name}</span>
                <span className="text-sm text-gray-400">{skill.level}%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="skill-progress h-full rounded-full transition-all duration-1000 ease-out"
                  data-width={skill.level}
                  style={{ 
                    width: "0%", 
                    backgroundColor: skill.color,
                    boxShadow: `0 0 10px ${skill.color}80`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
