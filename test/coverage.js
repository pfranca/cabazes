const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('App - Cabazes de natal', () => {
  describe('Index', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('Families page', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
        .get('/families')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should order families alfabetically', (done) => {
      chai.request(app)
        .get('/families')
        .query({ orderBy: 'name' })
        .end((err, res) => {
          expect(err).to.be.null;
          done();
        });
    });
  });
  describe('Add new person page', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
        .get('/persons/add/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('Adding a new person', () => {
    it('it should return 200 for a sucessfull database insert.', (done) => {
      const person = {
        name: 'MOCHA TEST',
        age: '20',
        school: '15',
        diseasesBool: 'false',
        income: '700',
        deficiente: 'Paralisia cerebral.',
      };
      chai.request(app)
        .post('/persons/add/1')
        .send(person)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('Adding food', () => {
    it('it should return 200 for a sucessfull database insert.', (done) => {
      const food = {
        quantity: 20,
      };
      chai.request(app)
        .post('/food/1/add')
        .send(food)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    describe('Delete family', () => {
      it('it should return 200 for a sucessfull database delete.', (done) => {
        chai.request(app)
          .get('/families/disable/1')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });
});
