import React, { useState } from "react";
import ReactPlayer from "react-player";
import { ThumbsUp, Plus, Check } from "lucide-react";

interface VideoPlayerProps {
  streamUrl: string;
  coverImage: string;
  title: string;
  matchPercentage: number;
  overview: string;
  subtitles?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamUrl,
  coverImage,
  title,
  matchPercentage,
  overview,
  subtitles,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [language, setLanguage] = useState<string>("en");
  const [videoUrl, setVideoUrl] = useState<string>(streamUrl);

  const changeAudioLanguage = (lang: string) => {
    setLanguage(lang);
    setVideoUrl(`${streamUrl}?lang=${lang}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full bg-black rounded-lg shadow-lg overflow-hidden mb-6">
        <ReactPlayer
          url={videoUrl}
          playing
          controls
          width="100%"
          height="100%"
          light={ < img  src = {coverImage} /> }
          style={{
            borderRadius: "8px",
            objectFit: "cover",
          }}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
              },
              tracks: subtitles
                ? [
                    {
                      kind: "subtitles",
                      label: language === "pt" ? "Português" : "English",
                      srcLang: language,
                      src: subtitles,
                    },
                  ]
                : [],
            },
          }}
        />
      </div>

      <div className="px-4" style={{ paddingBottom: "20px" }}>
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
              isLiked ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            <ThumbsUp size={20} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            onClick={() => setIsInList(!isInList)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isInList ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
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

        <div className="mt-4">
          <label className="text-white mr-4">Select Language:</label>
          <select
            value={language}
            onChange={(e) => changeAudioLanguage(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>
    </div>
  );
};
