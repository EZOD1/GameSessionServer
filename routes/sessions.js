var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var makeId = require('../modules/makeId')

router.post('/', async function(req, res){
    // var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    var session = new Session({
        session_id: makeId(), 
        // host_ip: String, 
        // host_port:String,
        // host_id:String, 
        // session_name:String, 
        // max_players: Number
    })
    console.log()
    await session.save();
    res.send();
});

router.post('/join', function(req, res){
    res.send()
});

router.post('/leave', function(req, res){
    res.send()
});

router.post('/close', function(req, res){
    res.send()
});

router.get('/', async function(req, res){
    // var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // console.log(ip)
    var session = new Session(req.body);
    console.log(session)
    // await session.save();
    res.send();
});

module.exports = router;