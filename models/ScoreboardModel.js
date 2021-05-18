const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ScoreboardSchema = new Schema({
	'time' : Number,
	'reset' : Boolean,
	'start' : Boolean,
	'teamA' : {
		label: { type: String },
		logo: { type: String },
		value: { type: String }
	},
	'teamB' : {
		label: { type: String },
		logo: { type: String },
		value: { type: String }
	},
	'fightersTeamA' : Number,
	'fightersTeamB' : Number,
	'pointsTeamA' : Number,
	'pointsTeamB' : Number
});

module.exports = mongoose.model('Scoreboard', ScoreboardSchema);
