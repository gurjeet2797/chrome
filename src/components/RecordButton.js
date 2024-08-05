import React, {useState} from 'react';
import { motion } from 'framer-motion';

const RecordButton = ({ onRecord, onStop, isRecording }) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      var audioChunks = [];
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
        if(recorder.state === "inactive"){
          const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
          sendAudioToAPI(audioBlob);
        }
      };
      recorder.onstop = () => setIsRecording(false);
      recorder.start();
      setMediaRecorder(recorder);
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setIsRecording(false);
  };

  const sendAudioToBackend = async (audioData) => {
    try {
      const formData = new FormData();
      const blob = new Blob([audioData], { type: 'audio/webm' });
      formData.append('file', blob);

      const response = await fetch('http://127.0.0.1:8001/process_voice', { //connection to backend
        method: 'POST',
        mode: 'cors',
        body: formData,
      });
    
    if (response) {
      const result = await response.json();
      setChatHistory([{ user: result.user_transcript, response: result.gpt_response }]);
      console.log("Audio sent successfully:");
      } else {
      console.log("Failed to send audio:", response.status, response.statusText);
      }
    } catch (error) {
      console.error('BACKEND IS BROKEN:', error);
  }
};

function audioBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = function() {
          // The result attribute contains the data as a base64 encoded string
          resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
};

const sendAudioToAPI = async (audioData) => {
  try {
    const stringBlob = await audioBlobToBase64(audioData);
    const response = await fetchItems(stringBlob);
  if (response) {
    const result = response.data.processVoice;
    console.log(result)
    const user_transcript = result.user_transcript;
    const gpt_response = result.gpt_response;
    console.log(result);
    setChatHistory([{ user: result.user_transcript, response: result.gpt_response }]);
    console.log("Audio sent successfully:");
    } else {
    console.log("Failed to send audio:", response.status, response.statusText);
    }
  } catch (error) {
    console.error('BACKEND IS BROKEN:', error);
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