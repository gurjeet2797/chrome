import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import RecordButton from '../components/RecordButton';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = () => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message);
        return;
      }
      
      fetchUserInfo(token);
    });
  };

  const fetchUserInfo = (token) => {
    fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => setError(error.message));
  };

  const handleRecord = () => {
    console.log('Start recording');
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const handleStop = () => {
    console.log('Stop recording');
    setIsRecording(false);
    // Implement actual stop recording and transcription logic here
    setTranscription('This is a simulated transcription.');
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Calendar</h1>
      <p className="mb-4">Welcome, {user.name}!</p>
      <div>
        <RecordButton onRecord={handleRecord} onStop={handleStop} isRecording={isRecording} />
        {transcription && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Transcription:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));