import React, { useState, useEffect, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './App.css';

// https://www.tutorialspoint.com/how-to-setup-video-js-with-reactjs
// and 
// https://videojs.com/guides/react/
function HLSVideoPlayer({ video, selectedId, onClose }) {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const [volume, setVolume] = useState(0);
    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: false,
        height: "180px",
        width: "400px",
        html5: { hls: { overrideNative: true } },
        sources: [{
            src: video.src,
        }]
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
    useEffect(() => {// Make sure Video.js player is only initialized once
        if (selectedId.id === video.id) {
            if (!playerRef.current) {
                // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
                constructPlayer();
            }
            else {
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
        }
    }, []);

    function constructPlayer() {
        const videoElement = document.createElement("video-js");

        videoElement.classList.add('video-js');
        videoElement.classList.add('vjs-big-playcentered');
        videoRef.current.appendChild(videoElement);
        videoElement.disablepictureinpicture = true;

        const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
            videojs.log('player is ready');
            // You can handle player events here, for example:
            player.on('waiting', () => {
                videojs.log('player is waiting');
            });

            player.on('dispose', () => {
                videojs.log('player will dispose');
            });
            player.on('volumechange', () => {
                videojs.log('volume changed');
                videojs.log(player.volume());
                setVolume(player.volume());
            });
        });

        // You could update an existing player in the `else` block here
        // on prop change, for example:
        //set volume
        player.volume(volume);
    }

    function disposePlayer() {
        const player = playerRef.current;
        if (player && !player.isDisposed()) {
            player.dispose();
            playerRef.current = null;
        }
    }
    const handleVolume = (e) => {
        setVolume(e.target.value);
    }
    const handleClose = () => {
        onClose(video);
        disposePlayer();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>

            <div style={{ display: "flex", padding: "0px 10px", color: "white", textDecoration: "none", width: "400px", wordBreak: 'break-all' }}>
                <div style={{ flexGrow: 1 }}>{video.title}</div>
                <div onClick={handleClose}>{"close"}</div>
            </div>
            <div style={{ height: "200px", width: "400px", display: 'flex', flexDirection: 'column' }}>
                <div ref={videoRef} />
                <div style={{ display: 'flex', justifyContent: "center", alignContent: 'baseline', background: "blue" }}>
                    <label style={{ color: "white", fontFamily: "verdana", fontSize: "0.75em" }} htmlFor="volume-control">Volume:</label>
                    <input type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolume} />
                    <span>{Math.round(volume * 100)}</span>
                </div>
            </div>
        </div>
    )
}
export default React.memo(HLSVideoPlayer);


