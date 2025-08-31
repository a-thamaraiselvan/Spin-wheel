import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import CelebrationPopup from './CelebrationPopup';
import MGR from '../assets/M G R.jpg';
import GeminiGanesan from '../assets/Gemini Ganesan.png';
import jaishankar from '../assets/jaishankar.png';
import sivajiganesan from '../assets/sivaji ganesan.jpg';
import Jayalalithaa from '../assets/J. Jayalalithaa.jpg';
import Lalitha from '../assets/Lalitha-c.jpg';
import SarojaDevi from '../assets/B. Saroja Devi.jpg';
import Vijaya from '../assets/KR_Vijaya.jpg';
import Nambiar from '../assets/M. N. Nambiar.jpeg';
import MahanatiSavitri from '../assets/mahanati-savitri.jpg';
import SA from '../assets/S. A..jpeg';
import SSR from '../assets/SSR.png';
import Sivakumar from '../assets/Sivakumar.png';
import RSManohar from '../assets/R. S. Manohar.jpeg';
import PadminiRamachandran from '../assets/Padmini_Ramachandran.jpg';
import Ragini from '../assets/Ragini-closeup-2.jpg';
import TRMahali from '../assets/T. R. Mahali..jpeg';
import muthuraman from '../assets/muthuraman.jpg'

const actors = [
  "J.Jayalalithaa",
  "Lalitha C",
  "B. Saroja Devi",
  "Gemini Ganesan",
  "Jaishankar",
  "KR.Vijaya",
  "M G R",
  "M.N.Nambiar",
  "Mahanati Savitri",
  "muthuraman",
  "Padmini Ramachandran",
  "R.S.Manohar",
  "Ragini",
  "S.A",
  "Sivaji ganesan",
  "Sivakumar",
  "SSR",
  "T.R.Mahali"
];

// Actor image mapping (put images in public/actors/ with these filenames)
const actorImages: Record<string, string> = {
  'M G R': MGR,
  'B. Saroja Devi' : SarojaDevi,
  'Gemini Ganesan': GeminiGanesan,
  'Jaishankar': jaishankar,
  'Sivaji Ganesan': sivajiganesan,
  'J.Jayalalithaa': Jayalalithaa,
  'Lalitha C': Lalitha,
  'KR.Vijaya': Vijaya,
  'M.N.Nambiar': Nambiar,
  'Mahanati Savitri': MahanatiSavitri,
  'S.A': SA,
  'T.R.Mahali': TRMahali,
  'SSR': SSR,
  'Sivakumar': Sivakumar,
  'R.S.Manohar': RSManohar,
  'Padmini Ramachandran' : PadminiRamachandran,
  'Ragini':Ragini,
  'muthuraman' : muthuraman
};

