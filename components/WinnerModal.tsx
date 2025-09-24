import React from 'react';
import Confetti from './Confetti';
import TrophyIcon from './icons/TrophyIcon';

interface WinnerModalProps {
  winner: string;
  onClose: () => void;
  accentClasses: {
    bg: string;
    hoverBg: string;
    ring: string;
    text: string;
    border: string;
  }
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose, accentClasses }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 backdrop-blur-sm">
      <Confetti />
      <div className={`relative bg-slate-800 border-2 rounded-2xl shadow-2xl p-8 m-4 text-center transform scale-100 transition-transform duration-300 animate-reveal ${accentClasses.border}`}>
        <style>{`
          @keyframes reveal {
            from { opacity: 0; transform: scale(0.7); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <TrophyIcon className={`w-24 h-24 mx-auto animate-pulse ${accentClasses.text}`} />
        <h2 className="text-2xl text-slate-300 font-light mt-4">Congratulations to</h2>
        <h1 className={`text-5xl md:text-6xl font-bold my-4 break-words ${accentClasses.text}`}>
          {winner}
        </h1>
        <p className="text-2xl font-semibold text-white">You are the winner!</p>
        <button
          onClick={onClose}
          className={`mt-8 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${accentClasses.bg} ${accentClasses.hoverBg} ${accentClasses.ring}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
