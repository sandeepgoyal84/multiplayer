import React, { useCallback, useState, useRef, useEffect } from 'react';
import HLSVideoListWrapper from './HLSVideoListWrapper';
import HLSVideoLink from './HLSVideoLink';
import './App.css';


const videoData = [{
    "src": "https://da2ys1sxfc2en.cloudfront.net/out/v1/a1c2fee066ae458ea246fde9e80576a7/CMAF_HLS/index.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    "title": "BigBuckBunny.mp4"
},
{
    "src": "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "title": "ElephantsDream.mp4"
},
{
    "src": "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "title": "ForBiggerBlazes.mp4"
},
{
    "src": "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    "title": "ForBiggerEscapes.mp4"
},
{
    "src": "http://d3rlna7iyyu8wu.cloudfront.net/skip_armstrong/skip_armstrong_stereo_subs.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    "title": "ForBiggerFun.mp4"
},
{
    "src": "http://d3rlna7iyyu8wu.cloudfront.net/skip_armstrong/skip_armstrong_multi_language_subs.m3u8",
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
    const [selectedId, setSelectedId] = useState({});

    //load data
    useEffect(() => {
        // get videodata
        let data = JSON.parse(JSON.stringify(videoData));

        let videos = [];
        // add additinal properties
        data.forEach((video, index) => {
            videos.push({ ...video, "id": "" + index });
        })
        // set to state variable
        setVideoList(oldState => [...videos]);
    }, []);
    const [addVideo, setAddVideo] = useState('');
    const [playingVideos, setPlayingVideos] = useState([]);

    const projectVideo = useCallback((video) => {
        if (!playingVideos.some(ele => ele.id === video.id)) {
            setPlayingVideos(oldState => [...oldState, video]);
            setSelectedId({ "id": video.id });
        }
    }, [playingVideos]);

    const restartVideo = useCallback((video) => {        
        setSelectedId({ "id": video.id });
    },[]);

    const handleAddVideo = () => {
        projectVideo({ "src": addVideo, "title": addVideo, "poster": "", id: addVideo });
        setAddVideo('');
    };
    const onClose = (vid) => {
        let filteredArray = playingVideos.filter(item => item.id !== vid.id);
        setPlayingVideos(filteredArray);
    };
    return (
        <div style={{ flexGrow: 1, display: "flex", margin: "20px 110px", backgroundColor: "black" }}>
            <div style={{ flexBasis: "400px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ flexGrow: 1, display: "flex", margin: "10px", flexDirection: "column" }}>
                    {videoList.map((video) => (
                        <HLSVideoLink key={video.id} projectVideo={projectVideo} video={video} restart={restartVideo} isRestartVisible={playingVideos.some(ele => ele.id === video.id)}/>
                    ))}</div>
                <div style={{ display: "flex", flexDirection: "column", margin: "50px 5px 10px 5px", backgroundColor: `rgb(50, 5, 5)` }}>
                    <input className='input' style={{ margin: "10px" }} type='text' value={addVideo} placeholder="Enter video url" onChange={e => setAddVideo(e.target.value)} />
                    <button className='button' style={{ margin: "10px" }} onClick={handleAddVideo}>play custom video</button>
                </div>
            </div>
            <div style={{ flexGrow: 1, borderLeft: "20px solid gray", display: "flex", flexDirection: "column" }}>
                <HLSVideoListWrapper playingVideos={playingVideos} selectedId={selectedId} onClose={onClose} />
            </div>
        </div>
    );
}

export default HLSComponent;
