import React from 'react';

function HLSVideoLink({ projectVideo, video }) {
    return (
        <div style={{ display: "flex", color: "white", padding: "15px 10px", wordBreak: 'break-all' }}>
            <div style={{ flexGrow: 1 }} onClick={() => projectVideo(video)}>
                {video.title}
            </div>
            <div style={{backgroundColor: `rgb(50, 5, 5)`, }} onClick={() => projectVideo(video)}>
                Refresh
            </div>
        </div>
    )
}
export default HLSVideoLink;
