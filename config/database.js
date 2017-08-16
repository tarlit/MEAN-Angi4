const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/meanangi4',
    secret: crypto,
    db: 'meanangi4'
}