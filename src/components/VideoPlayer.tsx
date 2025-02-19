import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Subtitles,
  Fullscreen,
} from "lucide-react";

interface VideoPlayerProps {
  movieId: number;
  streamUrl: string;
  coverImage: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  movieId,
  streamUrl,
  coverImage,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<videojs.Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioTrack, setAudioTrack] = useState<string>("eng");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCoverImage, setShowCoverImage] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    if (playerRef.current) return;

    const vjsPlayer = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      fluid: true,
      sources: [
        {
          src: streamUrl,
          type: "application/x-mpegURL",
        },
      ],
    });

    vjsPlayer.on("canplay", () => {
      setLoading(false);
    });

    vjsPlayer.on("loadedmetadata", () => {
      const savedProgress = localStorage.getItem(`movie-${movieId}-progress`);
      if (savedProgress) {
        vjsPlayer.currentTime(parseFloat(savedProgress));
      }
    });

    playerRef.current = vjsPlayer;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamUrl, movieId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onTimeUpdate = () => {
      const currentTime = player.currentTime();
      setProgress(currentTime);
      localStorage.setItem(`movie-${movieId}-progress`, currentTime.toString());
    };

    player.on("timeupdate", onTimeUpdate);

    return () => {
      player.off("timeupdate", onTimeUpdate);
    };
  }, [movieId]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (player.paused()) {
      player.play();
      setPlaying(true);
      setShowCoverImage(false);
      setLoading(false);
    } else {
      player.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    player.muted(!muted);
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    if (!isFullscreen) {
      player.requestFullscreen();
      setIsFullscreen(true);
    } else {
      player.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleAudioTrackChange = (trackId: string) => {
    const player = playerRef.current;
    if (!player) return;
    const audioTracks = player.audioTracks();

    for (let i = 0; i < audioTracks.length; i++) {
      const track = audioTracks[i];
      track.enabled = track.id === trackId;
    }

    setAudioTrack(trackId);
  };

  const player = playerRef.current;

  return (
    <div className="relative w-full max-w-full bg-black">
      {showCoverImage && (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <img
            src={coverImage}
            alt="Movie Cover"
            className="absolute top-0 left-0 right-0 w-full h-full object-cover opacity-80"
          />
        </div>
      )}

      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-auto"
      ></video>

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-30 bg-black/50">
          <div className="animate-spin border-t-4 border-b-4 border-white border-solid rounded-full w-16 h-16"></div>
        </div>
      )}

      <div className="absolute inset-0 flex justify-center items-center p-4 z-20">
        <div className="absolute flex items-center justify-center gap-6 bg-black/60 p-4 rounded-full w-4/5">
          <button
            onClick={togglePlay}
            className="text-white hover:text-gray-300 transition"
          >
            {playing ? <Pause size={36} /> : <Play size={36} />}
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-gray-300 transition"
          >
            {muted ? <VolumeX size={36} /> : <Volume2 size={36} />}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                player?.volume(newVolume);
              }}
              className="w-32"
            />
          </div>

          <div className="relative group">
            <button className="text-white hover:text-gray-300 transition">
              <Subtitles size={36} />
            </button>
            <div className="absolute bottom-full left-0 hidden group-hover:block bg-black/90 p-2 rounded">
              <select
                value={audioTrack}
                onChange={(e) => handleAudioTrackChange(e.target.value)}
                className="bg-transparent text-white border border-white/20 rounded px-2 py-1"
              >
                <option value="eng">English</option>
                <option value="por">Portuguese</option>
              </select>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 transition"
          >
            <Fullscreen size={36} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
        <div className="relative w-full bg-gray-600 h-1 rounded-full cursor-pointer">
          <div
            className="bg-red-600 h-full rounded-full"
            style={{ width: `${(progress / (player?.duration() || 1)) * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={player?.duration() || 1}
            step={0.1}
            value={progress}
            onChange={(e) => player?.currentTime(parseFloat(e.target.value))}
            className="absolute top-0 w-full h-1 bg-transparent cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
