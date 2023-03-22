import React, { useCallback, useState, useRef, useEffect } from 'react';
import HLSVideoListWrapper from './HLSVideoListWrapper';
import HLSVideoLink from './HLSVideoLink';


const videoData = [{
    "src": "https://da2ys1sxfc2en.cloudfront.net/out/v1/a1c2fee066ae458ea246fde9e80576a7/CMAF_HLS/index.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    "title": "BigBuckBunny.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "title": "ElephantsDream.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "title": "ForBiggerBlazes.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    "title": "ForBiggerEscapes.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    "title": "ForBiggerFun.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    "title": "ForBiggerJoyrides.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    "title": "ForBiggerMeltdowns.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    "title": "Sintel.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    "title": "SubaruOutbackOnStreetAndDirt.mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    "title": "TearsOfSteel.mp4"
}];
function HLSComponent() {
    const [videoList, setVideoList] = useState([]);
    const [selectedId, setSelectedId]= useState(-1);

    //load data
    useEffect(() => {
        // get videodata
        let data = JSON.parse(JSON.stringify(videoData));

        let videos = [];
        // add additinal properties
        data.forEach((video, index) => {
            videos.push({ ...video, "id": index });
        })
        // set to state variable
        setVideoList(oldState => [...videos]);
    }, []);

    const [playingVideos, setPlayingVideos] = useState([]);

    const projectVideo = useCallback((video) => {
        if (!playingVideos.some(ele => ele.id === video.id)) {
            setPlayingVideos(oldState => [...oldState, video]);
        }
        setSelectedId(video.id);
    }, [playingVideos]);
    return (
        <div style={{ display: "flex", alignItems: "stretch", padding: "2px", border: "1px solid black" }}>
            <div style={{ flexBasis: "400px", display: "flex", flexDirection: "column" }}>

                {videoList.map((video) => (
                    <HLSVideoLink key={video.id} projectVideo={projectVideo} video={video} />
                ))}
            </div>
            <div style={{ flexGrow: 1, border: "1px solid black", display: "flex", flexDirection: "column" }}>
                <HLSVideoListWrapper playingVideos={playingVideos} selectedId={selectedId}/>
            </div>
        </div>
    );
}

export default HLSComponent;
