const chai = require('chai');
const spies = require('chai-spies');

const middleware = require('../index')();

chai.use(spies);
const { expect } = chai;


describe('SanitizeUrl suite', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      originalUrl: '',
    };

    res = {
      redirect: chai.spy(() => {}),
    };

    next = chai.spy(() => {});
  });


  it('url with weird characters', () => {
    req.originalUrl += '/%c0%ae%c0%ae';

    middleware(req, res, next);
    expect(next).to.not.have.been.called();
    expect(res.redirect).to.have.been.called.once;
    expect(res.redirect).to.have.been.called.with(301, '/');
  });

  it('url with double query string', () => {
    req.originalUrl += '/some/such?query=yes&more=yes?what=haha&another=query!';

    middleware(req, res, next);
    expect(next).to.not.have.been.called();
    expect(res.redirect).to.have.been.called.once;
    expect(res.redirect).to.have.been.called.with(301, '/some/such?query=yes&more=yes&what=haha&another=query!');
  });

  it('regular url', () => {
    req.originalUrl += '/regular/url';

    middleware(req, res, next);
    expect(res.redirect).to.not.have.been.called();
    expect(next).to.have.been.called.once;
  });

  it('regular url with query string', () => {
    req.originalUrl += '/regular/url?search=things';

    middleware(req, res, next);
    expect(res.redirect).to.not.have.been.called();
    expect(next).to.have.been.called.once;
  });
});
