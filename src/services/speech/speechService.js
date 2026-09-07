// Speech-to-Text (ASR) & Text-to-Speech (TTS) Provider-Independent Service Layer
// Supports browser Web Speech API & Indian Language speech service abstraction (e.g., Bhashini / AI4Bharat)

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  speakText(text, langCode = 'en') {
    if (!this.synth) return;
    
    // Stop any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language code
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN'
    };

    utterance.lang = langMap[langCode] || 'en-IN';
    utterance.rate = 0.9; // Slightly slower for clinical clarity & low-literacy users
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  startListening(langCode = 'en', onResult, onError, onEnd) {
    if (!this.recognition) {
      // Fallback for browsers without speech recognition
      console.warn("SpeechRecognition API not available in browser. Operating in simulated voice mode.");
      this.isListening = true;
      return false;
    }

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN'
    };

    this.recognition.lang = langMap[langCode] || 'en-IN';

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
