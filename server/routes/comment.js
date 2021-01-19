const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//             Comments
//=================================

router.post('/saveComment', (req,res)=>{
    const comment = new Comment(req.body);

    comment.save((err,comments)=>{
        if(err) return res.status(400).send(err);
        
        Comment.find({"_id":comments._id})
            .populate("writer")
            .exec((err,doc)=>{
                if(err) return res.status(400).send(err);
                res.status(200).json({success:true ,doc})
            })
    })
})


router.post('/getComment', (req,res)=>{
    Comment.find({ "videoId": req.body.videoId})
    .populate("writer")
    .exec((err, comments)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true, comments})
    })
})


router.post('/deletecomment', (req,res)=>{
    console.log(req.body)
    Comment.findByIdAndDelete({ "_id": req.body.commentId})
    .exec((err, doc)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true, doc})
    })
})



module.exports = router;
