// var Session = require('../models/session');

// async function delEmptySessions(req, res, next) {
//     var query = Session.deleteMany({'current_players': 0});
//     await query.exec();
//     next();
// }
// module.exports = {
//     delEmptySessions : delEmptySessions
// }