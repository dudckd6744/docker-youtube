const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg =  require("fluent-ffmpeg");
const { Video } = require("../models/Video");
const { Subscriber} = require('../models/Subscriber');
const { Comment } = require("../models/Comment")

const { auth } = require("../middleware/auth");

ffmpeg.setFfmpegPath(ffmpegInstaller);
console.log(ffmpegInstaller.path, ffmpegInstaller.version);



var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false)
        }
        cb(null, true)
    }
})

const upload = multer({ storage : storage}).single("file");

//=================================
//             Vidoe
//=================================

router.get('/getVideos',(req,res)=>{
    
    Video.find()
        .populate('writer')
        .exec((err, videos) =>{
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true, videos})
        })
})

router.post('/deleteVideo',(req,res)=>{
    
    Video.findByIdAndDelete({'_id':req.body.videoId})
    .exec((err, doc)=>{
        if(err) return res.status(400).send(err);
        console.log(doc)
        Comment.deleteMany({'videoId':{$in:doc._id}})
        .exec((err,rere)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true})
        })
    })

})

router.post('/getSubscriptionVideos',(req,res)=>{
    //자신의 아이디를 가지고 구독하는 사람들을 찾는다
    Subscriber.find({userFrom:req.body.userFrom})
    .exec((err, subscriberInfo)=>{
        if(err) return res.status(400).send(err);
        
        var subscribedUser = [];
        subscriberInfo.map((itme, i)=>{
            subscribedUser.push(itme.userTo);
        })
    //찾은 사람들의 비디오를 가져온다
        Video.find({"writer":{$in:subscribedUser}})
            .populate("writer")
            .exec((err, videos)=>{
                if(err) return res.status(400).send(err);
                res.status(200).json({success:true, videos})
            })

    })

})

router.post('/getVideoDetail',(req,res)=>{
    
    Video.findOne({ "_id":req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) =>{
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true, videoDetail})
        })
})

router.post('/uploadVideo',(req,res)=>{
    
    const video = new Video(req.body);

    video.save((err, doc)=> {
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })

})

router.post('/uploadfiles',(req,res)=>{
    // console.log(res.req)
    upload(req,res, err =>{
        if(err){
            return res.json({ success:false,err})
        }
        return res.json({ success:true, url:res.req.file.path, fileName:res.req.file.filename})
    })

})

router.post('/thumbnail',(req,res)=>{

    var filePath = ""
    var fileDuration = ""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.log(req.body)
        console.log(metadata);
        fileDuration = metadata.format.duration
    })
    
    //썸네일 생성 하고 비디오 러닝타임 가져오기
    ffmpeg(req.body.url)
    .on('filenames', function(filenames) {
        console.log('Will generate' + filenames.join(' , '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({ success: true, url:filePath, fileDuration:fileDuration})
    })
    .on('error', function(err){
        console.error(err);
        return res.json({ success:false,err});
    })
    .screenshots({
        count:3,
        folder: "uploads/thumbnails",
        size:'320x240',
        filename: 'thumbnail-%b.png'
    })
})

module.exports = router;
