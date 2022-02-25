var mapPeers = {};

const localVideo = document.querySelector("#local-video");

var localStream = new MediaStream();

btnToggleAudio = document.querySelector("#btn-toggle-audio");
btnToggleVideo = document.querySelector("#btn-toggle-video");

var messageInput = document.querySelector("#msg");
var btnSendMsg = document.querySelector("#btn-send-msg");

var ul = document.querySelector("#message-list");

var room_id = JSON.parse(document.getElementById("json-room_id").textContent);

var start = "";
if (window.location.protocol == "https:") {
  start = "wss";
} else {
  start = "ws";
}

var endPoint = `${start}://${window.location.host}/${start}/${room_id}/`;

var webSocket;

var usernameInput = document.querySelector("#username");
var username;

var btnJoin = document.querySelector("#btn-join");

btnJoin.onclick = (e) => {
  username = usernameInput.value;
  if (username == "") {
    return alert(`The Username can't be Null!`);
  }
  document.getElementById("complete-div").remove();

  webSocket = new WebSocket(endPoint);
  webSocket.onopen = function (e) {
    sendSignal("new-peer");
  };

  webSocket.onmessage = webSocketOnMessage;

  webSocket.onclose = function (e) { };

  webSocket.onerror = function (e) { };

  btnSendMsg.disabled = false;
  messageInput.disabled = false;
};

function webSocketOnMessage(event) {
  var parsedData = JSON.parse(event.data);

  var action = parsedData["action"];
  var peerUsername = parsedData["peer"];

  if (peerUsername == username) {
    return;
  }

  var receiver_channel_name = parsedData["message"]["receiver_channel_name"];

  if (action == "new-peer") {
    createOfferer(peerUsername, receiver_channel_name);
    return;
  }

  if (action == "new-offer") {
    var offer = parsedData["message"]["sdp"];
    var peer = createAnswerer(offer, peerUsername, receiver_channel_name);

    return;
  }

  if (action == "new-answer") {
    var peer = null;
    peer = mapPeers[peerUsername][0];
    var answer = parsedData["message"]["sdp"];
    peer.setRemoteDescription(answer);
    return;
  }
}

messageInput.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    btnSendMsg.click();
  }
});

btnSendMsg.onclick = btnSendMsgOnClick;

function btnSendMsgOnClick() {
  var message = messageInput.value;
  if (message === "") {
    // alert("The Message Cant be Empty!");
    Swal.fire({
      icon: "error",
      title: "Oops ...",
      text: `Message Can't be Empty!`,
    });
  }
  if (message !== "") {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode("Me: " + message));
    ul.appendChild(li);
    var dataChannels = getDataChannels();
    for (index in dataChannels) {
      dataChannels[index].send(username + ": " + message);
    }
    messageInput.value = "";
  }
}

const constraints = {
  video: true,
  audio: true,
};

userMedia = navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    localStream = stream;
    localVideo.srcObject = localStream;
    localVideo.muted = true;

    window.stream = stream;

    audioTracks = stream.getAudioTracks();
    videoTracks = stream.getVideoTracks();

    audioTracks[0].enabled = true;
    videoTracks[0].enabled = true;

    btnToggleAudio.onclick = function () {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      if (audioTracks[0].enabled) {
        btnToggleAudio.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        return;
      }
      btnToggleAudio.innerHTML = `<i class="fas fa-microphone"></i>`;
    };

    btnToggleVideo.onclick = function () {
      videoTracks[0].enabled = !videoTracks[0].enabled;
      if (videoTracks[0].enabled) {
        btnToggleVideo.innerHTML = `<i class="fas fa-video-slash"></i>`;
        return;
      }
      btnToggleVideo.innerHTML = `<i class="fas fa-video"></i>`;
    };
  })
  .catch((error) => {
    console.error("Error accessing media devices.", error);
  });

function sendSignal(action, message) {
  webSocket.send(
    JSON.stringify({
      peer: username,
      action: action,
      message: message,
      room_id: room_id,
    })
  );
}

