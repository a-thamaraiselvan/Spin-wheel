import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface CelebrationPopupProps {
  quote: string;
  actorName: string;
  actorImage: string;
  staffName: string;
  onClose: () => void;
}

const CelebrationPopup: React.FC<CelebrationPopupProps> = ({
  quote,
  actorName,
  actorImage,
  staffName,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 400,
          duration: 0.3
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-[1300px] h-[600px] relative overflow-hidden shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 rounded-3xl"></div>
        
        {/* Optimized Floating Sparkles - Reduced count and simplified animations */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 100 + (i * 100) % 1200,
                y: 50 + (i * 50) % 500,
                scale: 0,
                rotate: 0
              }}
              animate={{
                scale: [0, 1, 0.8, 0],
                rotate: 180,
                y: "-=60"
              }}
              transition={{
                duration: 2,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeOut"
              }}
              className="absolute w-6 h-6"
            >
              <Sparkles className="w-full h-full text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-150 z-50"
        >
          <X className="w-10 h-10" />
        </motion.button>

        {/* Main Content Container */}
        <div className="relative z-10 h-full flex">
          
          {/* Left Section - Actor Image and Celebration Title */}
          <div className="w-[500px] flex flex-col items-center justify-center p-8 border-r-4 border-purple-200">
            <motion.div
              initial={{ scale: 0.8, x: -50, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 1 }}
              transition={{ 
                delay: 0.1, 
                type: "spring", 
                damping: 20,
                stiffness: 300,
                duration: 0.4
              }}
              className="text-center"
            >
              {/* Actor Image */}
              {actorImage ? (
                <motion.img
                  initial={{ scale: 0.7, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  src={actorImage}
                  alt={actorName}
                  className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-6 border-yellow-600 shadow-xl"
                  style={{ background: '#FFD600' }}
                />
              ) : (
                <motion.div
                  initial={{ scale: 0.7, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-48 h-48 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-6 border-6 border-yellow-600 shadow-xl"
                >
                  <span className="text-7xl">🎭</span>
                </motion.div>
              )}
              
              {/* Celebration Title */}
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="text-4xl font-bold text-gray-800 mb-4 leading-tight"
              >
                🎉 Celebration Time! 🎉
              </motion.h2>
              
              {/* Actor Name */}
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-3xl font-semibold text-purple-600 leading-tight mb-2"
              >
                {actorName}
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="text-2xl font-medium text-purple-500"
              >
                was selected!
              </motion.p>
            </motion.div>
          </div>

          {/* Right Section - Quote Content */}
          <div className="flex-1 p-5 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.4,
                ease: "easeOut"
              }}
              className="h-[400px] bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-200 shadow-lg p-8 flex items-center"
            >
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-gray-800 leading-relaxed text-2xl"
                >
                  {typeof quote === 'string' && quote.trim() !== ''
                    ? quote.split('\n').map((line, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {line.includes(staffName) ? (
                            <span className="font-bold text-purple-700 px-3 py-1 rounded-lg text-2xl">
                              {line}
                            </span>
                          ) : (
                            line
                          )}
                        </p>
                      ))
                    : (
                        <p className="mb-4 last:mb-0 text-red-500 text-2xl">No quote available.</p>
                      )}
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className='text-3xl font-bold text-center mt-5 text-purple-600'
                >
                  🌸Advance Happy Teacher's Day!🎉🌸
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Button */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: 0.4, 
            duration: 0.3,
            type: "spring",
            damping: 20
          }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        >
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-lg shadow-xl hover:scale-105 active:scale-95"
          >
            Amazing! Continue
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CelebrationPopup;