var Session = require('../models/session');

async function checkSessionIdCorrect(session_id) {
  // If session_id is not specified
  if (!session_id) {
    return false;
  }

  // Query to find session by session_id
  var query = Session.find({'session_id': session_id})
  try {
    var session = (await query.exec())[0];
  } catch (error) {
    logMyErrors(error);
    return;
  };
  // If session not found
  if (!session) {
    return false;
  };

  return true;
}

module.exports = checkSessionIdCorrect;