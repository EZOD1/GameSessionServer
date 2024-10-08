var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
    session_id: {
        type:String, 
        unique: true
    },
    host_ip: String,
    host_port:Number,
    host_id:String,
    session_name:String,
    max_players: Number,
    current_players: {
        type:Number, 
        default: 1
    },
    status: {
        type:String, 
        default:'active'
    },
    password: {
        type:Number, 
        default: 0
    },
}, { versionKey: false });

module.exports = mongoose.model('Session', sessionSchema)