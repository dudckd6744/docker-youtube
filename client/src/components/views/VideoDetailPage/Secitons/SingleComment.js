import React, { useState } from 'react'
import { Comment, Avatar, Button, Icon, message} from "antd"
import Axios from 'axios'
import LikeDislikes from "./LikeDislikes";
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
    const onDeleteComment =()=>{
        var variable = {
            commentId : props.comment._id
        }

        Axios.post('/api/comment/deletecomment',variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data.doc)
                props.deletFunction(response.data.doc)
                message.success("댓글을 삭제하였습니다.")
            }else{
                alert("댓글 삭제를 실패하였습니다.")
            }
        })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        ,<span onClick={onClickOpenReply} key="comment-basic-reply-to"> Reply to</span>,
        [user.userData._id === props.comment.writer._id &&
            <span onClick={onDeleteComment}
            key="commet-delete-reply-to" ><Icon type="delete" /> </span>
]
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
