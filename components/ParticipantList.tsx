import React from 'react';
import TrashIcon from './icons/TrashIcon';

interface ParticipantListProps {
  participants: string[];
  onRemoveParticipant: (index: number) => void;
  isDrawing: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onRemoveParticipant, isDrawing }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 mt-4 h-64 md:h-auto md:flex-1 overflow-y-auto border border-slate-700">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
      {participants.length === 0 ? (
        <p className="text-slate-400 text-center py-4">No participants yet. Add some!</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((participant, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-slate-700/80 p-2 rounded-md animate-fade-in transition-colors hover:bg-slate-700"
            >
              <span className="text-white break-all pr-2">{participant}</span>
              <button
                onClick={() => onRemoveParticipant(index)}
                disabled={isDrawing}
                className="text-red-400 hover:text-red-500 disabled:text-slate-500 disabled:cursor-not-allowed transition p-1 ml-2 shrink-0"
                aria-label={`Remove ${participant}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParticipantList;
