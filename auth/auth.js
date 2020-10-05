const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: function (req, res, next) {
        console.log('1')
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: 'Unauthorized request'
            });
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') return res.status(401).send({
            message: 'Unauthorized request'
        });

        try {
            let user = jwt.verify(token, 'jwtPrivateKey');
            req.user = user;
            next();
        } catch (ex) {
            res.status(400).send({
                message: 'Invalid token.'
            });
        }
    },
    isDoctor: function (req, res, next) {
        console.log(req.user.profile);
        if (req.user.profile != 'Doctor') return res.status(403).send({
            message: 'Access Denied.'
        });
        next();
    },
    isPatient: function (req, res, next) {
        if (req.user.profile != 'Patient') return res.status(403).send({
            message: 'Access Denied.'
        });
        next();
    },
    isAdmin: function (req, res, next) {
        if (req.user.profile != 'Admin') return res.status(403).send({
            message: 'Access Denied.'
        });
        next();
    }
}