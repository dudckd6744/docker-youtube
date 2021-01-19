import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Avatar,Icon, message } from "antd"
import SideVideo from "./Secitons/SideVideo"
import Subscriber from "./Secitons/Subscriber"
import Comment from "./Secitons/Comment"
import LikeDislikes from "./Secitons/LikeDislikes"

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

    const ondeletevideo =()=>{
        var variable = {
            videoId:videoId
        }
        Axios.post('/api/video/deleteVideo',variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                message.success('비디오를 삭제하였습니다.')
                setTimeout(() => {
                    props.history.push('/')
                }, 2000);
                
            }else{
                alert("비디오를 삭제하는데 실패하였습니다.")
            }
        })
    }

    const refreshFunction =(Newcomments)=>{
        setComments(Comments.concat(Newcomments))
    }
    // 현재는 삭제기능이 새로고침해야 제대로 랜더링됨
    const deletFunction=(comment)=>{
        const currentIndex = Comments.indexOf(comment)
        console.log("22",currentIndex)
        console.log(comment._id)

        setComments(Comments.splice(currentIndex,1))
        return [...Comments]
    }
    console.log(Comments)

    if(VideoDetail.writer){

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') &&<Subscriber userTo={VideoDetail.writer._id}/>
        const deletVideo = VideoDetail.writer._id === localStorage.getItem('userId') && <span onClick={ondeletevideo}
        key="commet-delete-reply-to" ><Icon type="delete" /> </span>
        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%', padding:"3rem 4rem"}}>
                        <video style={{ width:"100%",height:"500px" }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[<LikeDislikes userId={localStorage.getItem('userId')}  
                            videoId={videoId}/> ,subscribeButton,deletVideo]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* coments */}
                        <Comment refreshFunction={refreshFunction} deletFunction={deletFunction}
                        commentLists={Comments} videoId={videoId}/>
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
