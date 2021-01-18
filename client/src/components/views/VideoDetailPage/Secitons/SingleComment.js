import React, { useState } from 'react'
import { Comment, Avatar, Button, Input} from "antd"
import Axios from 'axios'
import { useSelector } from 'react-redux';

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickOpenReply =() =>{
        setOpenReply(!OpenReply)
    }
    const onComment=(e)=>{
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit =(e)=>{
        e.preventDefault();
        

        var variable ={
            content: CommentValue,
            writer: user.userData._id,
            videoId: props.videoId,
            responseTo:props.comment._id
        }

        Axios.post('/api/comment/saveComment',variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data.doc)
                setCommentValue("")
                setOpenReply(false)
                props.refreshFunction(response.data.doc)
            }else{
                alert("코멘트를 저장하지 못했습니다.")
            }
        })
    }

    const actions = [
        <span onClick={onClickOpenReply} key="comment-basic-reply-to"> Reply to</span>
    ]

    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="true" />}
                content={<p> {props.comment.content}</p>}
            />
            {OpenReply &&
            <form style={{display:"flex"}} onSubmit={onSubmit}>
            <textarea
                style={{width:"100%", borderRadius:"5px"}}
                onChange={onComment}
                value={CommentValue}
                placeholder="코멘트를 작성해주세요."
                />
                <br />
                <button style={{ width:"20%", height:"52px"}} onClick={onSubmit}>Submit</button>
            </form>
            }
            
        </div>
    )
}

export default SingleComment
