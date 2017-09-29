//Set up server
const socket = io('http://localhost:3000');

function openStream() {
	const config = { audio: false, video: true };
	return navigator.mediaDevices.getUserMedia( config );
}

function playStream(idVideoTag, stream) {
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}

const peer = new Peer({ key: 'tkv5g2acaree9udi' });
peer.on('open', id => {
    $('#idPeer').html(id);
    
    //Sign Up
    $('#btnSignup').click(() => {
        const username = $('#txtUserName').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });

    $('#btnLogout').click(() => {
        socket.emit('NGUOI_DUNG_DA_THOAT', id);
    });
    
    //load danh sach user online
    socket.on('DANH_SACH_USER_ONLINE', arrUserInfo => {
        $('#onlineUsers').html('');
        arrUserInfo.forEach(user => {
            if(user.peerId !== id) {
                const { ten, peerId } = user;
                $('#onlineUsers').append(`<p class="user" id="${peerId}">${ten}</p>`)
            }
        });
    });
});

$('#boxSignup').show();
$('#boxChat').hide();


socket.on('DANG_KY_THAT_BAI', () => {
    alert('Nguoi dung da ton tai');
});

socket.on('DANG_KY_THANH_CONG', () => {
    $('#boxSignup').hide();
    $('#boxChat').show();
});

socket.on('DA_THOAT_THANH_CONG', () => {
    $('#txtUserName').val('');
    $('#boxSignup').show();
    $('#boxChat').hide();
});


//Caller
$('#buttonRemote').click(() => {
    const id = $('#remoteId').val();
    socket.emit('NGUOI_DUNG_GOI_DI', id);
});

$('#onlineUsers').on('click', 'p', function() {
    var peerId = $(this).attr('id');
    socket.emit('NGUOI_DUNG_GOI_DI', peerId);
});

socket.on('GOI_DI_THANH_CONG', id => {
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

socket.on('GOI_DI_THAT_BAI', () => {
    alert('Khong co dia chi nay');
});

peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


