import React, { useCallback, useEffect, useState } from 'react';
import HLSVideoPlayer from './HLSVideoPlayer';

function HLSVideoListWrapper({ playingVideos }) {
    const [selectedId, setSelectedId] = useState(-1);
    const [videoUrl, setVideoUrl] = useState('');

    const selectedVideo = (id) => {
        //alert(id);
        setSelectedId(id);
    }
    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {playingVideos.map((vid) => (
                <div style={{ display: "flex", flexWrap: "wrap", flexDirection:"row", border: selectedId===vid.key ? "2px solid red" : "2px solid black" }} onClick={()=>selectedVideo(vid.key)}>

                    <HLSVideoPlayer key={vid.id} video={vid}/>
                </div>
            ))}
        </div>
    )
}
export default HLSVideoListWrapper;