import React, { useEffect, useState } from "react";
import HLSVideoPlayer from "./HLSVideoPlayer";

function HLSVideoListWrapper({
  playingVideos,
  selectedVideo,
  refreshVideo,
  onClose,
}) {
  const [highLightVideo, setHighLightVideo] = useState(null);

  const handleHighLightVideo = (video) => {
    setHighLightVideo(video);
  };
  useEffect(() => {
    setHighLightVideo(selectedVideo);
  }, [selectedVideo]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {playingVideos.map((vid) => (
        <div
          key={vid.id}
          style={{
            border:
            highLightVideo && highLightVideo.id === vid.id
                ? "2px solid red"
                : "2px solid black",
          }}
          onClick={() => handleHighLightVideo(vid)}
        >
          <HLSVideoPlayer
            video={vid}
            refreshVideo={refreshVideo}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
}
export default HLSVideoListWrapper;
