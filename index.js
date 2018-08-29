const { info } = require('winston');

const defaults = {
  log: false,
  redirectTo: '/',
};

const getSafeUrl = (originalUrl) => {
  const [href, ...qs] = originalUrl.split('?');

  const safeHref = href.replace(/\/+/g, '/');
  const safeQs = qs.join('&');

  let url = safeHref;
  if (safeQs.length) url += `?${safeQs}`;

  return url;
};

module.exports = (opts) => {
  const options = Object.assign({}, defaults, opts);

  return (req, res, next) => {
    const { originalUrl } = req;

    try {
      decodeURIComponent(originalUrl);
    } catch (err) {
      const url = options.redirectTo;
      if (options.log) info(`couldn't parse ${originalUrl}, redirecting to ${url}`);
      return res.redirect(301, url);
    }

    const safeUrl = getSafeUrl(originalUrl);

    if (originalUrl !== safeUrl) {
      if (options.log) info(`${originalUrl} isn't valid, redirecting to ${safeUrl}`);
      return res.redirect(301, safeUrl);
    }

    next();
  };
};
