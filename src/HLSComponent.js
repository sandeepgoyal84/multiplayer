import React, { useCallback, useState, useRef, useEffect } from 'react';
import HLSVideoListWrapper from './HLSVideoListWrapper';
import HLSVideoLink from './HLSVideoLink';
import './App.css';


const videoData = [{
    "src": "https://da2ys1sxfc2en.cloudfront.net/out/v1/a1c2fee066ae458ea246fde9e80576a7/CMAF_HLS/index.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    "title": "CMAF_HLS/index.m3u8",
    "type": "application/x-mpegURL"
},
{
    "src": "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "title": "fmp4/master.m3u8",
    "type": "application/x-mpegURL"
},
{
    "src": "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    "title": "test/master.m3u8",
    "type": "application/x-mpegURL"
},
{
    "src": "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    "title": "eight/playlist.m3u8",
    "type": "application/x-mpegURL"
},
{
    "src": "http://d3rlna7iyyu8wu.cloudfront.net/skip_armstrong/skip_armstrong_stereo_subs.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    "title": "armstrong/skip_armstrong_stereo_subs.m3u8",
    "type": "application/x-mpegURL"
},
{
    "src": "http://d3rlna7iyyu8wu.cloudfront.net/skip_armstrong/skip_armstrong_multi_language_subs.m3u8",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    "title": "armstrong/skip_armstrong_multi_language_subs.m3u8",
    "type": "application/x-mpegURL"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    "title": "ForBiggerMeltdowns.mp4",
    "type": "video/mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    "title": "Sintel.mp4",
    "type": "video/mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    "title": "SubaruOutbackOnStreetAndDirt.mp4",
    "type": "video/mp4"
},
{
    "src": "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "poster": "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    "title": "TearsOfSteel.mp4",
    "type": "video/mp4"
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
    }, []);

    const handleAddVideo = () => {
        projectVideo({ "src": addVideo, "title": addVideo, "poster": "", id: addVideo });
        setAddVideo('');
    };
    const onClose = (vid) => {
        let filteredArray = playingVideos.filter(item => item.id !== vid.id);
        setPlayingVideos(filteredArray);
    };
    return (
        <div style={{ flexGrow: "1", display: "flex", justifyContent: 'space-evenly' }}>
            <div style={{ flex: "0 1 400px", backgroundColor: "black", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ flexGrow: "1", margin: "10px" }}>
                    {videoList.map((video) => (
                        <HLSVideoLink key={video.id} projectVideo={projectVideo} video={video} restart={restartVideo} isRestartVisible={playingVideos.some(ele => ele.id === video.id)} />
                    ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", margin: "50px 5px 10px 5px", backgroundColor: `rgb(50, 5, 5)` }}>
                    <input className='input' style={{ margin: "10px" }} type='text' value={addVideo} placeholder="Enter video url" onChange={e => setAddVideo(e.target.value)} />
                    <button className='button' style={{ margin: "10px" }} onClick={handleAddVideo}>play custom video</button>
                </div>
            </div>
            <div style={{ flex: "0 0 1212px", backgroundColor: "black" }}>
                <HLSVideoListWrapper playingVideos={playingVideos} selectedId={selectedId} onClose={onClose} />
            </div>
        </div>
    );
}

export default HLSComponent;
