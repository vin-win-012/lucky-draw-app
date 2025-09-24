import React from 'react';

export const ACCENT_COLORS = {
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500',
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-500',
};

export const WHEEL_PALETTES = {
  vibrant: ['#3b82f6', '#84cc16', '#f97316', '#d946ef', '#14b8a6', '#eab308', '#ef4444', '#6366f1'],
  pastel: ['#fecaca', '#fed7aa', '#fef08a', '#d9f99d', '#a7f3d0', '#a5f3fc', '#bfdbfe', '#e9d5ff'],
  ocean: ['#030712', '#075985', '#0ea5e9', '#67e8f9', '#f0f9ff', '#082f49', '#0c4a6e', '#0e7490'],
};

interface ColorCustomizerProps {
  currentAccent: string;
  onAccentChange: (color: string) => void;
  onWheelPaletteChange: (palette: string[]) => void;
}

const ColorSwatch: React.FC<{ color: string; isSelected: boolean; onClick: () => void }> = ({ color, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-full ${color} transition transform hover:scale-110 focus:outline-none ring-offset-2 ring-offset-slate-700 ${isSelected ? 'ring-2 ring-white' : ''}`}
    aria-label={`Select ${color} color`}
  />
);

const PaletteSwatch: React.FC<{ palette: string[]; isSelected: boolean; onClick: () => void }> = ({ palette, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`w-12 h-8 rounded-md flex overflow-hidden transition transform hover:scale-110 focus:outline-none ring-offset-2 ring-offset-slate-700 ${isSelected ? 'ring-2 ring-white' : ''}`}
      aria-label="Select color palette"
    >
        {palette.slice(0, 4).map(color => (
            <div key={color} style={{ backgroundColor: color }} className="w-1/4 h-full" />
        ))}
    </button>
);


const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ currentAccent, onAccentChange, onWheelPaletteChange }) => {
    // A bit of a hack to compare arrays for selection state
    const [selectedPalette, setSelectedPalette] = React.useState(WHEEL_PALETTES.vibrant);

    const handlePaletteChange = (palette: string[]) => {
        setSelectedPalette(palette);
        onWheelPaletteChange(palette);
    }
  return (
    <div className="mt-6 border-t border-slate-700 pt-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Accent Color</h3>
        <div className="flex gap-3">
          {Object.entries(ACCENT_COLORS).map(([name, className]) => (
            <ColorSwatch key={name} color={className} isSelected={currentAccent === name} onClick={() => onAccentChange(name)} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Wheel Palette</h3>
        <div className="flex gap-3">
            <PaletteSwatch palette={WHEEL_PALETTES.vibrant} isSelected={selectedPalette === WHEEL_PALETTES.vibrant} onClick={() => handlePaletteChange(WHEEL_PALETTES.vibrant)} />
            <PaletteSwatch palette={WHEEL_PALETTES.pastel} isSelected={selectedPalette === WHEEL_PALETTES.pastel} onClick={() => handlePaletteChange(WHEEL_PALETTES.pastel)} />
            <PaletteSwatch palette={WHEEL_PALETTES.ocean} isSelected={selectedPalette === WHEEL_PALETTES.ocean} onClick={() => handlePaletteChange(WHEEL_PALETTES.ocean)} />
        </div>
      </div>
    </div>
  );
};

export default ColorCustomizer;
