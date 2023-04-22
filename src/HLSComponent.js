import React, { useCallback, useState, useRef, useEffect } from "react";
import HLSVideoListWrapper from "./HLSVideoListWrapper";
import HLSVideoLink from "./HLSVideoLink";
import videoData from "./videos.json";
import "./App.css";

function HLSComponent() {
  const [videoList, setVideoList] = useState([]);
  const [selectedId, setSelectedId] = useState({});

  //load data
  useEffect(() => {
    // get videodata
    let vdata = JSON.parse(JSON.stringify(videoData)).data;

    let videos = [];
    // add additinal properties
    vdata.forEach((video, index) => {
      videos.push({ ...video, id: "" + index });
    });
    // set to state variable
    setVideoList((oldState) => [...videos]);
  }, []);
  const [addVideo, setAddVideo] = useState("");
  const [playingVideos, setPlayingVideos] = useState([]);

  const projectVideo = useCallback(
    (video) => {
      if (!playingVideos.some((ele) => ele.id === video.id)) {
        setPlayingVideos((oldState) => [...oldState, video]);
        setSelectedId({ id: video.id });
      }
    },
    [playingVideos]
  );

  const restartVideo = useCallback((video) => {
    setSelectedId({ id: video.id });
  }, []);

  const handleAddVideo = () => {
    projectVideo({ src: addVideo, title: addVideo, poster: "", id: addVideo });
    setAddVideo("");
  };
  const onClose = (vid) => {
    let filteredArray = playingVideos.filter((item) => item.id !== vid.id);
    setPlayingVideos(filteredArray);
  };
  return (
    <div
      style={{ flexGrow: "1", display: "flex", justifyContent: "space-evenly" }}
    >
      <div
        style={{
          flex: "0 1 30px",
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flexGrow: "1", margin: "5px" }}>
          {videoList.map((video) => (
            <HLSVideoLink
              key={video.id}
              projectVideo={projectVideo}
              video={video}
              restart={restartVideo}
              isRestartVisible={playingVideos.some(
                (ele) => ele.id === video.id
              )}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "50px 5px 5px 5px",
            backgroundColor: `rgb(50, 5, 5)`,
          }}
        >
          <input
            className="input"
            style={{ margin: "5px" }}
            type="text"
            value={addVideo}
            placeholder="Enter video url"
            onChange={(e) => setAddVideo(e.target.value)}
          />
          <button
            className="button"
            style={{ margin: "5px" }}
            onClick={handleAddVideo}
          >
            play custom video
          </button>
        </div>
      </div>
      <div style={{ flex: "0 0 1632px", backgroundColor: "black" }}>
        <HLSVideoListWrapper
          playingVideos={playingVideos}
          selectedId={selectedId}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default HLSComponent;
