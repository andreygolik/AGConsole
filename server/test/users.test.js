const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const tokens = require('./test_tokens.json');

chai.use(chaiHttp);

const app = require('../app.js');

const testUser = {
  login: 'mocha_test_user',
  password: 'MochaTestPassword*(123)',
  role: 'USER',
  profile: {
    firstName: 'Mocha',
    lastName: 'Test User',
  },
  disabled: false,
};

let testUserToken;
const randomID = '5a2b322fd43cf3624dd50000';

describe('API endpoint /users', function () {
  this.timeout(5000); // how long to wait for a response (ms)

  before(() => {

  });

  after(() => {

  });

  // POST /users --------------------------------------------------------------
  describe('POST /users', function () {
    it('should return 401 without authorization token', function (done) {
      chai.request(app)
        .post('/api/users')
        .send({})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 with user\'s token', function (done) {
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.user)
        .send({})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should create user with admin\'s token', function (done) {
      let user = Object.assign({}, testUser);
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.admin)
        .send(user)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          expect(res.body._id).to.be.an('string');
          expect(res.body.success).to.be.true;
          testUser._id = res.body._id;
          done();
        });
    });

    it('should not create another user with the same login', function (done) {
      let user = Object.assign({}, testUser);
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.admin)
        .send(user)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should return 400 without login field', function (done) {
      let user = Object.assign({}, testUser);
      delete user.login;
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.admin)
        .send(user)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should return 400 without password field', function (done) {
      let user = Object.assign({}, testUser);
      delete user.password;
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.admin)
        .send(user)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should return 400 with short password', function (done) {
      let user = Object.assign({}, testUser);
      user.password = 'Qwd#!10'; // length < 8
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.admin)
        .send(user)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should return 400 with random role', function (done) {
      let user = Object.assign({}, testUser);
      user.password = 'WRONG';
      chai.request(app)
        .post('/api/users')
        .set('Authorization', tokens.admin)
        .send(user)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  // PATCH /users -------------------------------------------------------------
  describe('PATCH /users/:id', function () {
    it('should return 401 without authorization token', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .send({profile: {firstName: testUser.profile.firstName + '2'}})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 with user\'s token', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.user)
        .send({profile: {firstName: testUser.profile.firstName + '3'}})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 404 for bad id', function (done) {
      chai.request(app)
        .patch('/api/users/12345')
        .set('Authorization', tokens.admin)
        .send({profile: {firstName: testUser.profile.firstName + '4'}})
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should return 404 for random id', function (done) {
      chai.request(app)
        .patch(`/api/users/${randomID}`)
        .set('Authorization', tokens.admin)
        .send({profile: {firstName: testUser.profile.firstName + '5'}})
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should return 400 if nothing to change', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({someParam: 'something'})
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should change firstName', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({profile: {firstName: testUser.profile.firstName + '0'}})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should change lastName', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({profile: {lastName: testUser.profile.lastName + '0'}})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should change login', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({login: testUser.login + '0'})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should change role', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({role: 'USER'})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should change disabled flag', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({disabled: true})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should return 400 for short password', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({password: 'asd'})
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should change password', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({password: 'asdasdasd0'})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('get should return patched user', function (done) {
      chai.request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body._id).to.be.string(testUser._id);
          expect(res.body.login).to.be.string(testUser.login + '0');
          expect(res.body.role).to.be.string('USER');
          expect(res.body.disabled).to.be.true;
          expect(res.body.profile).to.be.an('object');
          expect(res.body.profile.firstName).to.be.string(testUser.profile.firstName + '0');
          expect(res.body.profile.lastName).to.be.string(testUser.profile.lastName + '0');
          done();
        });
    });

    it('should change user back to testUser', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send(testUser)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('get should return patched back user', function (done) {
      chai.request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body._id).to.be.string(testUser._id);
          expect(res.body.login).to.be.string(testUser.login);
          expect(res.body.role).to.be.string(testUser.role);
          expect(res.body.disabled).to.be.false;
          expect(res.body.profile).to.be.an('object');
          expect(res.body.profile.firstName).to.be.string(testUser.profile.firstName);
          expect(res.body.profile.lastName).to.be.string(testUser.profile.lastName);

          // console.log(res.body);

          done();
        });
    });
  });

  // GET /users ---------------------------------------------------------------
  describe('GET /users', function () {
    it('should return 401 without authorization token', function (done) {
      chai.request(app)
        .get('/api/users')
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 with user\'s token', function (done) {
      chai.request(app)
        .get('/api/users')
        .set('Authorization', tokens.user)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 200 and contain created user', function (done) {
      chai.request(app)
        .get('/api/users')
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.length.above(0);
          expect(res.body[0]).to.have.property('_id');
          expect(res.body[0]).to.have.property('login');
          expect(res.body[0]).to.have.property('role');
          done();
        });
    });
  });

  // GET /users/:id -----------------------------------------------------------
  describe('GET /users/:id', function () {
    it('should return 401 without authorization token', function (done) {
      chai.request(app)
        .get(`/api/users/${testUser._id}`)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 with user\'s token', function (done) {
      chai.request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.user)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 404 for bad id', function (done) {
      chai.request(app)
        .get('/api/users/12345')
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should return 404 for random id', function (done) {
      chai.request(app)
        .get(`/api/users/${randomID}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should return 200 and user', function (done) {
      chai.request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('login');
          expect(res.body).to.have.property('role');
          expect(res.body._id).to.be.string(testUser._id);
          expect(res.body.login).to.be.string(testUser.login);
          expect(res.body.role).to.be.string('USER');
          done();
        });
    });
  });

  // GET /users/login/:login --------------------------------------------------
  describe('GET /users/login/:login', function () {
    it('should return 401 without authorization token', function (done) {
      chai.request(app)
        .get(`/api/users/login/${testUser.login}`)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 with user\'s token', function (done) {
      chai.request(app)
        .get(`/api/users/login/${testUser.login}`)
        .set('Authorization', tokens.user)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 404 for random login', function (done) {
      chai.request(app)
        .get('/api/users/login/some_random_login_qwerty')
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should return 200 and user', function (done) {
      chai.request(app)
        .get(`/api/users/login/${testUser.login}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('login');
          expect(res.body).to.have.property('role');
          expect(res.body._id).to.be.string(testUser._id);
          expect(res.body.login).to.be.string(testUser.login);
          expect(res.body.role).to.be.string('USER');
          done();
        });
    });
  });

  // AUTHENTICATION -----------------------------------------------------------
  describe('AUTHENTICATION /login & /logout', function () {
    it('should return 401 for missed credentials', function (done) {
      chai.request(app)
        .post('/api/auth/login')
        .end(function (err, res) {
          expect(res).to.have.status(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.string('Missing credentials');
          done();
        });
    });

    it('should return 401 for wrong login', function (done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          login: testUser.login + '9',
          password: testUser.password,
        })
        .end(function (err, res) {
          expect(res).to.have.status(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.string('Authentication failed. Invalid login credentials.');
          done();
        });
    });

    it('should return 401 for wrong password', function (done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          login: testUser.login,
          password: testUser.password + '9',
        })
        .end(function (err, res) {
          expect(res).to.have.status(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.string('Authentication failed. Invalid login credentials.');
          done();
        });
    });

    it('should successfully log in user', function (done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          login: testUser.login,
          password: testUser.password,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          expect(res.body.token).to.be.an('string');
          expect(res.body.user).to.be.an('object');
          expect(res.body.user).to.have.property('_id');

          testUserToken = res.body.token;
          done();
        });
    });

    it('should return 200 for valid token', function (done) {
      chai.request(app)
        .get('/api/auth/check-token')
        .set('Authorization', testUserToken)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should return 401 for invalid token', function (done) {
      chai.request(app)
        .get('/api/auth/check-token')
        .set('Authorization', testUserToken + '123')
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 for user\'s token', function (done) {
      chai.request(app)
        .get('/api/auth/check-admin')
        .set('Authorization', testUserToken)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 200 for /logout', function (done) {
      chai.request(app)
        .get('/api/auth/logout')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should return 401 for disabled user', function (done) {
      chai.request(app)
        .patch(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .send({disabled: true})
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;

          chai.request(app)
            .post('/api/auth/login')
            .send({
              login: testUser.login,
              password: testUser.password,
            })
            .end(function (err, res) {
              expect(res).to.have.status(401);
              expect(res).to.be.json;
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.be.string('Authentication failed. User disabled.');
              done();
            });
        });
    });
  });

  // DELETE /users ------------------------------------------------------------
  describe('DELETE /users', function () {
    it('should return 401 without authorization token', function (done) {
      chai.request(app)
        .delete(`/api/users/${testUser._id}`)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 with user\'s token', function (done) {
      chai.request(app)
        .delete(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.user)
        .send({})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 404 for bad user id', function (done) {
      chai.request(app)
        .delete('/api/users/12345')
        .set('Authorization', tokens.admin)
        .send({})
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should return 404 for random user id', function (done) {
      chai.request(app)
        .delete(`/api/users/${randomID}`)
        .set('Authorization', tokens.admin)
        .send({})
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });

    it('should delete user with admin\'s token', function (done) {
      chai.request(app)
        .delete(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          expect(res.body._id).to.be.string(testUser._id);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('should return 404 for deleted user', function (done) {
      chai.request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', tokens.admin)
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
