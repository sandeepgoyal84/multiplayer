import React, { useCallback, useState, useEffect } from "react";
import HLSVideoListWrapper from "./HLSVideoListWrapper";
import HLSVideoLink from "./HLSVideoLink";
import videoData from "./videos.json";
import "./App.css";

function HLSComponent() {
  const [videoList, setVideoList] = useState([]);
  const [refreshVideo, setRefreshVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [addVideo, setAddVideo] = useState("");
  const [playingVideos, setPlayingVideos] = useState([]);
  const [requestedVideos, setRequestedVideos] = useState("");

  const MAXVIDEOS = 9;
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

  const projectVideo = useCallback((video) => {
    setPlayingVideos((oldState) => {
      if (!oldState.some((ele) => ele.id === video.id)) {
        return [...oldState, video];
      }
      return oldState;
    });
    setSelectedVideo(video);
  }, []);

  const restartVideo = useCallback((video) => {
    setRefreshVideo(video);
    setSelectedVideo(video);
  }, []);

  const handleAddVideo = () => {
    projectVideo({ src: addVideo, title: addVideo, poster: "", id: addVideo });
    setAddVideo("");
  };
  const videoAddingLogic = (videoNumbers) => {
    // check for out of index values
    if (videoNumbers.some((num) => num > videoList.length)) {
      alert("invalid indexs are there, please correct");
      return;
    }
    //remove all video indexs whice already being played
    videoNumbers = videoNumbers.filter(
      (x) => !playingVideos.some((ele) => ele.id === "" + x)
    );
    // if no different video is there, then  return
    if (videoNumbers.length === 0) {
      alert("already these videos are being played");
      return;
    }
    // if there new different video ut already play list is full then return with app mess
    if (playingVideos.length === MAXVIDEOS) {
      alert(`at max ${MAXVIDEOS} video can be played, please close few videos first`);
      return;
    }
    // Check video limit
    if (playingVideos.length + videoNumbers.length > MAXVIDEOS) {
      alert(
        `at max ${MAXVIDEOS} video can be played, first ${MAXVIDEOS - playingVideos.length} videos will be played, please close few videos first then resumit`);
    }
    videoNumbers = videoNumbers.slice(0, MAXVIDEOS - playingVideos.length);
    videoNumbers.forEach((videoIdx) => {
      projectVideo(videoList[videoIdx]);
    });
  };
  const handleRequestedVideos = (e) => {
    const reqVids = requestedVideos;
    if (/^(\s*\d+\s*)(,\s*\d+\s*)*$/g.test(reqVids)) {
      // get all video indexs in numeric form
      let videoNumbers = reqVids.split(",").map((x) => parseInt(x.trim()) - 1);
      videoAddingLogic(videoNumbers);
    } else if (/^(\s*\d+\s*)-(\s*\d+\s*)$/g.test(reqVids)) {
      const vidIdx = reqVids.split("-").map((x) => parseInt(x.trim()) - 1);
      let videoNumbers = [];
      for (let idx = vidIdx[0]; idx <= vidIdx[1]; idx++) {
        videoNumbers.push(idx);
      }
      videoAddingLogic(videoNumbers);
    } else {
      alert("wrong pattern, use 1,2,3 or 1-9 etc.");
    }
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "5px",
              backgroundColor: `rgb(50, 5, 5)`,
            }}
          >
            <input
              className="input"
              style={{ margin: "5px" }}
              type="text"
              value={requestedVideos}
              placeholder="1-9 or 1,2,3,..."
              onChange={(e) => setRequestedVideos(e.target.value)}
            />
            <button
              className="button"
              style={{ margin: "5px" }}
              onClick={handleRequestedVideos}
            >
              play video/s
            </button>
          </div>
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
          refreshVideo={refreshVideo}
          selectedVideo={selectedVideo}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default HLSComponent;
