import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import CelebrationPopup from './CelebrationPopup';

const actors = [
  'Shah Rukh Khan', 'Salman Khan', 'Aamir Khan', 'Akshay Kumar', 'Hrithik Roshan',
  'Ranbir Kapoor', 'Ranveer Singh', 'Varun Dhawan', 'Tiger Shroff', 'Kartik Aaryan',
  'Amitabh Bachchan', 'Ajay Devgn', 'John Abraham', 'Arjun Kapoor', 'Sidharth Malhotra'
];

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
  
  // Fix the useTransform error by providing matching array lengths
  const scale = useTransform(rotation, [0, 180, 360], [1, 1.05, 1]);

  useEffect(() => {
    fetchStaffDetails();
  }, [staffId]);

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

  const handleSpin = async () => {
    if (isSpinning || !staff) return;

    setIsSpinning(true);
    setResult(null);
    setShowCelebration(false);

    // Random spin calculation
    const randomSpins = Math.floor(Math.random() * 5) + 5; // 5-10 full rotations
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = randomSpins * 360 + randomDegree;
    
    rotation.set(rotation.get() + totalRotation);

    // Calculate which actor was selected
    const segmentSize = 360 / actors.length;
    const normalizedDegree = (totalRotation % 360);
    const selectedIndex = Math.floor(normalizedDegree / segmentSize);
    const selectedActor = actors[selectedIndex];

    // Wait for spin animation to complete
    setTimeout(async () => {
      setIsSpinning(false);
      setResult(selectedActor);
      
      // Generate AI quote
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
            actorName: selectedActor,
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
            actorName: selectedActor,
            aiQuote: data.quote,
          }),
        });

        // Show celebration
        triggerConfetti();
        setShowCelebration(true);
      } catch (error) {
        console.error('Error generating quote:', error);
        setAiQuote(`Congratulations ${staff.name}! ${selectedActor} is celebrating with you today! 🎉`);
        setShowCelebration(true);
      }
    }, 3000);
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
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    if (isHallMode && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 500);
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
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
            </div>

            {/* Wheel */}
            <motion.div
              ref={wheelRef}
              style={{ 
                rotate: rotation,
                scale: scale
              }}
              transition={{
                type: "spring",
                damping: 0.7,
                stiffness: 0.1,
                duration: 3
              }}
              className="w-96 h-96 rounded-full relative cursor-grab active:cursor-grabbing shadow-2xl"
              drag={!isSpinning}
              onDrag={(event, info) => {
                if (!isSpinning) {
                  rotation.set(rotation.get() + info.delta.x * 2);
                }
              }}
              onDragEnd={(event, info) => {
                if (!isSpinning && Math.abs(info.velocity.x) > 100) {
                  handleSpin();
                }
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
                      className="w-full h-full flex items-start justify-center pt-4"
                      style={{
                        background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 70%, 45%))`,
                        clipPath: 'inherit'
                      }}
                    >
                      <span 
                        className="text-white font-bold text-xs text-center px-2 leading-tight drop-shadow-sm"
                        style={{ 
                          transform: `rotate(${180/actors.length}deg)`,
                          maxWidth: '80px'
                        }}
                      >
                        {actor}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Instructions */}
          <div className="text-center text-white mb-8">
            <p className="text-lg font-semibold mb-2">
              {isSpinning ? 'Spinning...' : 'Drag the wheel to spin!'}
            </p>
            <p className="text-purple-200">
              {isSpinning ? 'Finding your lucky actor...' : 'Drag left or right with your mouse or finger'}
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
          staffName={staff.name}
          onClose={handleCelebrationClose}
        />
      )}
    </div>
  );
};

export default SpinWheel;