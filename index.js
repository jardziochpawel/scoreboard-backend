require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = 4001;
const index = require("./routes/index");
const Scoreboard = require('./routes/ScoreboardRoutes');
const ScoreboardModel = require('./models/ScoreboardModel.js');

const app = express();
const allowedOrigins = [
    'http://localhost:3000',
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

app.use(index);
app.use('/scoreboard', Scoreboard);

app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

const server = http.createServer(app);
const io = new Server(server);
let interval;

io.on("connection", (socket) => {
    console.log('New Connection');

    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit  = async (socket) => {
    await ScoreboardModel.findOne({_id: '60a17e5c75ef8d9af22dd94c'}, function (err, Scoreboard) {
        if (err) {
            console.log(err);
        }
        if (!Scoreboard) {
            console.log('404');
        }
        socket.emit('scoreboard-app-data', Scoreboard);
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));