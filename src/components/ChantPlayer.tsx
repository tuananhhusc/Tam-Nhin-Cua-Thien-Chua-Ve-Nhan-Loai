"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ChantPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15); // Default volume 15%
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync volume state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Browsers restrict autoplay, but user-initiated play works 100%
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
        });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/20 transition-all duration-300 hover:border-gold/50 group">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      >
        <source src="https://upload.wikimedia.org/wikipedia/commons/transcoded/e/ea/De_Angelis_-_Kyrie.ogg/De_Angelis_-_Kyrie.ogg.mp3" type="audio/mpeg" />
        <source src="https://upload.wikimedia.org/wikipedia/commons/e/ea/De_Angelis_-_Kyrie.ogg" type="audio/ogg" />
      </audio>

      {/* Mini Visualizer (only active when playing) */}
      <div className="flex items-center gap-0.5 h-3.5 w-4 cursor-pointer" onClick={togglePlay}>
        <span
          className={`w-0.5 bg-gold rounded-full transition-all ${
            isPlaying ? "animate-[bounce_0.8s_infinite_0.1s] h-3.5" : "h-1.5"
          }`}
        />
        <span
          className={`w-0.5 bg-gold rounded-full transition-all ${
            isPlaying ? "animate-[bounce_0.8s_infinite_0.3s] h-2" : "h-2.5"
          }`}
        />
        <span
          className={`w-0.5 bg-gold rounded-full transition-all ${
            isPlaying ? "animate-[bounce_0.8s_infinite_0.2s] h-3" : "h-1"
          }`}
        />
        <span
          className={`w-0.5 bg-gold rounded-full transition-all ${
            isPlaying ? "animate-[bounce_0.8s_infinite_0.4s] h-1.5" : "h-2"
          }`}
        />
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="text-white dark:text-charcoal hover:text-gold dark:hover:text-gold transition-colors focus:outline-none"
        title={isPlaying ? "Tạm dừng nhạc nền" : "Phát nhạc nền bình ca"}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? (
          // Pause Icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="4" height="16" rx="1" />
            <rect x="16" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play Icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Volume Slider - expands on hover */}
      <div className="hidden md:flex items-center gap-1.5 w-0 opacity-0 overflow-hidden group-hover:w-20 group-hover:opacity-100 transition-all duration-300 ease-out">
        {/* Speaker Icon */}
        <span className="text-white/70 dark:text-charcoal/70">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </span>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-14 h-1 bg-white/20 dark:bg-black/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
          style={{
            background: `linear-gradient(to right, var(--gold) ${volume * 200}%, rgba(255,255,255,0.2) ${volume * 200}%)`,
          }}
          title="Âm lượng nhạc nền"
          aria-label="Volume slider"
        />
      </div>
    </div>
  );
}
