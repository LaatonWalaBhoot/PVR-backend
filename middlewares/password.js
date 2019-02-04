const bcrypt = require('bcrypt-nodejs');

async function genPassword(req, res, next) {
    const salt = await bcrypt.genSalt(10);
    req.query.password = await bcrypt.hash(req.query.password, salt);
    next()
}

module.exports = genPassword;