const ScoreboardModel = require('../models/ScoreboardModel.js');
const { Server } = require("socket.io");

/**
 * ScoreboardController.js
 *
 * @description :: Server-side logic for managing Scoreboards.
 */
module.exports = {

    /**
     * ScoreboardController.list()
     */
    list: function (req, res) {
        ScoreboardModel.find(function (err, Scoreboards) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Scoreboard.',
                    error: err
                });
            }

            return res.json(Scoreboards);
        });
    },

    /**
     * ScoreboardController.show()
     */
    show: function (req, res) {
        const id = req.params.id;

        ScoreboardModel.findOne({_id: id}, function (err, Scoreboard) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Scoreboard.',
                    error: err
                });
            }

            if (!Scoreboard) {
                return res.status(404).json({
                    message: 'No such Scoreboard'
                });
            }

            return res.json(Scoreboard);
        });
    },

    /**
     * ScoreboardController.create()
     */
    create: function (req, res) {
        console.log(req.body);

        const Scoreboard = new ScoreboardModel({
			time : req.body.time,
			reset : req.body.reset,
			start : req.body.start,
			teamA : req.body.teamA,
			teamB : req.body.teamB,
			fightersTeamA : req.body.fightersTeamA,
			fightersTeamB : req.body.fightersTeamB,
			pointsTeamA : req.body.pointsTeamA,
			pointsTeamB : req.body.pointsTeamB
        });

        Scoreboard.save(function (err, Scoreboard) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Scoreboard',
                    error: err
                });
            }

            return res.status(201).json(Scoreboard);
        });
    },

    /**
     * ScoreboardController.update()
     */
    update: function (req, res) {
        const id = req.params.id;

        ScoreboardModel.findOne({_id: id}, function (err, Scoreboard) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Scoreboard',
                    error: err
                });
            }

            if (!Scoreboard) {
                return res.status(404).json({
                    message: 'No such Scoreboard'
                });
            }

            Scoreboard.time = req.body.time !== null ? req.body.time : Scoreboard.time;
			Scoreboard.reset = req.body.reset !== null  ? req.body.reset : Scoreboard.reset;
            Scoreboard.start = req.body.start !== null ? req.body.start : Scoreboard.start;
			Scoreboard.teamA = req.body.teamA !== null  ? req.body.teamA : Scoreboard.teamA;
			Scoreboard.teamB = req.body.teamB !== null ? req.body.teamB : Scoreboard.teamB;
			Scoreboard.fightersTeamA = req.body.fightersTeamA !== null ? req.body.fightersTeamA : Scoreboard.fightersTeamA;
			Scoreboard.fightersTeamB = req.body.fightersTeamB !== null ? req.body.fightersTeamB : Scoreboard.fightersTeamB;
			Scoreboard.pointsTeamA = req.body.pointsTeamA !== null ? req.body.pointsTeamA : Scoreboard.pointsTeamA;
			Scoreboard.pointsTeamB = req.body.pointsTeamB !== null ? req.body.pointsTeamB : Scoreboard.pointsTeamB;

            Scoreboard.save(function (err, Scoreboard) {
                console.log(Scoreboard);
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Scoreboard.',
                        error: err
                    });
                }

                return res.json(Scoreboard);
            });
        });
    },

    /**
     * ScoreboardController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;

        ScoreboardModel.findByIdAndRemove(id, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Scoreboard.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
