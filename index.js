const debug = require('debug')('middleware-sanitizeurl');

const defaults = {
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
  const options = { ...defaults, ...opts };

  return (req, res, next) => {
    const { originalUrl } = req;

    try {
      decodeURIComponent(originalUrl);
    } catch (err) {
      const url = options.redirectTo;
      debug(`couldn't parse ${originalUrl}, redirecting to ${url}`);
      return res.redirect(301, url);
    }

    const safeUrl = getSafeUrl(originalUrl);

    if (originalUrl !== safeUrl) {
      debug(`${originalUrl} isn't valid, redirecting to ${safeUrl}`);
      return res.redirect(301, safeUrl);
    }

    next();
  };
};
