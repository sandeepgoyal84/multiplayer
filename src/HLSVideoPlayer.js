import React, { useState, useEffect, useCallback, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./App.css";

// https://www.tutorialspoint.com/how-to-setup-video-js-with-reactjs
// and
// https://videojs.com/guides/react/
function HLSVideoPlayer({ video, selectedId, onClose }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const canvasRef = useRef(null);
  const [volume, setVolume] = useState(0);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: false,
    height: "90px",
    width: "200px",
    html5: { hls: { overrideNative: true } },
    sources: [
      {
        src: video.src,
      },
    ],
  };

  // useeffect seq no 1 -- set volume
  // reflect slider value as per setted volume
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.volume(volume);
    }
  }, [volume]);

  // useeffect seq no 2 -- start/restart
  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (selectedId.id === video.id) {
      if (!playerRef.current) {
        // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
        constructPlayer();
      } else {
        disposePlayer();
        constructPlayer();
      }
    }
  }, [selectedId]);

  // useeffect seq no 3 -- dispose
  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => {
      disposePlayer();
    };
  }, []);

  const disposePlayer = () => {
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
      player.dispose();
      playerRef.current = null;
    }
  };
  const constructPlayer = () => {
    const videoElement = document.createElement("video");

    videoElement.classList.add("video-js");
    videoElement.classList.add("vjs-big-playcentered");
    videoRef.current.appendChild(videoElement);
    videoElement.disablepictureinpicture = true;

    const player = (playerRef.current = videojs(
      videoElement,
      videoJsOptions,
      () => {
        videojs.log("player is ready");
        // You can handle player events here, for example:

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // get access to audio context

        // Wait for window.onload to fire. See crbug.com/112368
        // Our <video> element will be the audio source.
        var source = audioCtx.createMediaElementSource(videoElement);
        const canvas = canvasRef.current; //config canvas
        canvas.width = 20;
        canvas.height = 80;
        const ctx = canvas.getContext("2d");

        //config audio analyzer
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount,
          dataArray = new Uint8Array(bufferLength),
          WIDTH = canvas.width,
          HEIGHT = canvas.height,
          barHeight = (HEIGHT / bufferLength) * 2.5;
        analyser.getByteTimeDomainData(dataArray);

        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        let barWidth = 0,
          y = 0,
          x = 0;

        //core logic for the visualizer
        const timeouts = [];
        const renderFrame = () => {
          ctx.fillStyle = "rgba(0,0,0,0)";
          requestAnimationFrame(renderFrame);
          y = 0;
          x = 0;
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(x, y, WIDTH, HEIGHT);
          ctx.fillRect(x, y, WIDTH, HEIGHT);

          for (let i = 0; i < bufferLength; i++) {
            //color based upon frequency
            barWidth = dataArray[i];
            let r = barWidth + 22 * (i / bufferLength),
              g = 333 * (i / bufferLength),
              b = 47;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, y, barWidth, barHeight);
            y += barHeight + 1;

            //Allows visualizer to overlay on a background/video by clearing the rects after painting.
            // let timer = setTimeout(() => {
            //     ctx.clearRect(0, 0, WIDTH, HEIGHT);
            // }, 50);
            // timeouts.push(timer);
          }
        };
        //Clears the accumulating timeouts.
        // setTimeout(() => {
        //     for (let i = 0; i < timeouts.length; i++) {
        //         return clearTimeout(timeouts[i]);
        //     }
        // }, 51);
        renderFrame();

        player.on("waiting", () => {
          videojs.log("player is waiting");
        });

        player.on("dispose", () => {
          videojs.log("player will dispose");
        });
        player.on("error", (err) => {
          //setErrorMsg(err);
          setTimeout(() => {
            //setErrorMsg(null);
            disposePlayer();
            constructPlayer();
          }, 5000);
        });
        player.on("volumechange", () => {
          videojs.log("volume changed");
          videojs.log(player.volume());
          setVolume(player.volume());
        });
      }
    ));

    // You could update an existing player in the `else` block here
    // on prop change, for example:
    //set volume
    player.volume(volume);
  };

  const handleVolume = (e) => {
    setVolume(e.target.value);
  };
  const handleClose = () => {
    onClose(video);
    disposePlayer();
  };

  return (
    <div style={{ width: "200px" }}>
      <div
        style={{
          display: "flex",
          padding: "0px 10px",
          color: "white",
          textDecoration: "none",
          wordBreak: "break-all",
        }}
      >
        <div style={{ flexGrow: 1 }}>{video.title}</div>
        <div onClick={handleClose}>{"close"}</div>
      </div>
      <div style={{ position: "relative" }} ref={videoRef}>
        <canvas
          style={{ position: "absolute", zIndex: "1000", left: "10px" }}
          ref={canvasRef}
        ></canvas>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "baseline",
          background: "blue",
        }}
      >
        <label
          style={{ color: "white", fontFamily: "verdana", fontSize: "0.75em" }}
          htmlFor="volume-control"
        >
          Volume:
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolume}
        />
        <span>{Math.round(volume * 100)}</span>
      </div>
    </div>
  );
}
export default React.memo(HLSVideoPlayer);
