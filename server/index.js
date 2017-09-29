const io = require('socket.io')(3000);


const arrUserInfo = [];

io.on('connection', socket => {
    // console.log(socket.id);

    socket.on('NGUOI_DUNG_DANG_KY', user => {
        socket.peerId = user.peerId;
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        if(isExist) {
            return socket.emit('DANG_KY_THAT_BAI')
        } else {
            arrUserInfo.push(user);
            io.sockets.emit('DANH_SACH_USER_ONLINE', arrUserInfo);
            socket.emit('DANG_KY_THANH_CONG');
        }
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex( user => user.peerId === socket.peerId );
        arrUserInfo.splice(index, 1);
        io.sockets.emit('DANH_SACH_USER_ONLINE', arrUserInfo);
    });

    socket.on('NGUOI_DUNG_DA_THOAT', peerId => {
        const index = arrUserInfo.findIndex( user => user.peerId === peerId );
        arrUserInfo.splice(index, 1);
        io.sockets.emit('DANH_SACH_USER_ONLINE', arrUserInfo);
        socket.emit('DA_THOAT_THANH_CONG');
    });

    socket.on('NGUOI_DUNG_GOI_DI', id => {
        const isExist = arrUserInfo.some(e => e.peerId === id);
        if(isExist) {
            socket.emit('GOI_DI_THANH_CONG', id);
        } else {
            socket.emit('GOI_DI_THAT_BAI');
        }
    });
});