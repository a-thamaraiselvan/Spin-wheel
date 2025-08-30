import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SpinWheel from './SpinWheel';

interface Staff {
  id: number;
  name: string;
  department: string;
  favorite_thing_1: string;
  favorite_thing_2: string;
  favorite_thing_3: string;
  status: 'pending' | 'completed';
  spin_count: number;
}

const HallMode = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/staff`);
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const currentStaff = staff[currentIndex];

  const nextStaff = () => {
    if (currentIndex < staff.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSpinWheel(false);
    }
  };

  const prevStaff = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowSpinWheel(false);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  if (showSpinWheel && currentStaff) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-blue-600">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setShowSpinWheel(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Back to Queue
          </button>
        </div>
        <SpinWheel staffId={currentStaff.id.toString()} isHallMode={true} onComplete={nextStaff} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-white hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit Hall Mode
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">🎪 Hall Mode</h1>
            <p className="text-purple-200">Live Event Experience</p>
          </div>
          
          <button
            onClick={toggleFullScreen}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>

        {staff.length === 0 ? (
          <div className="text-center text-white">
            <Users className="w-16 h-16 mx-auto mb-4 text-purple-300" />
            <h2 className="text-2xl font-bold mb-2">No Staff Registered</h2>
            <p className="text-purple-200">Please register staff members first</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-2 mb-8">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / staff.length) * 100}%` }}
              ></div>
            </div>

            {/* Current Staff Display */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white mb-8"
            >
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h2 className="text-4xl font-bold mb-2">{currentStaff?.name}</h2>
              <p className="text-xl text-purple-200 mb-6">{currentStaff?.department}</p>
              
              <div className="mb-8">
                <p className="text-lg font-semibold mb-4">Favorite Things:</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {currentStaff && [currentStaff.favorite_thing_1, currentStaff.favorite_thing_2, currentStaff.favorite_thing_3].map((thing, index) => (
                    <span
                      key={index}
                      className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {thing}
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSpinWheel(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-12 py-4 rounded-full font-bold text-xl hover:from-yellow-300 hover:to-orange-300 transition-all flex items-center mx-auto"
              >
                <Play className="w-6 h-6 mr-2" />
                Start Spin Wheel
              </motion.button>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStaff}
                disabled={currentIndex === 0}
                className="flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <div className="text-white text-center">
                <p className="text-lg font-semibold">
                  {currentIndex + 1} of {staff.length}
                </p>
                <p className="text-purple-200 text-sm">Staff Members</p>
              </div>

              <button
                onClick={nextStaff}
                disabled={currentIndex === staff.length - 1}
                className="flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HallMode;