const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const users = require('./fakeData')

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on('join_room', (data) => {
        try {
            socket.join(data);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('send_message', (data) => {
        try {
            socket.broadcast.to(data.room).emit("receive_message", data);
        } catch (error) {
            console.error(error);
        }
    });
});

app.get('/', (req, res) => {
    res.json('hello world');
});

app.post('/login', (req, res) => {
    const login = req.body;
    if(login.nickname === 'Michel' || login.nickname === 'Rafael' || login.nickname === 'Emily'){
        if(login.nickname === "Michel"){
            res.status(200).json(users.Michel);
        }
        if(login.nickname === "Rafael"){
            res.status(200).json(users.Rafael);
        }
        if(login.nickname === "Emily"){
            res.status(200).json(users.Emily);
        }
    } else {
        res.status(401).json({Authorization: false});
    }
});

app.get('/user', (req, res) =>{
    try{
        res.status(200).json([users.Michel, users.Rafael, users.Emily])
    } catch (e){
        res.status(401).json({message: 'server problem'})
    }
})

app.get('/user/:id', (req, res) =>{
    try{
        const {id} = req.params
        if(id == '1'){
            res.status(200).json(users.Michel)
        }
        else if(id == '2'){
            res.status(200).json(users.Rafael)
        }
        else if(id == '3'){
            res.status(200).json(users.Emily)
        }

    } catch (e){
        res.status(401).json({message: 'server problem'})
    }
})

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
