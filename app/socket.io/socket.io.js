let SOCKET_IO = {};
let IO = {};
SOCKET_IO.connect = function (io) {
    IO = io;
    let listRoom = [];
    let count = 0;
    io.on('connection', function (socket) {
        console.log('connected socket')
        connectionCount(io.eio.clientsCount, socket.id, 'IN');
        SOCKET_IO.socket = socket;
        socket.on('join-room', function (data) {
            socket.idRoom = data.idConversation;
            socket.username = data.username;
            socket.join(data.idConversation);
            if (!listRoom[data.idConversation]) listRoom[data.idConversation] = [];
            let check = false;
            for (let username of listRoom[data.idConversation]) {
                if (username == data.username) {
                    check = true;
                    break;
                }
            }
            if (!check) listRoom[data.idConversation].push(data.username);
            io.in(data.idConversation).emit('send-members-online', listRoom[data.idConversation]);
        });
        socket.on('sendMessage', function (data) {
            console.log({ data })
            io.in(data.idConversation).emit('sendMessage', data);
        });
        socket.on('off-project', function (data) {
            if (listRoom[data.idConversation]) {
                listRoom[data.idConversation].forEach(function (username, i) {
                    if (username == data.username) listRoom[data.idConversation].splice(i, 1);
                    if (!listRoom[data.idConversation].length) delete listRoom[data.idConversation];
                })
            }
            io.in(data.idConversation).emit('off-project', data);
        });
        socket.on('*', (data) => {
            console.log(data)
        })
        socket.on('disconnect', function () {
            console.log('disconnect')
            connectionCount(io.eio.clientsCount, socket.id, 'OUT');
            listRoom.forEach(function (room, index) {
                room.forEach(function (username, i) {
                    if (username == socket.username) room.splice(i, 1);
                })
                if (!room.length) delete listRoom[index];
            });
            socket.to(socket.idRoom).emit('disconnected', socket.username);
        });
    });
};

module.exports.socket_io = SOCKET_IO;
module.exports.io = IO;

function connectionCount(num, socketId, status) {
    //influx.writePoints([
    //{
    //measurement: 'monitor_socket_chat',
    //tags: { socketId: socketId },
    //fields: { num: num, status: status },
    //}
    //]).catch(err => {
    //next();
    //console.error(`Error saving data to InfluxDB! ${err.stack}`)
    //})
}
