import React from 'react';

function HLSVideoLink({ projectVideo, video }) {
    return (
        <div style={{ background: "black", color:"white", textDecoration:"none", width:"400px", wordBreak:'break-all' }}>
            <a href="#" onClick={() => projectVideo(video)}>
                {video.title}
            </a>
        </div>
    )
}
export default HLSVideoLink;