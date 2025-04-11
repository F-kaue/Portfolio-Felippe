
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 1000,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping && !isDeleting) {
      if (displayedText.length < texts[textIndex].length) {
        timeout = setTimeout(() => {
          setDisplayedText(texts[textIndex].substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenTexts);
      }
    } else if (isDeleting) {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayedText, textIndex, isTyping, isDeleting, texts, typingSpeed, deletingSpeed, delayBetweenTexts]);
  
  return (
    <div className="inline-block">
      <span className="mr-1">{displayedText}</span>
      <span className="animate-cursor-blink">|</span>
    </div>
  );
};

export default TypingAnimation;
