const { response } = require('express');
const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

// 좋아요 정보 조회
router.post('/getLikes', (req, res) => {

    let variable = req.body.videoId 
        ? { videoId: req.body.videoId } 
        : { commentId: req.body.commentId };

    Like.find(variable)    
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })
});

// 싫어요 정보 조회
router.post('/getDislikes', (req, res) => {

    let variable = req.body.videoId 
        ? { videoId: req.body.videoId } 
        : { commentId: req.body.commentId };

    Dislike.find(variable)    
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })
});

// 좋아요 올림
router.post('/upLike', (req, res) => {

    let variable = req.body.videoId 
        ? { videoId: req.body.videoId, userId: req.body.userId } 
        : { commentId: req.body.commentId, userId: req.body.userId };

   // Like collection에다가 클릭 정보를 넣어줌
   const like = new Like(variable) //save할땐 인스턴스생성
   like.save((err, likeResult) => {
       if(err) return res.json({ success: false, err })

       // Dislike이 이미 클릭 되어있으면, Dislike를 1 줄여준다.
       Dislike.findOneAndDelete(variable)
        .exec((err, disLikeResult) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
   })

});

// 좋아요 내림
router.post('/unLike', (req, res) => {

    let variable = req.body.videoId 
    ? { videoId: req.body.videoId, userId: req.body.userId } 
    : { commentId: req.body.commentId, userId: req.body.userId };

    Like.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })

});

// 싫어요 올림
router.post('/upDislike', (req, res) => {

    let variable = req.body.videoId 
    ? { videoId: req.body.videoId, userId: req.body.userId } 
    : { commentId: req.body.commentId, userId: req.body.userId };

   // Dislike collection에다가 클릭 정보를 넣어줌
   const dislike = new Dislike(variable) //save할땐 인스턴스생성
   dislike.save((err, dislikeResult) => {
       if(err) return res.json({ success: false, err })

       // Like가 이미 클릭 되어있으면, Like를 1 줄여준다.
       Like.findOneAndDelete(variable)
        .exec((err, likeResult) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
   })

});

// 싫어요 내림
router.post('/unDislike', (req, res) => {

    let variable = req.body.videoId 
    ? { videoId: req.body.videoId, userId: req.body.userId } 
    : { commentId: req.body.commentId, userId: req.body.userId };

    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })

});


module.exports = router;