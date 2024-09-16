var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var makeId = require('../modules/makeId')

router.post('/', async function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip = ip.toString().replace('::ffff:', '')
    var session = new Session({
        session_id: makeId(), 
        host_ip: ip, 
        host_port:req.socket.remotePort,
        // host_id:String, 
        // session_name:String, 
        // max_players: Number
        password: req.body['password'] || 0
    })
    try{
        await session.save();
    } catch (MongoServerError) {
        // Duplicate key error collection
        if (MongoServerError.code === 11000) {
            session.session_id = makeId()
            await session.save();
        }
    };
    console.log(session);
    console.log(req.protocol);
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
    res.send();
});

module.exports = router;