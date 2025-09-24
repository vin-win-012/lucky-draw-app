import React from 'react';

interface SpinningWheelProps {
  participants: string[];
  rotation: number;
  isSpinning: boolean;
  spinDuration: number;
  onSpinClick: () => void;
  colors: string[];
  winnerIndex: number | null;
}

const getCoordinatesForPercent = (percent: number, radius: number = 1) => {
  const x = radius * Math.cos(2 * Math.PI * percent);
  const y = radius * Math.sin(2 * Math.PI * percent);
  return [x, y];
};

const getContrastColor = (hex: string) => {
  if (!hex || hex.length < 4) return '#000000';
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    return '#000000';
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};


const SpinningWheel: React.FC<SpinningWheelProps> = ({ participants, rotation, isSpinning, spinDuration, onSpinClick, colors, winnerIndex }) => {
  const segmentCount = participants.length;
  const segmentPercent = segmentCount > 0 ? 1 / segmentCount : 1;
  
  const longestNameLength = React.useMemo(() => 
    participants.reduce((max, name) => Math.max(max, name.length), 0),
  [participants]);
  
  let calculatedFontSize = 0.15; // default max size
  if (segmentCount > 0 && longestNameLength > 0) {
      // Heuristic based on the available arc space at the text's radius (0.75)
      // The formula is derived from: fontSize < (arc_length) / (text_length * avg_char_width_ratio)
      // (2 * PI * 0.75) / (segmentCount * longestNameLength * 0.6)
      calculatedFontSize = 7.85 / (segmentCount * longestNameLength);
  }
  // Clamp the font size to reasonable min/max values
  const fontSize = Math.max(0.04, Math.min(0.15, calculatedFontSize));

  return (
    <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
      <div
        className="relative w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${isSpinning ? spinDuration / 1000 : 0}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }}
      >
        <div className="absolute inset-0 shadow-2xl rounded-full">
            <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full">
            <defs>
              <linearGradient id="gold-rim" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            
            {/* Shadow/Depth Effect */}
            <circle r="1.17" fill="#000000" opacity="0.25"/>
            
            {/* Gold Accent Rim */}
            <circle r="1.12" fill="none" stroke="url(#gold-rim)" strokeWidth="0.08" />

            {/* Segments */}
            {participants.map((participant, i) => {
                const segmentRadius = 1.08;
                const [startX, startY] = getCoordinatesForPercent(i * segmentPercent, segmentRadius);
                const [endX, endY] = getCoordinatesForPercent((i + 1) * segmentPercent, segmentRadius);
                const largeArcFlag = segmentPercent > 0.5 ? 1 : 0;
                const pathData = `M ${startX} ${startY} A ${segmentRadius} ${segmentRadius} 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
                
                const textAngle = (i + 0.5) * segmentPercent * 360;
                const segmentColor = colors[i % colors.length];
                const textColor = getContrastColor(segmentColor);
                
                const isWinner = winnerIndex === i;
                const highlightActive = !isSpinning && winnerIndex !== null;
                const segmentOpacity = highlightActive && !isWinner ? 0.4 : 1;

                return (
                <g 
                    key={i} 
                    style={{ 
                        opacity: segmentOpacity, 
                        transition: 'opacity 0.5s ease-out' 
                    }}
                >
                    <path d={pathData} fill={segmentColor} />
                    <g transform={`rotate(${textAngle})`}>
                    <text
                        x="0.75"
                        y="0"
                        fill={textColor}
                        fontSize={fontSize}
                        fontWeight="500"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
                    >
                        {participant}
                    </text>
                    </g>
                </g>
                );
            })}

            {/* Segment Lines */}
            {segmentCount > 1 && participants.map((_, i) => {
                const segmentRadius = 1.08;
                const [endX, endY] = getCoordinatesForPercent((i + 1) * segmentPercent, segmentRadius);
                return <path key={`line-${i}`} d={`M 0 0 L ${endX} ${endY}`} stroke="#BDBDBD" strokeWidth="0.01" opacity="0.5"/>
            })}

            </svg>
        </div>
      </div>

      {/* Spin Button Hub */}
      <div className="absolute w-[30%] h-[30%] z-10 flex items-center justify-center">
         <button
            onClick={onSpinClick}
            disabled={isSpinning || participants.length < 2}
            className="w-[90%] h-[90%] rounded-full text-white font-black text-3xl sm:text-4xl
                    transform transition hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed
                    flex items-center justify-center z-10"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
        >
            <div className="absolute w-full h-full rounded-full bg-[#1E40AF] border-2 border-[#FBBF24] shadow-inner" />
            <span className="relative">SPIN</span>
        </button>
      </div>
    </div>
  );
};

export default SpinningWheel;