interface SpinWheelProps {
  staffId?: string;
  isHallMode?: boolean;
  onComplete?: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ staffId: propStaffId, isHallMode = false, onComplete }) => {
  const { staffId: paramStaffId } = useParams();
  const staffId = propStaffId || paramStaffId;
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [aiQuote, setAiQuote] = useState('');
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const dragHistory = useRef<{angle: number, time: number}[]>([]);
  const animationControls = useRef<any>(null);
  
  const scale = useTransform(rotation, [0, 180, 360], [1, 1.05, 1]);

  useEffect(() => {
    fetchStaffDetails();
  }, [staffId]);

const playSpinSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Wind-like spinning sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    gainNode1.connect(filter);
    gainNode2.connect(filter);
    filter.connect(audioContext.destination);
    
    // Two oscillators for richer sound
    oscillator1.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 3.0);
    oscillator1.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 8.0);
    oscillator1.type = 'sawtooth';
    
    oscillator2.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 3.0);
    oscillator2.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 8.0);
    oscillator2.type = 'triangle';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 8.0);
    
    gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode1.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
    gainNode1.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 8.0);
    
    gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode2.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.2);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 8.0);
    
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 8.0);
    oscillator2.stop(audioContext.currentTime + 8.0);
  } catch (error) {
    console.log('Audio context not available');
  }
};

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Victory fanfare
      const frequencies = [523.25, 659.25, 783.99]; // C, E, G major chord
      frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.0);
      });
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const fetchStaffDetails = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/staff`);
      const allStaff = await response.json();
      const currentStaff = allStaff.find((s: any) => s.id === parseInt(staffId as string));
      setStaff(currentStaff);
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  // Fixed function to determine the winning actor based on pointer position
  const getWinningActor = (finalRotation: number): string => {
    // Normalize rotation to 0-360 degrees
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    
    // Calculate segment size
    const segmentSize = 360 / actors.length;
    
    // The pointer points to the top (0 degrees), so we need to find which segment
    // is at the top after rotation. Since the wheel rotates clockwise, we need to
    // account for the direction.
    const pointerAngle = (360 - normalizedRotation) % 360;
    
    // Find which segment the pointer is in
    const segmentIndex = Math.floor(pointerAngle / segmentSize);
    
    // Make sure the index is within bounds
    const winningIndex = segmentIndex % actors.length;
    
    return actors[winningIndex];
  };

  const calculateDragVelocity = () => {
    const now = Date.now();
    // Keep only recent drag history (last 100ms)
    dragHistory.current = dragHistory.current.filter(entry => now - entry.time < 100);
    
    if (dragHistory.current.length < 2) return 0;
    
    const oldest = dragHistory.current[0];
    const newest = dragHistory.current[dragHistory.current.length - 1];
    const timeDiff = newest.time - oldest.time;
    const angleDiff = newest.angle - oldest.angle;
    
    return timeDiff > 0 ? angleDiff / timeDiff : 0;
  };

  const handleSpin = async () => {
    if (isSpinning || !staff) return;

    // Stop any existing animation
    if (animationControls.current) {
      animationControls.current.stop();
    }

    setIsSpinning(true);
    setResult(null);
    setShowCelebration(false);

    // Play spinning sound
    playSpinSound();

    // Generate random spin parameters
    const baseSpins = Math.floor(Math.random() * 4) + 4; // 4-7 full rotations
    const randomAngle = Math.random() * 360; // Random final position
    
    // Calculate total rotation
    const currentRotation = rotation.get();
    const totalRotation = baseSpins * 360 + randomAngle;
    const finalRotation = currentRotation + totalRotation;
    
    // Pre-calculate the winning actor based on final position
    const winningActor = getWinningActor(finalRotation);
    
    // Animate the wheel to the final position
    animationControls.current = animate(rotation, finalRotation, {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 8.0, // Reduced from 5.0 for faster animation
      onComplete: async () => {
        setIsSpinning(false);
        setResult(winningActor);

        // Play success sound immediately
        playSuccessSound();

        // Trigger confetti immediately
        triggerConfetti();

        // Show popup instantly with a default congratulatory message
        setAiQuote(`🎉 Congratulations ${staff.name}! ${winningActor} is celebrating with you today! 🎉`);
        setShowCelebration(true);

        // Generate AI quote in background
        try {
          const favoriteThings = [staff.favorite_thing_1, staff.favorite_thing_2, staff.favorite_thing_3];
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
          const response = await fetch(`${backendUrl}/api/generate-quote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              staffName: staff.name,
              department: staff.department,
              favoriteThings,
              actorName: winningActor,
            }),
          });
          const data = await response.json();
          setAiQuote(data.quote);

          // Save result to database
          await fetch(`${backendUrl}/api/spin/result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              staffId: staff.id,
              actorName: winningActor,
              aiQuote: data.quote,
            }),
          });
        } catch (error) {
          console.error('Error generating quote:', error);
          // Already showing default message, no need to update again
        }
      }
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 150);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 300);
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    if (isHallMode && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 300); // Reduced delay
    }
  };

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading staff details...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-blue-600 p-4 ${isHallMode ? 'fixed inset-0' : ''}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {!isHallMode && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold">Spin the Wheel!</h1>
              <p className="text-purple-200">For Professor {staff.name}</p>
            </div>
            
            <div className="w-24"></div>
          </div>
        )}

        {/* Wheel Container */}
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            {/* Pointer - Fixed at top center */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20">
              <div 
                className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
                  transform: 'rotate(180deg)'
                }}
              ></div>
            </div>

            {/* Wheel */}
            <motion.div
              ref={wheelRef}
              style={{ 
                rotate: rotation,
                scale: scale
              }}
              className="w-[400px] h-[400px] rounded-full relative overflow-hidden shadow-2xl cursor-pointer select-none border-0 border-yellow-400"
              drag={!isSpinning}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0}
              onDrag={(event, info) => {
                if (!isSpinning) {
                  const now = Date.now();
                  const deltaRotation = info.delta.x * 1;
                  rotation.set(rotation.get() + deltaRotation);
                  
                  // Track drag history for velocity calculation
                  dragHistory.current.push({
                    angle: rotation.get(),
                    time: now
                  });
                  
                  // Keep only recent history
                  if (dragHistory.current.length > 10) {
                    dragHistory.current = dragHistory.current.slice(-5);
                  }
                }
              }}
              onDragEnd={(event, info) => {
                if (!isSpinning) {
                  // Check if drag was fast enough to trigger auto-spin
                  const velocity = Math.abs(info.velocity.x);
                  if (velocity > 50) {
                    handleSpin();
                  }
                }
                // Clear drag history
                dragHistory.current = [];
              }}
            >
              {actors.map((actor, index) => {
                const angle = (360 / actors.length) * index;
                const hue = (360 / actors.length) * index;
                
                return (
                  <div
                    key={actor}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.sin((360/actors.length) * Math.PI/180) * 50}% ${50 - Math.cos((360/actors.length) * Math.PI/180) * 50}%)`
                    }}
                  >
                    <div
                      className="w-full h-full relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 70%, 45%))`,
                        clipPath: 'inherit'
                      }}
                    >
                      <div
                        className="absolute text-white font-bold text-xs flex items-center justify-center"
                        style={{
                          left: '0%',
                          top: '0%',
                          // transform: `translateX(-50%) rotate(${(360/actors.length)/2}deg)`,
                          transform: `translateX(64%) rotate(-75deg)`,
                          // transformOrigin: '50% 190px',
                          width: '200px',
                          height: '120px',
                          textAlign: 'center',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          lineHeight: '1.1',
                          fontSize: '15px',
                          fontWeight: '600',
                          padding: '2px 4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <span style={{ 
                          display: 'block',
                          transform: 'scale(0.9)',
                          maxWidth: '100%'
                        }}>
                          {actor}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Instructions */}
          <div className="text-center text-white mb-8">
            <p className="text-lg font-semibold mb-2">
              {isSpinning ? 'Spinning...' : 'Drag the wheel or click spin!'}
            </p>
            <p className="text-purple-200">
              {isSpinning ? 'Finding your lucky actor...' : 'Drag the wheel in clock direction or use the button below'}
            </p>
          </div>

          {/* Manual Spin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-yellow-500 text-yellow-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center shadow-lg"
          >
            <RotateCw className={`w-6 h-6 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : 'Spin Now!'}
          </motion.button>

          {/* Staff Info */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Spinning for:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-purple-200 text-sm">Professor</p>
                <p className="text-lg font-semibold">{staff.name}</p>
              </div>
              <div>
                <p className="text-purple-200 text-sm">Department</p>
                <p className="text-lg font-semibold">{staff.department}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-purple-200 text-sm mb-2">Favorite Things</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[staff.favorite_thing_1, staff.favorite_thing_2, staff.favorite_thing_3].map((thing, index) => (
                  <span
                    key={index}
                    className="bg-white/20 px-3 py-1 rounded-full text-sm"
                  >
                    {thing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Popup */}
      {showCelebration && (
        <CelebrationPopup
          quote={aiQuote}
          actorName={result || ''}
          actorImage={result ? actorImages[result] : ''}
          staffName={staff.name}
          onClose={handleCelebrationClose}
        />
      )}
    </div>
  );
};

export default SpinWheel;