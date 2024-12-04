var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var makeId = require('../modules/makeId');
var checkSessionIdCorrect = require('../modules/checkSessionIdCorrect')

// Clear database after server restart
async function clearDB () {
  var clearDBQuery = Session.deleteMany();
  await clearDBQuery.exec();
}
clearDB();

// POST requests
// POST request /sessions/
router.post('/', async function(req, res, next) {
  // Getting host ip from request body
  var host_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  host_ip = host_ip.toString().replace('::ffff:', '');
  
  // Session filling
  var session = new Session({
    session_id: makeId(), 
    host_ip: host_ip, 
    host_port:req.body['host_port'],
    host_id:req.body['host_id'] || null,
    session_name:req.body['session_name'],
    max_players: req.body['max_players'] || 1,
    status:req.body['status'] || 'active',
    password: req.body['password'] || 0
  });

  // Saving a session
  try{
    await session.save();
  } catch (MongoServerError) {
    // Duplicate key error collection
    if (MongoServerError.code === 11000) {
      session.session_id = makeId();
      await session.save();
    };
  };

  res.json(201, {session_id: session.session_id});
});

// POST request /sessions/join 
router.post('/join', async function(req, res, next) {
  // Getting session_id and password from request body
  var session_id = req.body['session_id'];
  var password = req.body['password'] || null;

  // Сhecking the id for presence in the database
  if (!await checkSessionIdCorrect(session_id)) {
    res.status(500).send('The session_id is either incorrect or missing')
    return;
  }
  // Query to find session by session_id
  var query = Session.find({'session_id': session_id})
  .select({
    '_id':0,
    'status':1,
    'password':1,
    'host_ip':1,
    'host_port':1,
    'max_players':1,
    'current_players':1,
  });
  // Get session data
  try {
    var session = (await query.exec())[0];
  } catch (error) {
    res.status(500).send(error);
    return;
  };

  // Password authentication
  if (session['status'] != 'active') {
    if (session['password'] != password) {
      res.status(500).send('Incorrect password')
      return;
    };
  };
  // Fullness check
  if (session['max_players'] === session['current_players']) {
    res.status(500).send('The session is full');
    return;
  };

  // Query to add player to session by _id
  query = Session.findOneAndUpdate({'session_id': session_id}, {'current_players': session['current_players'] + 1});
  // Add player to session
  try {
    await query.exec();
  } catch (error) {
    res.status(500).send(error.name);
  };

  res.status(200).json({'host_ip': session['host_ip'], 'host_port': session['host_port']});
});

// POST request /sessions/leave 
router.post('/leave', async function(req, res, next) {
  // Getting session_id from request body
  var session_id = req.body['session_id'];
  // Сhecking the id for presence in the database
  if (!await checkSessionIdCorrect(session_id)) {
    res.status(500).send('The session_id is either incorrect or missing')
    return;
  };
  
  // Query to find session by session_id
  var query = Session.find({'session_id': session_id})
  .select({
    '_id':0,
    'current_players':1,
  });
  // Getting session data
  try {
    var session = (await query.exec())[0];
  } catch (error) {
    res.status(500).send(error.name);
    return;
  };

  // Query to delete player by _id
  query = Session.findOneAndUpdate(
    {'session_id': session_id}, 
    {'current_players': session['current_players'] - 1}
  );
  // Deleting player
  try {
    await query.exec();
  } catch (error) {
    res.status(500).send(error.name);
    return;
  }

  res.status(200).send('You have logged out of the session');

  // Close session
  if (session['current_players'] === 1) {
    query = Session.deleteOne({'session_id': session_id});
    await query.exec();
  };
});

// POST request /sessions/close
router.post('/close', async function(req, res, next) {
  // Getting session_id from request body
  var session_id = req.body['session_id'];
  // Сhecking the id for presence in the database
  if (!await checkSessionIdCorrect(session_id)) {
    res.status(500).send('The session_id is either incorrect or missing')
    return;
  };

  // Query to delete session by session_id
  var query = Session.deleteOne({'session_id': session_id});
  // Deleting a session
  try {
    await query.exec();
  } catch (error) {
    res.status(500).send(error.name);
    return;
  };

  res.status(204).send('Session has been deleted');
});

// PUT request /sessions/change_status
router.put('/change_status', async function(req, res, next) {
  // Getting session_id and status from request body
  var session_id = req.body['session_id'];
  var status = req.body['status'] || null;
  var password = req.body['password'] || null;

  // Сhecking the id for presence in the database
  if (!await checkSessionIdCorrect(session_id)) {
    res.status(500).send('The session_id is either incorrect or missing')
    return;
  };
  // Checking the status
  if (!status) {
    res.status(500).send('Status is missing')
    return;
  }
  // Checking password
  if (status === 'close' && !password) {
    res.status(500).send('Password is missing');
    return;
  }

  // Query to update session by session_id
  if (status === 'active') {
    var query = Session.findOneAndUpdate({'session_id': session_id}, {'status': status, 'password':0});
  } 
  else {
    var query = Session.findOneAndUpdate({'session_id': session_id}, {'status': status, 'password':password});
  }
  
  // Updating a session
  try {
    await query.exec();
  } catch (error) {
    res.status(500).send(error.name);
    return;
  };

  res.status(200).send('Session status has been updated');
});

// GET requests
// GET request /sessions/
router.get('/', async function(req, res, next) {
  // Query get all active sessions
  var query = Session.find()
  .select({
    '-_id':0, 
    'session_name':1,
    'session_id':1,
    'host_id':1, 
    'current_players':1, 
    'max_players':1,
    'status':1
  });
  // Gettins a sessions
  try {
    var activeSessions = (await query.exec());
  } catch (error) {
    res.status(500).send(error.name);
    return;
  };

  res.status(200).json(activeSessions);
});

module.exports = router;