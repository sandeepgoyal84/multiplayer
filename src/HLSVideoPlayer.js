import React, { useState, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './App.css';

// https://www.tutorialspoint.com/how-to-setup-video-js-with-reactjs
// and 
// https://videojs.com/guides/react/
function HLSVideoPlayer({ video }) {
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
            type: 'video/mp4'
        }]
    };
    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('video-js');
            videoElement.classList.add('vjs-big-playcentered');
            videoRef.current.appendChild(videoElement);

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
    }, [videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    // reflect slider value as per setted volume
    useEffect(() => {
        const player = playerRef.current;
        if (player) {
            player.volume(volume);
        }
    }, [volume]);

    const handleVolume = (e) => {
        setVolume(e.target.value);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>

            <div style={{ background: "black", color: "white", textDecoration: "none", width: "400px", wordBreak: 'break-all' }}>
                {video.title}
            </div>
            <div style={{ height: "200px", width: "400px", display: 'flex', flexDirection: 'column', background: "black" }}>
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