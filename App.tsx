import React, { useState, useEffect } from 'react';
import ParticipantInput from './components/ParticipantInput';
import ParticipantList from './components/ParticipantList';
import WinnerModal from './components/WinnerModal';
import TrophyIcon from './components/icons/TrophyIcon';
import WelcomeScreen from './components/WelcomeScreen';
import SpinningWheel from './components/SpinningWheel';
import GithubIcon from './components/icons/GithubIcon';

const SPIN_DURATION_MS = 5500; // 5.5 seconds for a faster, more dynamic spin

const LUXURY_THEME = {
  accentClasses: {
    bg: 'bg-amber-500',
    hoverBg: 'hover:bg-amber-600',
    ring: 'focus:ring-amber-400',
    text: 'text-amber-400',
    border: 'border-amber-400',
  },
  wheelColors: ['#4299E1', '#FFFFFF', '#63B3ED', '#EDF2F7', '#9F7AEA', '#FFFFFF', '#ED64A6', '#EDF2F7'],
};

const LuxuryBackground: React.FC = () => (
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
        `}</style>
    </div>
);


const App: React.FC = () => {
  const [page, setPage] = useState<'welcome' | 'draw'>('welcome');
  const [participants, setParticipants] = useState<string[]>([]);
  // NEW STATE: Track win counts for fair distribution
  const [winCounts, setWinCounts] = useState<Map<string, number>>(new Map());
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (winner) {
      const winnerTimeout = setTimeout(() => {
        setShowWinnerModal(true);
      }, 500); // Small delay for the wheel to fully stop before modal appears
      return () => clearTimeout(winnerTimeout);
    }
  }, [winner]);

  // UPDATED: Now also updates the win counts state
  const addParticipants = (names: string[]) => {
    setParticipants(prevParticipants => {
      const newParticipants = names
        .map(name => name.trim())
        .filter(name => name && name.length <= 20)
        .filter(name => !prevParticipants.includes(name));

      if (newParticipants.length > 0) {
        setWinCounts(prevCounts => {
          const newMap = new Map(prevCounts);
          newParticipants.forEach(name => {
            // Initialize new participants with 0 wins
            if (!newMap.has(name)) {
                newMap.set(name, 0);
            }
          });
          return newMap;
        });
        return [...prevParticipants, ...newParticipants];
      }
      return prevParticipants;
    });
  };

  // UPDATED: Now also updates the win counts state
  const removeParticipant = (index: number) => {
     setParticipants(prev => {
      const participantToRemove = prev[index];
      if (participantToRemove) {
        setWinCounts(prevCounts => {
          const newMap = new Map(prevCounts);
          // Remove participant from win tracker
          newMap.delete(participantToRemove);
          return newMap;
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // UPDATED: The core logic for selecting a winner has been changed.
  const handleSpin = () => {
    if (participants.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    // =================================================================
    // == START: FAIR WINNER SELECTION LOGIC                          ==
    // This logic ensures a more even distribution of wins over time.
    // =================================================================

    // 1. Get current win counts for all participants.
    const participantWins = participants.map(p => winCounts.get(p) || 0);
    const maxWins = Math.max(0, ...participantWins);

    // 2. Assign a "weight" to each participant.
    // Participants with fewer wins get a higher weight, increasing their chance to win.
    const weights = participants.map((p, index) => {
      const wins = participantWins[index];
      // The '+ 1' ensures everyone always has a chance to win.
      return maxWins - wins + 1;
    });

    // 3. Perform a weighted random selection.
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    let newWinnerIndex = -1;
    for (let i = 0; i < participants.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        newWinnerIndex = i;
        break;
      }
    }

    // Fallback in case of floating point issues, though it's highly unlikely.
    if (newWinnerIndex === -1) {
      newWinnerIndex = participants.length - 1;
    }
    
    // =================================================================
    // == END: FAIR WINNER SELECTION LOGIC                            ==
    // =================================================================

    const winnerName = participants[newWinnerIndex];
    setWinnerIndex(newWinnerIndex);

    // The rest of this function handles the wheel's visual animation.
    const degreesPerSegment = 360 / participants.length;
    const winnerAngle = (newWinnerIndex * degreesPerSegment) + (degreesPerSegment / 2);

    const targetAngle = (270 - winnerAngle + 360) % 360;

    const currentFullRotations = Math.floor(rotation / 360);
    const newRotations = 5 + Math.random() * 5;

    const finalRotation = (currentFullRotations + newRotations) * 360 + targetAngle;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winnerName);

      // 4. After a winner is chosen, update their win count for the next round.
      setWinCounts(prev => {
        const newMap = new Map(prev);
        const currentWins = newMap.get(winnerName) || 0;
        newMap.set(winnerName, currentWins + 1);
        return newMap;
      });
    }, SPIN_DURATION_MS);
  };
  
  const handleStart = () => {
    setPage('draw');
  };

  if (page === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="relative min-h-screen text-white p-4 sm:p-8 flex flex-col items-center z-0">
      <LuxuryBackground />
      {showWinnerModal && winner && (
        <WinnerModal winner={winner} onClose={() => setShowWinnerModal(false)} accentClasses={LUXURY_THEME.accentClasses} />
      )}
      <header className="text-center mb-8 w-full max-w-7xl">
        <h1 className={`text-4xl sm:text-5xl font-bold flex items-center justify-center gap-3 ${LUXURY_THEME.accentClasses.text}`}>
          <TrophyIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          Lucky Draw
        </h1>
      </header>

      <main className="w-full max-w-7xl flex-grow flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col">
          <div className="bg-gradient-to-br from-amber-900/40 via-slate-800/60 to-slate-900/40 rounded-lg p-6 border border-amber-600/50 backdrop-blur-sm h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-4 text-amber-300 text-center" style={{ textShadow: '0 0 5px rgba(252, 165, 3, 0.3)' }}>
              Participants
            </h2>
            <ParticipantInput onAddParticipant={(name) => addParticipants([name])} isDisabled={isSpinning} />
            
            <div className="my-4">
                <label htmlFor="file-upload" className="w-full inline-block text-center bg-amber-800/80 text-amber-200 py-2 px-4 rounded-md cursor-pointer border border-amber-600/50 hover:bg-amber-700/80 transition disabled:opacity-50">
                    Upload Participants (.txt)
                </label>
                <input id="file-upload" type="file" className="hidden" accept=".txt" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const text = event.target?.result as string;
                            addParticipants(text.split('\n'));
                        };
                        reader.readAsText(file);
                        e.target.value = ''; // Reset file input
                    }
                }} disabled={isSpinning} />
            </div>

            <ParticipantList
              participants={participants}
              onRemoveParticipant={removeParticipant}
              isDrawing={isSpinning}
            />
          </div>
        </div>

        <div className="md:w-2/3 flex items-center justify-center">
          <SpinningWheel
            participants={participants}
            rotation={rotation}
            isSpinning={isSpinning}
            spinDuration={SPIN_DURATION_MS}
            onSpinClick={handleSpin}
            colors={LUXURY_THEME.wheelColors}
            winnerIndex={winnerIndex}
          />
        </div>
      </main>
      <footer className="text-slate-500 text-center text-sm pt-8 pb-4 z-10">
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

export default App;
