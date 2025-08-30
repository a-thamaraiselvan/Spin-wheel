import { useMotionValue, useTransform } from 'framer-motion';
import { useState, useCallback } from 'react';

export const useWheel = (segments: string[]) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const rotation = useMotionValue(0);
  // Fix the useTransform error by providing matching array lengths
  const scale = useTransform(rotation, [0, 180, 360], [1, 1.1, 1]);

  const spin = useCallback(async () => {
    if (isSpinning) return null;

    setIsSpinning(true);
    setResult(null);

    // Generate random spin
    const randomSpins = Math.floor(Math.random() * 5) + 5; // 5-10 full rotations
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = randomSpins * 360 + randomDegree;
    
    rotation.set(rotation.get() + totalRotation);

    // Calculate result
    const segmentSize = 360 / segments.length;
    const normalizedDegree = (totalRotation % 360);
    const selectedIndex = Math.floor(normalizedDegree / segmentSize);
    const selectedSegment = segments[selectedIndex];

    // Wait for animation to complete
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        setIsSpinning(false);
        setResult(selectedSegment);
        resolve(selectedSegment);
      }, 3000);
    });
  }, [isSpinning, rotation, segments]);

  const handleDrag = useCallback((info: any) => {
    if (!isSpinning) {
      rotation.set(rotation.get() + info.delta.x * 2);
    }
  }, [isSpinning, rotation]);

  const handleDragEnd = useCallback((info: any) => {
    if (!isSpinning && Math.abs(info.velocity.x) > 100) {
      spin();
    }
  }, [isSpinning, spin]);

  return {
    rotation,
    scale,
    isSpinning,
    result,
    spin,
    handleDrag,
    handleDragEnd,
  };
};