const UserModel = require('../models/userModel.js');
const jwt = require("jsonwebtoken");

module.exports = {

    sign_in : async function(req, res) {
        const email = req.body.email
        const password = req.body.password

        //find user exist or not
        await UserModel.findOne({ email: email }).then(user => {
            if (!user || !user.comparePassword(password, user.password_hash)) {
                return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
            }
            return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs') });
        })
    }
}