function createOfferer(peerUsername, receiver_channel_name) {
  var peer = new RTCPeerConnection(null);
  addLocalTracks(peer);
  var dc = peer.createDataChannel("channel");
  dc.onopen = () => {
    console.log("Connection opened.");
  };
  var remoteVideo = null;

  dc.onmessage = dcOnMessage;

  remoteVideo = createVideo(peerUsername);
  setOnTrack(peer, remoteVideo);
  mapPeers[peerUsername] = [peer, dc];

  peer.oniceconnectionstatechange = () => {
    var iceConnectionState = peer.iceConnectionState;
    if (
      iceConnectionState === "failed" ||
      iceConnectionState === "disconnected" ||
      iceConnectionState === "closed"
    ) {
      delete mapPeers[peerUsername];
      if (iceConnectionState != "closed") {
        peer.close();
      }
      removeVideo(remoteVideo);
    }
  };
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      return;
    }
    sendSignal("new-offer", {
      sdp: peer.localDescription,
      receiver_channel_name: receiver_channel_name,
    });
  };

  peer
    .createOffer()
    .then((o) => peer.setLocalDescription(o))
    .then(function (event) { });

  return peer;
}

function createAnswerer(offer, peerUsername, receiver_channel_name) {
  var peer = new RTCPeerConnection(null);

  addLocalTracks(peer);
  var remoteVideo = createVideo(peerUsername);
  setOnTrack(peer, remoteVideo);
  peer.ondatachannel = (e) => {
    peer.dc = e.channel;
    peer.dc.onmessage = dcOnMessage;
    peer.dc.onopen = () => {
      console.log("Connection opened.");
    };
    mapPeers[peerUsername] = [peer, peer.dc];
  };
  peer.oniceconnectionstatechange = () => {
    var iceConnectionState = peer.iceConnectionState;
    if (
      iceConnectionState === "failed" ||
      iceConnectionState === "disconnected" ||
      iceConnectionState === "closed"
    ) {
      delete mapPeers[peerUsername];
      if (iceConnectionState != "closed") {
        peer.close();
      }
      removeVideo(remoteVideo);
    }
  };
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      return;
    }
    sendSignal("new-answer", {
      sdp: peer.localDescription,
      receiver_channel_name: receiver_channel_name,
    });
  };

  peer
    .setRemoteDescription(offer)
    .then(() => {
      return peer.createAnswer();
    })
    .then((a) => {
      return peer.setLocalDescription(a);
    })
    .catch((error) => {
      console.log("Error creating answer for %s.", peerUsername);
      console.log(error);
    });

  return peer;
}

function dcOnMessage(event) {
  var message = event.data;

  var li = document.createElement("li");
  li.appendChild(document.createTextNode(message));
  ul.appendChild(li);
}

function getDataChannels() {
  var dataChannels = [];

  for (peerUsername in mapPeers) {
    var dataChannel = mapPeers[peerUsername][1];
    dataChannels.push(dataChannel);
  }
  return dataChannels;
}

function getPeers(peerStorageObj) {
  var peers = [];

  for (peerUsername in peerStorageObj) {
    var peer = peerStorageObj[peerUsername][0];
    peers.push(peer);
  }
  return peers;
}

function createVideo(peerUsername) {
  var videoContainer = document.querySelector("#video-container");
  var remoteVideo = document.createElement("video");
  remoteVideo.id = peerUsername + "-video";
  remoteVideo.autoplay = true;
  remoteVideo.playsinline = true;
  var videoWrapper = document.createElement("div");
  videoContainer.appendChild(videoWrapper);
  videoWrapper.appendChild(remoteVideo);
  var pTag = document.createElement("p");
  pTag.className = `text-center text-xl text-gray-700 font-bold mb-2`;
  videoWrapper.appendChild(pTag);
  pTag.innerHTML = peerUsername;
  return remoteVideo;
}

function setOnTrack(peer, remoteVideo) {
  var remoteStream = new MediaStream();
  remoteVideo.srcObject = remoteStream;
  peer.addEventListener("track", async (event) => {
    remoteStream.addTrack(event.track, remoteStream);
  });
}

function addLocalTracks(peer) {
  localStream.getTracks().forEach((track) => {
    peer.addTrack(track, localStream);
  });
  return;
}

function removeVideo(video) {
  var videoWrapper = video.parentNode;
  videoWrapper.remove();
}
