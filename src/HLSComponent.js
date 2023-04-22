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

  // refresh/restart the video
  const restartVideo = useCallback((video) => {
    setRefreshVideo(video);
    setSelectedVideo(video);
  }, []);


  // add videos to playing list
  const AddVideoToPlayingVideos = useCallback(
    (videoNumbers) => {
      // check for out of index values
      if (videoNumbers.some((num) => num >= videoList.length)) {
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
        alert(
          `at max ${MAXVIDEOS} video can be played, please close few videos first`
        );
        return;
      }
      // Check video limit
      if (playingVideos.length + videoNumbers.length > MAXVIDEOS) {
        alert(
          `at max ${MAXVIDEOS} video can be played, first ${
            MAXVIDEOS - playingVideos.length
          } videos will be played, please close few videos first then resumit`
        );
      }
      videoNumbers = videoNumbers.slice(0, MAXVIDEOS - playingVideos.length);
      videoNumbers.forEach((videoIdx) => {
        setPlayingVideos((oldState) => [...oldState, videoList[videoIdx]]);
        setSelectedVideo(videoList[videoIdx]);
      });
    },
    [videoList, playingVideos]
  );

  // remove video from playingvideos
  const removeVideoFromPlayingVideos = useCallback((vid) => {
    setPlayingVideos((oldState) => {
      return oldState.filter((item) => item.id !== vid.id);
    });
  }, []);

  // add custom video url to playing list
  const handleCustomVideoAdd = () => {
    let indx = videoList.length;
    setVideoList((oldState) => [
      ...oldState,
      { src: addVideo, title: addVideo, poster: "", id: ("" + oldState.length) },
    ]);
    AddVideoToPlayingVideos([indx]);
    setAddVideo("");
  };

  // handle request for playing a single video 
  const handleAddSingleVideo = useCallback(
    (video) => {
      AddVideoToPlayingVideos([video.id]);
    },
    [AddVideoToPlayingVideos]
  );

  // handle request for playing video as list or comma seperated value
  const handleRequestedVideos = (e) => {
    const reqVids = requestedVideos;
    if (/^(\s*\d+\s*)(,\s*\d+\s*)*$/g.test(reqVids)) {
      // get all video indexs in numeric form
      let videoNumbers = reqVids.split(",").map((x) => parseInt(x.trim()) - 1);
      AddVideoToPlayingVideos(videoNumbers);
    } else if (/^(\s*\d+\s*)-(\s*\d+\s*)$/g.test(reqVids)) {
      const vidIdx = reqVids.split("-").map((x) => parseInt(x.trim()) - 1);
      let videoNumbers = [];
      for (let idx = vidIdx[0]; idx <= vidIdx[1]; idx++) {
        videoNumbers.push(idx);
      }
      AddVideoToPlayingVideos(videoNumbers);
    } else {
      alert("wrong pattern, use 1,2,3 or 1-9 etc.");
    }
  };

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
              backgroundColor: `rgb(100, 0, 0)`,
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
          
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "5px",
            backgroundColor: `rgb(0, 0, 100)`,
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
            onClick={handleCustomVideoAdd}
          >
            play custom video
          </button>
        </div>
          {videoList.map((video) => (
            <HLSVideoLink
              key={video.id}
              projectVideo={handleAddSingleVideo}
              video={video}
              restart={restartVideo}
              isRestartVisible={playingVideos.some(
                (ele) => ele.id === video.id
              )}
            />
          ))}
        </div>
      </div>
      <div style={{ flex: "0 0 1632px", backgroundColor: "black" }}>
        <HLSVideoListWrapper
          playingVideos={playingVideos}
          refreshVideo={refreshVideo}
          selectedVideo={selectedVideo}
          onClose={removeVideoFromPlayingVideos}
        />
      </div>
    </div>
  );
}

export default HLSComponent;
