
import React, { useState, useEffect } from 'react';

const CONFETTI_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
}

const createConfettiPiece = (id: number): ConfettiPiece => {
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  return {
    id,
    style: {
      position: 'absolute',
      width: `${Math.random() * 8 + 6}px`,
      height: `${Math.random() * 8 + 6}px`,
      backgroundColor: color,
      top: `${Math.random() * -200 - 50}px`,
      left: `${Math.random() * 100}%`,
      opacity: 1,
      transform: `rotate(${Math.random() * 360}deg)`,
      animation: `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`,
    },
  };
};

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 150 }, (_, i) => createConfettiPiece(i));
    setPieces(newPieces);

    const keyframes = `
      @keyframes fall {
        to {
          transform: translateY(120vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
      {pieces.map(({ id, style }) => (
        <div key={id} style={style} />
      ))}
    </div>
  );
};

export default Confetti;
