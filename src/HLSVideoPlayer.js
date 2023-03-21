import React, { useState, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './App.css';

function HLSVideoPlayer({ url }) {
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
            src: url
        }]
    };
    // useEffect(() => {
    //     if (isSelected) {
    //         const player = videojs(videoRef.current, { html5: { hls: { overrideNative: true } } });
    //         player.src({ src: videoUrl });
    //         player.volume(volume);
    //         player.play();
    //     }
    //     return () => { }
    // }, [isSelected, videoUrl, volume]);
    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('video-js');
            videoElement.classList.add('vjs-default-skin');
            videoRef.current.appendChild(videoElement);

            // videoElement.autoplay = true;
            // videoElement.muted = false;
            // videoElement.controls = true;
            // videoElement.height = 180; // in px
            // videoElement.width = 400; // in px
            // videoElement.playsInline = true;


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
                    setVolume(player.volume())
                });
            });

            // You could update an existing player in the `else` block here
            // on prop change, for example:
            player.volume(volume);
        } else {
            const player = playerRef.current;
            player.volume(volume);
        }
    }, [videoRef, volume]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);
    const handleVolume = (e) => {
        setVolume(e.target.value);
    }
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>

            <div style={{ background: "black", color: "white", textDecoration: "none", width: "400px", wordBreak: 'break-all' }}>
                {url}
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