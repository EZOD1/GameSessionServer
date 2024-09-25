var request = require('request');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const ip = '192.168.1.72';
const port = '3000';

function testRequest(address, method, postData={}) {
  var clientServerOptions = {
    uri: `https://${ip}:${port}${address}`,
    body: JSON.stringify(postData),
    method: method,
    headers: {'Content-Type': 'application/json'}
  }
  request(clientServerOptions, function (error, response) {
      console.log(response.statusCode, response.body);
      return;
  });
}

postData = {
  password: '12323',
  host_id: 'lox',
  session_name: 'aboba', 
  max_players: 20,
  session_id:'AOICHW',
  status: 'close'
}
// console.log(testRequest('/sessions/', 'POST',postData));
// console.log(testRequest('/sessions/', 'GET'));
// console.log(testRequest('/sessions/join', 'POST', postData));
// console.log(testRequest('/sessions/leave', 'POST', postData));
// console.log(testRequest('/sessions/close', 'POST', postData));
console.log(testRequest('/sessions/change_status', 'POST', postData));