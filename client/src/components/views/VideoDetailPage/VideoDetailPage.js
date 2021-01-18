import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Avatar } from "antd"
import SideVideo from "./Secitons/SideVideo"
import Subscriber from "./Secitons/Subscriber"
import Comment from "./Secitons/Comment"

import Axios from 'axios'

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const variable ={videoId : videoId}

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setVideoDetail(response.data.videoDetail)
            }else{
                alert("비디오 정보를 가져오는데 실패하였습니다.")
            }
        })

        Axios.post('/api/comment/getComment', variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data)

                setComments(response.data.comments)
            }else{
                alert("코멘트 정보를 가져오는데 실패했습니다.")
            }
        })
    }, [])

    const refreshFunction =(Newcomments)=>{
        setComments(Comments.concat(Newcomments))
    }

    if(VideoDetail.writer){

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') &&<Subscriber userTo={VideoDetail.writer._id}/>

        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%', padding:"3rem 4rem"}}>
                        <video style={{ width:"100%",height:"500px" }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* coments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} videoId={videoId}/>
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo/>
                </Col>
            </Row>
        )
    }else{
        return (
            <div>...loding</div>
        )
    }

    
}

export default VideoDetailPage
