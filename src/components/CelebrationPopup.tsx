import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { MdRotateRight } from "react-icons/md"; // Example for Material Design icon

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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-[1300px] h-[600px] relative overflow-hidden shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 rounded-3xl"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(35)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 1600, 
                y: Math.random() * 600,
                scale: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                rotate: 360,
                y: [null, -80]
              }}
              transition={{
                duration: 4,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 5
              }}
              className="absolute w-8 h-8"
            >
              <Sparkles className="w-full h-full text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-10 h-10" />
        </button>

        {/* Main Content Container */}
        <div className="relative z-10 h-full flex">
          
          {/* Left Section - Actor Image and Celebration Title */}
          <div className="w-[500px] flex flex-col items-center justify-center p-8 border-r-4 border-purple-200">
            <motion.div
              initial={{ scale: 0, x: -100 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="text-center"
            >
              {/* Actor Image */}
              {actorImage ? (
                <img
                  src={actorImage}
                  alt={actorName}
                  className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-6 border-yellow-600 shadow-xl"
                  style={{ background: '#FFD600' }}
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-6 border-6 border-yellow-600 shadow-xl">
                  <span className="text-7xl">🎭</span>
                </div>
              )}
              
              {/* Celebration Title */}
              <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                🎉 Celebration Time! 🎉
              </h2>
              
              {/* Actor Name */}
              <p className="text-3xl font-semibold text-purple-600 leading-tight mb-2">
                {actorName}
              </p>
              <p className="text-2xl font-medium text-purple-500">
                was selected!
              </p>
            </motion.div>
          </div>

          {/* Right Section - Quote Content */}
          <div className="flex-1 p-5 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="h-[400px] bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-200 shadow-lg p-8 flex items-center"
            >
              <div className="w-full">
                <div className="text-gray-800 leading-relaxed text-2xl">
                  {typeof quote === 'string' && quote.trim() !== ''
                    ? quote.split('\n').map((line, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {line.includes(staffName) ? (
                            <span className="font-bold text-purple-700  px-3 py-1 rounded-lg text-2xl">
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
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        >
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-lg shadow-xl"
          >
            Amazing! Continue
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CelebrationPopup;