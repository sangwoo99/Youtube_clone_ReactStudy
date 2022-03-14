const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

// 해당 동영상 작성자의 구독자 수 조회
router.post('/subscribeNumber', (req, res) => {
    
    Subscriber.find({ 'userTo': req.body.userTo })
        .exec((err, subscribe) => { // 모든 구독자 정보
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
        })
});

// 구독중인지 판별
router.post('/subscribed', (req, res) => {
    
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
        .exec((err, subscribe) => { 
            if(err) return res.status(400).send(err);

            let result = false;
            if(subscribe.length !== 0) { // 구독정보들이 있으면 구독중인거
                result = true;
            }

            return res.status(200).json({ success: true, subscribed: result })
        })
});

// 구독 취소
router.post('/unSubscribe', (req, res) => {
    console.log('[API-REQ] unSubscribe: ', req.body);
    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc) => { 
            if(err) return res.status(400).json({ success: false, err });
            return res.status(200).json({ success: true, doc })
        })
});

// 구독 하기
router.post('/subscribe', (req, res) => {
    
    const subscribe = new Subscriber(req.body);

    subscribe.save((err, doc) => {
        if(err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, doc })
        
    })
});

module.exports = router;