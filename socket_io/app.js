const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const SocketIO = require('socket.io');
const app = express();

app.set('view', './view');

app.use(cors());
app.use(morgan('dev'));

const PORT = 8000;

app.get('/', (req, res)=> {
    res.sendFile(__dirname+'/index.html')
})

const server = app.listen(PORT, ()=> {
    console.log('server start');
});

const io = SocketIO(server, { path: '/socket.io'});

io.on('connection', (socket)=> {
    io.emit('chat message', 'some users connection');
    console.log('user connection');
    socket.on('disconnect', ()=> {
        console.log('disconnection');
    });

    socket.on('chat message', (msg)=> {
        console.log('message : ' + msg);
        io.emit('chat message', msg);
    });
})

