import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsExports from '../../aws-exports'; // this file is created by Amplify
Amplify.configure(awsExports);

const client = generateClient();
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

document.addEventListener('DOMContentLoaded', () => {
  const recordButton = document.getElementById('record-btn');
  if (recordButton) {
    recordButton.addEventListener('click', () => {
      if (!isRecording) {
        startRecording(recordButton);
      } else {
        stopRecording(recordButton);
      }
    });
  }

  authenticateWithGoogle();
});

function authenticateWithGoogle() {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError || !token) {
      console.error('Failed to get auth token: ' + chrome.runtime.lastError);
      return;
    }

    // Use the token for API requests
    handleAuthSuccess(token);
  });
}

function handleAuthSuccess(token) {
  console.log('Google ID Token:', token);
  
  // Store the token for later use
  localStorage.setItem('google_id_token', token);
}

async function startRecording(buttonElement) {
  isRecording = true;
  buttonElement.textContent = 'Stop Recording';

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = []; // Clear previous audio chunks

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.start();
}

function stopRecording(buttonElement) {
  isRecording = false;
  buttonElement.textContent = 'Start Recording';
  
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
    audioChunks = [];  // Clear the chunks array for the next recording
    sendAudioToAPI(audioBlob);
  };
}

async function sendAudioToAPI(audioBlob) {
  const processVoice = `
    mutation ProcessVoice($convo: ConvoInput) {
      processVoice(convo: $convo) {
        id
        user_transcript
        gpt_response
      }
    }
  `;

  const audioBase64 = await blobToBase64(audioBlob);
  const token = localStorage.getItem('google_id_token');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const audioInput = {
    dateTime: new Date().toISOString(),
    timezone: timezone,
    id: token,
    messages: [audioBase64]
  };

  try {
    const result = await client.graphql({
      query: processVoice,
      variables: { convo: audioInput },
    });
    console.log('Audio uploaded successfully:', result);
  } catch (error) {
    console.error('Error uploading audio:', error);
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function() {
        // The result attribute contains the data as a base64 encoded string
        resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
