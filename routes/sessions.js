var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var makeId = require('../modules/makeId')

router.post('/', async function(req, res, next) {
    var host_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    host_ip = host_ip.toString().replace('::ffff:', '')
    var session = new Session({
        session_id: makeId(), 
        host_ip: host_ip, 
        host_port:req.socket.remotePort,
        host_id:req.body['host_id'], 
        session_name:req.body['session_name'], 
        max_players: req.body['max_players'] || 1,
        status:req.body['status'] || 'active',
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
    res.send();
});

router.post('/join', async function(req, res, next) {
    var session_id = req.body['session_id'];
    var password = req.body['password'] || null;
    var query = Session.find({'session_id': session_id})
    .select({
        '_id':1,
        'status':1,
        'password':1,
        'host_ip':1,
        'host_port':1,
        'max_players':1,
        'current_players':1,
    });
    var session = (await query.exec())[0];
    // If session_id not found
    if (!session) {
        res.send('Incorrect session_id');
        return;
    }
    // Password verification
    if (session['status'] != 'active') {
        if (session['password'] != password) {
            res.send('Incorrect password')
            return;
        }
    }
    // Fullness check
    if (session['max_players'] === session['current_players']) {
        res.send('The session is full');
        return;
    }
    // Query to add player
    query = Session.findOneAndUpdate({'_id': session['_id']}, {'current_players': session['current_players'] + 1});
    await query.exec();
    res.json({'host_ip': session['host_ip'], 'host_port': session['host_port']});
});

router.post('/leave', async function(req, res, next) {
    var session_id = req.body['session_id'];
    var query = Session.find({'session_id': session_id})
    .select({
        '_id':1,
        'current_players':1,
    });
    var session = (await query.exec())[0];
    // Close session
    if (session['current_players'] === 1) {
        query = Session.deleteOne({'_id': session['_id']});
        await query.exec();
        res.send('del');
        return;
    }
    // Query to delete player
    query = Session.findOneAndUpdate({'_id': session['_id']}, {'current_players': session['current_players'] - 1});
    await query.exec();
    res.send();
});

router.post('/close', async function(req, res, next) {
    var session_id = req.body['session_id'];
    var query = Session.deleteOne({'session_id': session_id});
    await query.exec();
    res.send();
});

router.get('/', async function(req, res, next) {
    var query = Session.find({status: 'active'})
    .select({
        '-_id':0, 
        'session_name':1,
        'session_id':1,
        'host_id':1, 
        'current_players':1, 
        'max_players':1,
        'status':1
    });
    console.log(await query.exec());
    res.send();
});

module.exports = router;