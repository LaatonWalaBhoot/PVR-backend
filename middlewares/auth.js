const jwt = require('jsonwebtoken');
const config = require('config');

function verifyToken(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(403).send(sendError(false, "Verification Error","No token provided"));
    }

    jwt.verify(token, config.get('jwtPrivateKey'), function (err, decoded) {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(402).send(sendError(false, err.name,err.message));
            }
            return res.status(401).send(sendError(false, err.name, err.message));
        }
        next();
    })
}

function createToken(userId) {
    return jwt.sign({_id: userId}, config.get('jwtPrivateKey'), {
        expiresIn: 86400 * 30
    })
}

function sendError(auth, name, message) {
    return {
        auth: auth,
        error: {
            name: name,
            message: message
        }
    }
}

module.exports.sendError = sendError;
module.exports.verifyToken = verifyToken;
module.exports.createToken = createToken;