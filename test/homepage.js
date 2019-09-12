const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
describe('App - Cabazes de natal', () => {
  describe('Index', () => {
    it('responds with status 200', (done) => {
      chai.request('localhost:3666')
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
