const express = require('express');
const router = express.Router();

const { Like } = require("../models/Like");
const { DisLike } = require("../models/DisLike");

const { auth } = require("../middleware/auth");

//=================================
//             Like
//=================================



router.post('/getLikes', (req,res)=>{

    var variable={}

    if(req.body.videoId){
        variable={ videoId: req.body.videoId}
    }else{
        variable={commentId: req.body.commentId}
    }

    Like.find(variable)
        .exec((err,likes)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true,likes})
        })
})

router.post('/getDislikes', (req,res)=>{

    var variable={}

    if(req.body.videoId){
        variable={ videoId: req.body.videoId}
    }else{
        variable={commentId: req.body.commentId}
    }

    DisLike.find(variable)
        .exec((err,disLikes)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true,disLikes})
        })
})
router.post('/upLike', (req,res)=>{

    var variable={}

    if(req.body.videoId){
        variable={ videoId: req.body.videoId}
    }else{
        variable={commentId: req.body.commentId}
    }

    //like 콜렉션에 정보를 넣어줌
    const like = new Like(variable)

    like.save((err,likes)=>{
        if(err) return res.status(400).send(err)
    //dislike이 클릭되잇다면 dislike 을 1줄여준다.
        DisLike.findOneAndDelete(variable)
        .exec((err,dislike)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true })
        })
    })
    
})

router.post('/unlike', (req,res)=>{

    var variable={}

    if(req.body.videoId){
        variable={ videoId: req.body.videoId}
    }else{
        variable={commentId: req.body.commentId}
    }

    Like.findOneAndDelete(variable)
    .exec((err,likes)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true })
    })
})

router.post('/upDisLike', (req,res)=>{

    var variable={}

    if(req.body.videoId){
        variable={ videoId: req.body.videoId}
    }else{
        variable={commentId: req.body.commentId}
    }

    //like 콜렉션에 정보를 넣어줌
    const disLikes = new DisLike(variable)

    disLikes.save((err,dislikes)=>{
        if(err) return res.status(400).send(err)
    //dislike이 클릭되잇다면 dislike 을 1줄여준다.
        Like.findOneAndDelete(variable)
        .exec((err,like)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true })
        })
    })
    
})

router.post('/unDislike', (req,res)=>{

    var variable={}

    if(req.body.videoId){
        variable={ videoId: req.body.videoId}
    }else{
        variable={commentId: req.body.commentId}
    }

    DisLike.findOneAndDelete(variable)
    .exec((err,dislikes)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true })
    })
})
    

module.exports = router;
