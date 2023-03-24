import React, { useCallback, useEffect, useState } from 'react';
import HLSVideoPlayer from './HLSVideoPlayer';

function HLSVideoListWrapper({ playingVideos, selectedId, onClose }) {
    const [highLightId, setHighLightId] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const highLightVideo = (id) => {
        //alert(id);
        setHighLightId(id);
    }
    useEffect(() => {
        setHighLightId(selectedId.id);
    }, [selectedId]);

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {playingVideos.map((vid) => (
                <div  key={vid.id} style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", border: highLightId === vid.id ? "2px solid red" : "2px solid black" }} onClick={() => highLightVideo(vid.id)}>

                    <HLSVideoPlayer video={vid} selectedId={selectedId} onClose={onClose} />
                </div>
            ))}
        </div>
    )
}
export default HLSVideoListWrapper;
