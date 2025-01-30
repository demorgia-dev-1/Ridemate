const app = require('../src/index');
const request = require('supertest');

desceribe('Test the users',() => {
  it ('Add valid user', async() => { 
  const res = await request(app)
 .post('/users')
 .send({
   "firstName": 'John',
   "lastName": 'Doe',
   "email": 'abc@abc.com',
    "password": 'Password123' 
  });
  expect(res.status).toBe(201);
  done();
})
})  
