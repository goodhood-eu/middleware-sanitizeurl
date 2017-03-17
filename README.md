middleware-sanitizeurl
======================

ExpressJS middleware that checks request URL for potentially breaking things, such as:
 - Unparsable query string sequences that would crash on attempt to parse on the client side
 - Double question mark in URL

## Options:
 - `log (bool)`: When set to `true`, will log redirects with `winston` module, default: `false`
 - `redirectTo (string)`: When url contains breaking character sequences, redirect to this URL, default: `'/'`

## Usage:

```javascript
app.use(require('middleware-sanitizeurl')({ log: true }));
```
