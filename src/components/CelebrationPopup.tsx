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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 400, 
                y: Math.random() * 400,
                scale: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                rotate: 360,
                y: [null, -50]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute w-3 h-3"
            >
              <Sparkles className="w-full h-full text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
            className="text-center mb-6"
          >
            {/* Show actor image if available, else dummy icon */}
            {actorImage ? (
              <img
                src={actorImage}
                alt={actorName}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-1 border-yellow-600"
                style={{ background: '#FFD600' }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-4 border-4 border-yellow-600">
                <span className="text-4xl font-bold text-white">🎭</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Celebration Time! 🎉</h2>
            <p className="text-lg font-semibold text-purple-600">
              {actorName} was selected!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border-2 border-purple-200"
          >
            <div className="text-center">
              <div className="text-gray-800 leading-relaxed">
                {typeof quote === 'string' && quote.trim() !== ''
                  ? quote.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line.includes(staffName) ? (
                          <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                            {line}
                          </span>
                        ) : (
                          line
                        )}
                      </p>
                    ))
                  : (
                      <p className="mb-2 last:mb-0 text-red-500">No quote available.</p>
                    )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Amazing! Continue
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CelebrationPopup;