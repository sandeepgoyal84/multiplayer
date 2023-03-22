import React from 'react';

function HLSVideoLink({ projectVideo, video }) {
    return (
        <div style={{ color: "white", padding: "15px 5px", wordBreak: 'break-all' }}>
            <a href="#" onClick={() => projectVideo(video)}>
                {video.title}
            </a>
        </div>
    )
}
export default HLSVideoLink;