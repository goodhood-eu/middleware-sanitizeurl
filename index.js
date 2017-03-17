const { info } = require('winston');

const logUrl = (url) => { info(`malformed URL, redirecting to ${url}`); };

const defaults = {
  log: false,
  redirectTo: '/',
};

module.exports = (opts) => {
  const options = Object.assign({}, defaults, opts);

  return (req, res, next) => {
    try {
      decodeURIComponent(req.originalUrl);
    } catch (err) {
      const url = options.redirectTo;
      if (options.log) logUrl(url);
      return res.redirect(301, url);
    }

    const [href, ...qs] = req.originalUrl.split('?');

    // double question mark in query string fix
    if (qs.length > 1) {
      const url = `${href}?${qs.join('&')}`;
      if (options.log) logUrl(url);
      return res.redirect(301, url);
    }

    next();
  };
};
