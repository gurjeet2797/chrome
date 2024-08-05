chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Refresh the auth token periodically
setInterval(() => {
  chrome.identity.getAuthToken({ interactive: false }, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return;
    }
    if (token) {
      console.log('Auth token refreshed');
    }
  });
}, 45 * 60 * 1000); // Refresh every 45 minutes

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processAudio') {
    console.log('Processing audio:', request.audioData);
    
    // Simulate API call
    setTimeout(() => {
      sendResponse({ 
        success: true, 
        message: 'Audio processed successfully',
        transcription: 'This is a simulated transcription of the audio.'
      });
    }, 1000);

    return true; // Indicates that the response is sent asynchronously
  }
});