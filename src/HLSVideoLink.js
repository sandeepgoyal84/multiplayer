import React from "react";

function HLSVideoLink({ projectVideo, video, restart, isRestartVisible }) {
  const charCount = 10;
  return (
    <div
      style={{
        display: "flex",
        color: "white",
        padding: "15px 10px",
        wordBreak: "break-all",
      }}
    >
      <div style={{ flexGrow: 1 }} onClick={() => projectVideo(video)}>
        {video.title.slice(0, charCount) +
          (video.title.length > charCount ? "..." : "")}
      </div>
      {isRestartVisible && (
        <div
          style={{ backgroundColor: `rgb(50, 5, 5)` }}
          onClick={() => restart(video)}
        >
          Refresh
        </div>
      )}
    </div>
  );
}
export default HLSVideoLink;
