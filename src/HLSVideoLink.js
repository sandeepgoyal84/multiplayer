import React from 'react';

function HLSVideoLink({ url, projectVideo, keyShouldbePartofImageInfo }) {
    return (
        <div style={{ background: "black", color:"white", textDecoration:"none", width:"400px", wordBreak:'break-all' }}>
            <a href="#" onClick={() => projectVideo(url, keyShouldbePartofImageInfo)}>
                {url}
            </a>
        </div>
    )
}
export default HLSVideoLink;