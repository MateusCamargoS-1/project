import React, { useEffect, useRef, useState } from "react";
import { ThumbsUp, Plus, Check } from "lucide-react";

interface VideoPlayerProps {
  streamUrl: string;
  coverImage: string;
  title: string;
  matchPercentage: number;
  overview: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamUrl,
  coverImage,
  title,
  matchPercentage,
  overview,
}) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const progressSaveThrottleRef = useRef<NodeJS.Timeout>();

  const saveVideoProgress = () => {
    if (playerRef.current) {
      if (progressSaveThrottleRef.current) {
        clearTimeout(progressSaveThrottleRef.current);
      }

      progressSaveThrottleRef.current = setTimeout(() => {
        const currentTime = playerRef.current?.currentTime || 0;
        const duration = playerRef.current?.duration || 0;
        
        const progressData = {
          currentTime,
          duration,
          timestamp: Date.now(),
        };
        
        localStorage.setItem(
          `videoProgress_${streamUrl}`,
          JSON.stringify(progressData)
        );
      }, 1000);
    }
  };

  const loadVideoProgress = () => {
    try {
      const savedProgressString = localStorage.getItem(`videoProgress_${streamUrl}`);
      if (savedProgressString && playerRef.current) {
        const savedProgress = JSON.parse(savedProgressString);
        
        const isProgressValid = Date.now() - savedProgress.timestamp < 7 * 24 * 60 * 60 * 1000;
        
        if (isProgressValid) {
          const isNearEnd = savedProgress.duration - savedProgress.currentTime <= 30;
          
          if (isNearEnd) {
            playerRef.current.currentTime = 0;
          } else {
            playerRef.current.currentTime = savedProgress.currentTime;
          }
        }
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
      localStorage.removeItem(`videoProgress_${streamUrl}`);
    }
  };

  useEffect(() => {
    const videoElement = playerRef.current;
    if (videoElement) {
      const handleMetadata = () => {
        loadVideoProgress();
        videoElement.removeEventListener('loadedmetadata', handleMetadata);
      };
      videoElement.addEventListener('loadedmetadata', handleMetadata);
    }

    return () => {
      if (progressSaveThrottleRef.current) {
        clearTimeout(progressSaveThrottleRef.current);
      }
    };
  }, [streamUrl]);

  useEffect(() => {
    const videoElement = playerRef.current;

    if (videoElement) {
      videoElement.addEventListener("timeupdate", saveVideoProgress);
      
      const handleBeforeUnload = () => {
        if (progressSaveThrottleRef.current) {
          clearTimeout(progressSaveThrottleRef.current);
        }
        saveVideoProgress();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        videoElement.removeEventListener("timeupdate", saveVideoProgress);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [streamUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full bg-black rounded-lg shadow-lg overflow-hidden mb-6">
        <video
          ref={playerRef}
          className="relative w-full aspect-video bg-black"
          poster={coverImage}
          controls
          crossOrigin="anonymous"
          src={streamUrl}
          preload="metadata"
          style={{
            borderRadius: "8px",
          }}
        />
      </div>

      <div className="px-4" style={{paddingBottom: "20px"}}>
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <span className="text-green-500 font-semibold">
            {matchPercentage}% Match
          </span>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isLiked
                ? "bg-white text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            <ThumbsUp size={20} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            onClick={() => setIsInList(!isInList)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isInList
                ? "bg-white text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isInList ? <Check size={20} /> : <Plus size={20} />}
            {isInList ? "In My List" : "Add to My List"}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
          <p className="text-gray-300 leading-relaxed">{overview}</p>
        </div>
      </div>
    </div>
  );
};