// Include config and modules
const moment = require('moment');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/userModel');

// Authentication Middleware

module.exports = {
    ensureAuthenticated: async function (req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).send({ error: 'TokenMissing' });
        }
        const token = req.headers.authorization.split(' ')[1];

        let payload = null;
        try {
            payload = jwt.decode(token, 10);
        }
        catch (err) {
            return res.status(401).send({ error: "TokenInvalid" });
        }

        // check if the user exists
        await UserModel.findById({'_id': payload._id}, function(err, user){
            if (!user){
                return res.status(401).send({error: 'User Not Found'});
            } else {
                req.user = payload;
                next();
            }
        });
    }
};