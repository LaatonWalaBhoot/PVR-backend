const bcrypt = require('bcrypt-nodejs');

async function genPassword(password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password
}

module.exports = genPassword;