
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const ProgrammerAvatar: React.FC = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Carregar a animação do LottieFiles
    fetch('https://lottie.host/cfyejZCKW7-programmer.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => {
        console.log('Erro ao carregar animação Lottie:', error);
        // Fallback para um placeholder simples
        setAnimationData({
          v: "5.7.4",
          fr: 60,
          ip: 0,
          op: 180,
          w: 400,
          h: 400,
          nm: "Programmer",
          ddd: 0,
          assets: [],
          layers: []
        });
      });
  }, []);

  if (!animationData) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-highlight-blue/20 to-highlight-green/20 rounded-full flex items-center justify-center">
        <div className="text-6xl">👨‍💻</div>
      </div>
    );
  }

  return (
    <Lottie 
      animationData={animationData}
      loop={true}
      className="w-full h-full"
      style={{
        filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.3))'
      }}
    />
  );
};

export default ProgrammerAvatar;
