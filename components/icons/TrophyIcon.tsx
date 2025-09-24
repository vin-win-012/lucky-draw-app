
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21A3.48 3.48 0 0 1 9 19.88V22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21A3.48 3.48 0 0 0 15 19.88V22" />
    <path d="M9 4h6" />
    <path d="M12 4v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4Z" />
    <path d="M12 4v8a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4Z" />
  </svg>
);

export default TrophyIcon;
