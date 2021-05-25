const UserModel = require('../models/userModel.js');
const bcrypt = require("bcrypt");

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.create()
     */
    create: function (req, res) {
        const user = new UserModel({
			fullName : req.body.fullName,
			email : req.body.email,
			password_hash : bcrypt.hashSync(req.body.password, 10),
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(400).json({
                    message: 'Error when creating user',
                    error: err
                });
            }
            user.password_hash = undefined;
            return res.status(201).json(user);
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        const id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.fullName = req.body.fullName ? req.body.fullName : user.fullName;
			user.email = req.body.email ? req.body.email : user.email;
			user.createdAt = req.body.createdAt ? req.body.createdAt : user.createdAt;

            if(bcrypt.hashSync(req.body.password, 10) !== user.password_hash){
                user.password_hash = bcrypt.hashSync(req.body.password, 10);
            }

            user.save(function (err, user) {
                if (err) {
                    return res.status(400).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }
                user.password_hash = undefined;
                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }

};
