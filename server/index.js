const io = require('socket.io')(80);

const arr_userInfo = [];

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arr_userInfo.some(e => e.ten === user.ten);
        if(isExist) {
            return socket.emit('DANG_KY_THAT_BAI');
        } else {
            socket.peerId = user.peerId;
            arr_userInfo.push(user);
            io.sockets.emit('CO_NGUOI_DUNG_MOI', arr_userInfo);
            socket.emit('DANG_KY_THANH_CONG');
        }
    });
    
    socket.on('CO_NGUOI_NGAT_KET_NOI', () => {
        const index = arr_userInfo.findIndex(user => user.peerId === socket.peerId);
        arr_userInfo.splice(index, 1);
        io.sockets.emit('CO_NGUOI_DUNG_MOI', arr_userInfo);
    });
});


