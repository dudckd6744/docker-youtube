import React, { useEffect, useState } from 'react'
import SingleComment from "./SingleComment";
import { Comment, Avatar, Button, Input} from "antd"

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
        var commentNumber =0;

        props.commentLists.map((comment)=>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber ++
            }
        })
        
        setChildCommentNumber(commentNumber)
    }, [props.commentLists])

    const renderReplyComment = (parentCommentId)=>{
        return(
        props.commentLists.map((comment, i)=>(
            <React.Fragment key={i}  >

            {comment.responseTo === parentCommentId &&
            <div style={{width:"80%", marginLeft:"40px"}}>
                <SingleComment refreshFunction={props.refreshFunction} videoId={props.videoId} comment={comment} deletFunction={props.deletFunction} />
                <ReplyComment deletFunction={props.deletFunction} refreshFunction={props.refreshFunction} commentLists={props.commentLists} videoId={props.videoId} parentCommentId={comment._id}/>
            </div>
            }
                
            </React.Fragment>
        ))
        )
    }

    const onClickh=()=>{
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <span style={{ fontSize:"14px", margin: 0, color:"gray"}} onClick={onClickh}>
                View {ChildCommentNumber} more comment(s)
                </span>    
            }
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment
