import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(() => {

        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                setsideVideos(response.data.videos)
            }else{
                alert("비디오를 가져오는데 실패하였습니다.")
            }
        })
    }, [])

    const renderSideVideo = sideVideos.map((video, i)=>{
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <div key={i} style={{ display:"flex", marginBottom:"1rem", padding:"0 2rem"}}>
            <div style={{ width:"40%", marginRight:"1rem"}}>
                <a href ={`/video/${video._id}`}>
                    <img style={{width:"100%", height:"100%"}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>
            <div style={{width:"30%"}}>
                <a href ={`/video/${video._id}`} style={{color:"gray"}}>
                    <span style={{frontSize:'5rem', color:"black", fontWeight:"bolder"}}>{video.title}</span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views</span><br />
                    <span>{minutes} : {seconds}</span>
                </a>
            </div>
        </div>
    })

    return (

        <React.Fragment>
            <div style={{marginTop:"3rem"}}/>
            {renderSideVideo}
        </React.Fragment>

        
    )
}

export default SideVideo
