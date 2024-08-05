import React from 'react';
import { motion } from 'framer-motion';

const RecordButton = ({ onRecord, onStop, isRecording }) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onRecord();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-16 h-16 rounded-full flex items-center justify-center focus:outline-none ${
        isRecording ? 'bg-red-500' : 'bg-blue-500'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isRecording ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3a1 1 0 00-1 1v12a1 1 0 002 0V4a1 1 0 00-1-1z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      )}
    </motion.button>
  );
};

export default RecordButton;