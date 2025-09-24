import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';

interface ParticipantInputProps {
  onAddParticipant: (name: string) => void;
  isDisabled: boolean;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({ onAddParticipant, isDisabled }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddParticipant(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter participant name"
        disabled={isDisabled}
        maxLength={20}
        className="flex-grow bg-slate-700/80 text-white rounded-md px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isDisabled || !name.trim()}
        className="bg-amber-600 text-white p-2 rounded-md hover:bg-amber-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center shrink-0 w-10 h-10"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default ParticipantInput;
