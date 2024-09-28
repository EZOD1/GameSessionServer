process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var should = require('should');

var postData = {
  password: '12323',
  host_id: 'test',
  session_name: 'test_name', 
  max_players: 20,
  session_id:'',
  status: 'close'
}

describe('sessions', function() {
  // GET 
  it('should get all active sessions', async function() {
    const response = await fetch("https://localhost:3000/sessions/");
    response.status.should.equal(200);
  });

  // POST
  // POST /sessions/
  it('should create new session', async function() {
    const request = new Request("https://localhost:3000/sessions/", {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(201);
    postData['session_id'] = (await response.json())['session_id'];
  });

  // POST /sessions/join
  it('should cause an error due to missing ID', async function() {
    const request = new Request("https://localhost:3000/sessions/join", {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });

  it('should cause an error due to an incorrect password', async function() {
    const request = new Request("https://localhost:3000/sessions/join", {
      method: 'POST',
      body: JSON.stringify({session_id:postData['session_id']}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });

  it('should add player to session', async function() {
    const request = new Request("https://localhost:3000/sessions/join", {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(200);
  });

  // POST /sessions/leave
  it('should cause an error due to missing ID', async function() {
    const request = new Request("https://localhost:3000/sessions/leave", {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });

  it('should disconnect the player from the session', async function() {
    const request = new Request("https://localhost:3000/sessions/leave", {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(200);
  });

  // PUT /sessions/change_status
  it('should cause an error due to missing ID', async function() {
    const request = new Request("https://localhost:3000/sessions/change_status", {
      method: 'PUT',
      body: JSON.stringify({}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });
  
  it('should cause an error due to missing status', async function() {
    const request = new Request("https://localhost:3000/sessions/change_status", {
      method: 'PUT',
      body: JSON.stringify({session_id:postData['session_id']}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });

  it('should cause an error due to missing password', async function() {
    const request = new Request("https://localhost:3000/sessions/change_status", {
      method: 'PUT',
      body: JSON.stringify({session_id:postData['session_id'], status:'close'}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });

  it('should change the status of the session', async function() {
    const request = new Request("https://localhost:3000/sessions/change_status", {
      method: 'PUT',
      body: JSON.stringify({session_id:postData['session_id'], status:'active'}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(200);
  });

  // POST /sessions/close
  it('should cause an error due to missing ID', async function() {
    const request = new Request("https://localhost:3000/sessions/close", {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(500);
  });

  it('should delete session', async function() {
    const request = new Request("https://localhost:3000/sessions/close", {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {"Content-Type": "application/json"}
    });
    const response = await fetch(request);
    response.status.should.equal(204);
  });
});

