// const request = require('supertest');

// var app = require('./app').app;

// it('should return Hello Test', function (done) {
//     request(app).get('/').expect('Hello Test').end(done);
// });
var request = require('request');
// postData = {
//     password: 123,
//     host_id: 'lox',
//     session_name: 'aboba', 
//     max_players: 20,
// }
// function test(postData){
//     var clientServerOptions = {
//         uri: 'http://'+'192.168.1.72:3000/sessions/',
//         body: JSON.stringify(postData),
//         method: 'POST',
//         headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//             request(clientServerOptions, function (error, response) {
//                 console.log(error,response.body);
//                 return;
//             });
// }
postData = {
        // password: 123,
        session_id:'QSNPWX'
    }
function test(postData){
    var clientServerOptions = {
        uri: 'http://'+'192.168.1.72:3000/sessions/close',
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
                    'Content-Type': 'application/json'
                }
            }
            request(clientServerOptions, function (error, response) {
                console.log(error,response.body);
                return;
            });
}
console.log(test(postData))
console.log()