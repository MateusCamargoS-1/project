import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Subtitles } from 'lucide-react';

interface VideoPlayerProps {
  movieId: number;
  streamUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieId, streamUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioTrack, setAudioTrack] = useState('eng');
  const [controlsVisible, setControlsVisible] = useState(true);

  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const hideControls = () => {
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    const showControls = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      hideControls();
    };

    window.addEventListener('mousemove', showControls);

    hideControls();

    return () => {
      window.removeEventListener('mousemove', showControls);
      clearTimeout(timeout);
    };
  }, [controlsVisible]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`movie-${movieId}-progress`);
    if (savedProgress) {
      setProgress(parseFloat(savedProgress));
    }
  }, [movieId]);

  const handleProgress = ({ played }: { played: number }) => {
    setProgress(played);
    localStorage.setItem(`movie-${movieId}-progress`, played.toString());
  };

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);

  return (
    <div className="relative w-full aspect-video bg-black">
      <ReactPlayer
        url={streamUrl}
        width="100%"
        height="100vh"
        playing={playing}
        volume={volume}
        muted={muted}
        progressInterval={1000}
        onProgress={handleProgress}
      />

      {controlsVisible && (
        <div className="absolute inset-0 flex justify-center items-center p-4">
          <div className="absolute flex items-center justify-center gap-6 bg-black/60 p-4 rounded-full">
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
                onChange={(e) => setVolume(parseFloat(e.target.value))}
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
                  onChange={(e) => setAudioTrack(e.target.value)}
                  className="bg-transparent text-white border border-white/20 rounded px-2 py-1"
                >
                  <option value="eng">English</option>
                  <option value="por">Portuguese</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="w-full bg-gray-600 h-1 rounded-full">
          <div
            className="bg-red-600 h-full rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
