'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

/* ── CONFIG ARRAY — edit src/poster here ── */
const videos = [
  { src: '/VIDEO1.mp4', poster: '', title: 'Distro365 — Premium Product Showcase' },
  { src: '/VIDEO2.mp4', poster: '', title: 'High Performance Tank & Vape Demo' },
  { src: '/VIDEO3.mp4', poster: '', title: 'Flavor Delivery & Cloud Performance' },
];

export default function VideoCarousel() {
  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % videos.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + videos.length) % videos.length);
  }, []);

  // When a video finishes playing, advance to the next video automatically
  const handleVideoEnded = (endedIndex: number) => {
    if (endedIndex === current) {
      next();
    }
  };

  // Play current active video from start, pause others
  useEffect(() => {
    videoRefs.current.forEach((videoEl, i) => {
      if (!videoEl) return;
      if (i === current) {
        videoEl.currentTime = 0;
        videoEl.muted = isMuted;
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }, [current, isMuted]);

  const toggleAudio = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      const currentVideo = videoRefs.current[current];
      if (currentVideo) {
        currentVideo.muted = nextMuted;
      }
      return nextMuted;
    });
  };

  return (
    <section className="bg-pink-gradient py-14 lg:py-24 text-white overflow-hidden" id="video-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Featured Video Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            See Distro365 In Action
          </h2>
          <p className="mt-2 text-white/80 text-sm sm:text-base">
            Auto-advancing on video completion • 16:9 HD landscape orientation
          </p>
        </div>

        {/* Full-width Video Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-white/20 shadow-2xl aspect-video">
            {videos.map((video, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={video.src}
                  poster={video.poster || undefined}
                  className="w-full h-full object-contain bg-black"
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={() => handleVideoEnded(i)}
                />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-10">
                  <div>
                    <span className="text-[11px] font-bold text-[var(--pink)] uppercase tracking-wider">
                      Video {i + 1} of {videos.length}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">{video.title}</h3>
                  </div>

                  {/* Mute / Unmute Button */}
                  <button
                    onClick={toggleAudio}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <span>{isMuted ? '🔇 Muted' : '🔊 Sound On'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Left / Right Arrow Navigation */}
          <button
            onClick={prev}
            className="absolute left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-[var(--pink)] transition-colors shadow-2xl z-20"
            aria-label="Previous video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-[var(--pink)] transition-colors shadow-2xl z-20"
            aria-label="Next video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to video ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
