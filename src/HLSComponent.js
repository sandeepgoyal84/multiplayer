import React, { useCallback, useState, useEffect, useRef } from "react";
import HLSVideoListWrapper from "./HLSVideoListWrapper";
import HLSVideoLink from "./HLSVideoLink";
import videoData from "./videos.json";
import * as Helper from "./helper.js";
import * as Constants from "./constants.js";
import "./App.css";

function HLSComponent() {
  const [videoList, setVideoList] = useState([]);
  // const [videosToBePlayed, setVideosToBePlayed] = useState([]);
  const [playingVideos, setPlayingVideos] = useState([]);

  const [refreshVideo, setRefreshVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [addVideoInput, setAddVideoInput] = useState("");
  const [addVideosPatternInput, setAddVideosPatternInput] = useState("");

  const maxAllowedVideos = useRef(0);

  // refresh/restart the video
  const restartVideo = useCallback((video) => {
    setRefreshVideo(video);
    setSelectedVideo(video);
  }, []);

  // add videos to playing list
  const AddVideoToPlayingVideos = useCallback(
    (videosToAdd) => {
      // if there new different video ut already play list is full then return with app mess
      if (playingVideos.length === maxAllowedVideos.Current) {
        alert(
          `at max ${maxAllowedVideos.Current} video can be played, please close few videos first`
        );
        return;
      }
      // Check video limit
      if (
        playingVideos.length + videosToAdd.length >
        maxAllowedVideos.Current
      ) {
        alert(
          `at max ${maxAllowedVideos.Current} video can be played, first ${
            maxAllowedVideos.Current - playingVideos.length
          } videos will be played, please close few videos first then resumit`
        );
      }
      videosToAdd = videosToAdd.slice(
        0,
        maxAllowedVideos.Current - playingVideos.length
      );

      // Actively saving videos to local storage otherwise can be used via useEffect

      Helper.updateLastPlayListInLocalStore([...playingVideos, ...videosToAdd]);

      setPlayingVideos((oldState) => [...oldState, ...videosToAdd]);
      // last index of videoNumbers should be shown as selected
      setSelectedVideo(videoList[videosToAdd[-1]]);
    },
    [videoList, playingVideos, maxAllowedVideos.Current]
  );

  // remove video from playingvideos
  const removeVideoFromPlayingVideos = useCallback(
    (video) => {
      // Actively saving videos to local storage otherwise can be used via useEffect

      Helper.updateLastPlayListInLocalStore([
        ...playingVideos.filter((item) => item.id !== video.id),
      ]);
      setPlayingVideos((oldState) =>
        oldState.filter((item) => item.id !== video.id)
      );
    },
    [playingVideos]
  );

  // add custom video url to playing list
  const handleCustomVideoAdd = () => {
    const video = {
      src: addVideoInput,
      title: addVideoInput,
      poster: "",
      id: "" + videoList.length,
    };
    setVideoList((oldState) => [...oldState, video]);
    AddVideoToPlayingVideos([video]);
    setAddVideoInput("");
  };

  // handle request for playing a single video
  const handleAddSingleVideo = useCallback(
    (video) => {
      AddVideoToPlayingVideos(video);
    },
    [AddVideoToPlayingVideos]
  );

  // handle request for playing video as list or comma seperated value
  const handleRequestedVideos = (e) => {
    const reqVids = addVideosPatternInput;
    let videoNumbers = [];
    if (/^(\s*\d+\s*)(,\s*\d+\s*)*$/g.test(reqVids)) {
      // get all video indexs in numeric form
      videoNumbers = reqVids.split(",").map((x) => parseInt(x.trim()) - 1);
    } else if (/^(\s*\d+\s*)-(\s*\d+\s*)$/g.test(reqVids)) {
      const vidIdx = reqVids.split("-").map((x) => parseInt(x.trim()) - 1);
      //generate number sequence
      videoNumbers = Array(vidIdx[1] - vidIdx[0])
        .fill()
        .map((element, index) => index + vidIdx[0]);
    } else {
      alert("wrong pattern, use 1,2,3 or 1-9 etc.");
    }

    // check for out of index values
    if (videoNumbers.some((num) => num >= videoList.length)) {
      alert("invalid indexs are there, please correct");
      return;
    }
    //remove all video indexs whice already being played
    videoNumbers = videoNumbers.filter(
      (x) => !playingVideos.some((ele) => ele.id === videoList[x].id)
    );
    // if no different video is there, then  return
    if (videoNumbers.length === 0) {
      alert("already these videos are being played");
      return;
    }

    let videosToBeAdded = [];
    videoNumbers.forEach((videoIdx) => {
      videosToBeAdded.push(videoList[videoIdx]);
    });

    AddVideoToPlayingVideos(videosToBeAdded);
  };

  //load data
  useEffect(() => {
    // get videodata
    let vdata = JSON.parse(JSON.stringify(videoData)).data;

    let videos = [];
    // add additinal properties
    vdata.forEach((video, index) => {
      videos.push({ ...video });
    });
    // set to state variable
    setVideoList((oldState) => [...videos]);

    // to handle case where total available videos are less than MAX_VIDEOS_ALLOWED
    maxAllowedVideos.Current = Math.min(
      Constants.MAX_VIDEOS_ALLOWED,
      videos.length
    );
    let autoPlayVideoList = [];

    // fetch to get lat played videos
    const lastPlayed = Helper.getLastPlayListFromLocalStore();
    if (lastPlayed.length === 0) {
      autoPlayVideoList = videos.slice(0, maxAllowedVideos.Current);
    } else {
      // sanitize last last played videos
      let addedVideos = 0;
      for (let i = 0; i < lastPlayed.length; i++) {
        let matchedVideo = videos.find((ele) => ele.id === lastPlayed[i].id);
        if (matchedVideo) {
          // add if not already present
          if (
            addedVideos <= maxAllowedVideos.Current &&
            !autoPlayVideoList.some((ele) => ele.id === matchedVideo.id)
          ) {
            autoPlayVideoList.push(matchedVideo);
            addedVideos++;
          }
        }
      }
    }
    // save sanitized videos to local storage
    Helper.updateLastPlayListInLocalStore(autoPlayVideoList);

    // add to playingVideos
    setPlayingVideos(autoPlayVideoList);
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
              value={addVideosPatternInput}
              placeholder="1-9 or 1,2,3,..."
              onChange={(e) => setAddVideosPatternInput(e.target.value)}
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
              value={addVideoInput}
              placeholder="Enter video url"
              onChange={(e) => setAddVideoInput(e.target.value)}
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
