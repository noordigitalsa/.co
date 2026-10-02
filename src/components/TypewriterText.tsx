import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 1800,
  className = '',
  cursorClassName = ''
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex % phrases.length];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    } else {
      if (text.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span>{text}</span>
      <span
        aria-hidden="true"
        className={`inline-block w-[2px] h-[1em] ml-1 bg-blue-500 animate-pulse align-middle ${cursorClassName}`}
      />
    </span>
  );
};
