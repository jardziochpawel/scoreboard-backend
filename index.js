require('dotenv').config();
const express = require("express");
const http = require("http");
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { io } = require("./utils/socket");
const Timer = require("easytimer.js").Timer;

const port = 4001;
const index = require("./routes/index");
const Scoreboard = require('./routes/ScoreboardRoutes');
const ScoreboardModel = require('./models/ScoreboardModel');

const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'https://scoreboard-app.niepokorni.pl',
    'http://scoreboard-app.niepokorni.pl',
    'https://scoreboard-app.niepokorni.pl/',
    'http://scoreboard-app.niepokorni.pl/'
];

mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(()=>console.log('Connected to database'))
.catch(err=>console.log(err));

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const timer = new Timer();

const timerApi = ({_id, start, pause, time, reset}, client) => {

    let seconds = ("0" + (Math.floor((time / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
    if(!start && !timer.isRunning()){
        client.emit('timer', minutes +' : '+ seconds);
    }

    if(start && !timer.isRunning()) {
        timer.start({countdown: true, startValues: {seconds: time / 1000}});
    }

    if(pause){
        timer.pause();
    }

    if(reset){
        timer.reset();
        timer.pause();

        ScoreboardModel.findOne({_id: _id}, function (err, Scoreboard) {
            if (err) {
                return console.log('500', err);
            }

            if (!Scoreboard) {
                return console.log('404');
            }

            Scoreboard.reset = false;

            Scoreboard.save(function (err, Scoreboard){
                return client.emit('scoreboard-app-data', Scoreboard);
            })
        });
    }

    timer.addEventListener("secondsUpdated", function (e) {
        if(!timer.isPaused()){
            client.emit('timer', timer.getTimeValues().toString(['minutes', 'seconds']));
        }
    });
}

const server = http.createServer(app);
io.attach(server);
io.on('connection', function (client) {
    client.on('timer-data', data => {
        timerApi(data, client);
    })
    client.on('disconnect', function () {
        console.log('disconnected')
    })
});

app.use(index);
app.use('/scoreboard', Scoreboard);

app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
