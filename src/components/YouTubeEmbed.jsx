import React from "react";

const getYouTubeId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

export default function YouTubeEmbed({ url }) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return (
    <div style={{ margin: "1em 0" }}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
} 