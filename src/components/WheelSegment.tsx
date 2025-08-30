import React from 'react';

interface WheelSegmentProps {
  actor: string;
  index: number;
  totalSegments: number;
}

const WheelSegment: React.FC<WheelSegmentProps> = ({ actor, index, totalSegments }) => {
  const angle = (360 / totalSegments) * index;
  const hue = (360 / totalSegments) * index;
  
  return (
    <div
      className="absolute w-full h-full"
      style={{
        transform: `rotate(${angle}deg)`,
        clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.sin((360/totalSegments) * Math.PI/180) * 50}% ${50 - Math.cos((360/totalSegments) * Math.PI/180) * 50}%)`
      }}
    >
      <div
        className="w-full h-full flex items-start justify-center pt-4"
        style={{
          background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 70%, 45%))`,
          clipPath: 'inherit'
        }}
      >
        <span 
          className="text-white font-bold text-xs text-center px-2 leading-tight drop-shadow-sm"
          style={{ 
            transform: `rotate(${180/totalSegments}deg)`,
            maxWidth: '80px'
          }}
        >
          {actor}
        </span>
      </div>
    </div>
  );
};

export default WheelSegment;