import React, { useCallback, useState, useRef } from 'react';
import HLSContainer from './HLSContainer';
import HLSVideoLink from './HLSVideoLink';
import HLSVideoPlayer from './HLSVideoPlayer';
import './App.css';

function App() {
  const videos = useRef([
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ]);
  const images = useRef([
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg"
  ]);

  const [playingVideos, setPlayingVideos] = useState([]);


  const projectVideo = useCallback((url, id) => {
    setPlayingVideos(oldArray => [...oldArray, { "url": url, "key": id }]);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "stretch", padding: "2px", border: "1px solid black" }}>
      <div style={{ flexBasis: "400px", display: "flex", flexDirection: "column" }}>
        <HLSVideoLink url={videos.current[0]} projectVideo={projectVideo} keyShouldbePartofImageInfo={0} />
        <HLSVideoLink url={videos.current[1]} projectVideo={projectVideo} keyShouldbePartofImageInfo={1} />
        <HLSVideoLink url={videos.current[2]} projectVideo={projectVideo} keyShouldbePartofImageInfo={2} />

        <HLSVideoLink url={videos.current[3]} projectVideo={projectVideo} keyShouldbePartofImageInfo={3} />
        <HLSVideoLink url={videos.current[4]} projectVideo={projectVideo} keyShouldbePartofImageInfo={4} />
        <HLSVideoLink url={videos.current[5]} projectVideo={projectVideo} keyShouldbePartofImageInfo={5} />

        <HLSVideoLink url={videos.current[6]} projectVideo={projectVideo} keyShouldbePartofImageInfo={6} />
        <HLSVideoLink url={videos.current[7]} projectVideo={projectVideo} keyShouldbePartofImageInfo={7} />
        <HLSVideoLink url={videos.current[8]} projectVideo={projectVideo} keyShouldbePartofImageInfo={8} />
      </div>
      <div style={{ flexGrow: 1, border: "1px solid black", display: "flex", flexDirection: "column" }}>
        <HLSContainer playingVideos={playingVideos} />
      </div>
    </div>
  );
}

export default App;
