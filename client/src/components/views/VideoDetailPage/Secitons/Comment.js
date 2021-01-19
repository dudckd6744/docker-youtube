import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from "./SingleComment"
import ReplyComment from"./ReplyComment"

function Comment(props) {
    const videoId = props.videoId
    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("")

    const onReplies =(e) =>{
        setcommentValue(e.currentTarget.value)
    }

    const onSubmit =(e)=>{
        e.preventDefault();

        var variable ={
            content: commentValue,
            writer: user.userData._id,
            videoId: videoId
        }

        Axios.post('/api/comment/saveComment',variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data.doc)
                setcommentValue("")
                props.refreshFunction(response.data.doc)
            }else{
                alert("코멘트를 저장하지 못했습니다.")
            }
        })
    }


    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, i)=>(
                (!comment.responseTo &&
                    <React.Fragment key={i}>
                    <SingleComment  rfreshFunction={props.refreshFunction} deletFunction={props.deletFunction}
                    videoId={videoId} comment={comment} />
                    <ReplyComment refreshFunction={props.refreshFunction} deletFunction={props.deletFunction}
                    parentCommentId={comment._id} videoId={videoId} commentLists={props.commentLists}/>
                    </React.Fragment>
                    )
            ))}

            {/* Root Comment Form  */}

            <form style={{display:"flex"}} onSubmit={onSubmit} >
                <textarea
                    style={{width:"100%", borderRadius:"5px"}}
                    onChange={onReplies}
                    value={commentValue}
                    placeholder="코멘트를 작성해주세요."

                    />
                    <br />
                    <button style={{ width:"20%", height:"52px"}} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
