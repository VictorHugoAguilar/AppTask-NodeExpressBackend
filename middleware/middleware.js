const config = require('../config/config');

module.exports = {
    isValidDomain: (req, res, next) => {
        if (['http://localhost:5000'].includes(req.headers.origin)) {
            return next();
        }
        return res.status(401).send({
            err: 'err-invalid-origin-domain',
            origin: req.headers.origin
        });
    }
};