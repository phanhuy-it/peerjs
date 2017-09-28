const socket = io('https://phanhuypeerjs.herokuapp.com/');


$('#boxChat').hide();

function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({ key: 'peerjs', host: 'https://phanhuypeerjs.herokuapp.com/', secure: 'true', port: '443' });
peer.on('open', id => {
    $('#id_peer').append(id);
    $('#btnSignup').click(() => {
        const username = $('#userName').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id});
    });

});

socket.on('CO_NGUOI_DUNG_MOI', arr_userInfo => {
    $('#onlineUsers').html('');
    arr_userInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#onlineUsers').append(`<p id="${peerId}" class="user">${peerId} : <span class="name">${ten}</span></p>`)
    });
    socket.on('CO_NGUOI_NGAT_KET_NOI', peerId => {
        $('#${peerId}').remove();
    });
});

socket.on('DANG_KY_THAT_BAI', () => {
    alert('Vui long nhap User Name khac');
});

socket.on('DANG_KY_THANH_CONG', () => {
    $('#boxChat').show();
    $('#boxSignup').hide();
});

$('#btnLogout').click(function() {
    socket.emit('CO_NGUOI_NGAT_KET_NOI');
    $('#boxChat').hide();
    $('#boxSignup').show();
});






// Caller
$('#buttonRemote').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


$('#onlineUsers').on('click', 'p', function() {
    var id = $(this).attr('id');
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});