import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../services/speech/speechService';

export default function AudioGuide({ text, lang = 'en', style = {} }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleSpeak = () => {
    if (isPlaying) {
      speechService.stopSpeaking();
      setIsPlaying(false);
    } else {
      speechService.speakText(text, lang);
      setIsPlaying(true);
      const estimatedMs = Math.max(2000, text.length * 70);
      setTimeout(() => setIsPlaying(false), estimatedMs);
    }
  };

  return (
    <button
      onClick={handleToggleSpeak}
      className={`btn ${isPlaying ? 'btn-teal' : 'btn-secondary'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        fontSize: '0.85rem',
        borderRadius: '20px',
        border: isPlaying ? '1px solid #0d9488' : '1px solid #cbd5e1',
        cursor: 'pointer',
        ...style
      }}
      title="Play audio instruction for low-literacy users"
    >
      {isPlaying ? (
        <>
          <VolumeX size={16} className="animate-pulse" />
          <span>Stop Audio</span>
        </>
      ) : (
        <>
          <Volume2 size={16} style={{ color: '#0284c7' }} />
          <span>Listen Audio</span>
        </>
      )}
    </button>
  );
}
