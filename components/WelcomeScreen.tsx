import React from 'react';
import GithubIcon from './icons/GithubIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen text-white p-4 flex flex-col items-center justify-center text-center overflow-hidden z-0">
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#2a0808] via-[#4d0f0f] to-[#1c0101] overflow-hidden -z-10">
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
                backgroundImage: `
                radial-gradient(circle at 15% 25%, rgba(253, 224, 71, 0.08), transparent 40%),
                radial-gradient(circle at 85% 75%, rgba(253, 224, 71, 0.08), transparent 40%)
                `
            }}
        />
        <div 
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
            style={{
                backgroundImage: `
                repeating-conic-gradient(from 0deg, rgba(253, 224, 71, 0.05) 0deg 2deg, transparent 2deg 20deg)
                `,
                animation: 'spin 120s linear infinite',
            }}
        />
        <style>{`
            @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes fade-in-down {
                from { opacity: 0; transform: translateY(-30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
      </div>

      <main className="flex flex-col items-center justify-center flex-grow z-10">
        <h1 
          className="text-7xl md:text-9xl font-black tracking-wider text-amber-300 animate-[fade-in-down_1s_ease-out_forwards] font-serif"
          style={{ textShadow: '0 0 15px rgba(253, 224, 71, 0.4), 0 0 30px rgba(252, 165, 3, 0.3)' }}
        >
          WELCOME
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300/90 max-w-lg animate-[fade-in-up_1s_ease-out_0.5s_forwards] opacity-0">
          The wheel of fortune is waiting. Who will be the lucky one today?
        </p>
        <button
          onClick={onStart}
          className={`mt-12 bg-transparent font-bold py-3 px-10 rounded-lg text-xl border-2 border-amber-400 text-amber-300
                     transition-all duration-300 transform hover:scale-105 hover:text-white hover:bg-amber-500/20
                     focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75
                     animate-[fade-in-up_1s_ease-out_1s_forwards] opacity-0`}
        >
          Enter
        </button>
      </main>
      
      <footer className="text-slate-500 text-center text-sm pb-4 z-10">
        <a 
          href="https://github.com/vin-win-012/lucky-draw-app.git" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
        >
          <GithubIcon className="w-4 h-4" />
          <span>Created by Vinay</span>
        </a>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
