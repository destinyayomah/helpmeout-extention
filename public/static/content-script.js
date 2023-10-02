
const injectControls = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.setAttribute('id', 'controls-hmo');
    div.style.display = 'none';
    div.style.position = 'absolute';
    div.style.bottom = '0';
    div.style.left = '50px';

    let html = '';
    html = html + '<div class="controls-wrapper-hmo">';
    html = html + '<div class="controls-main-hmo">';
    html = html + '<div class="timer-hmo">00:00:00</div>';
    html = html + '<img class="recording-hmo" src="./static/images/recording.png" alt="recording-img">';
    html = html + '<div class="vertical-line-hmo"></div>';

    html = html + '<div class="controls-item-hmo">';
    html = html + '<div class="controls-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo pause-img-hmo" src="./static/images/pause.png" alt="pause-img">';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo">Pause</div>';
    html = html + '</div>';

    html = html + '<div class="controls-item-hmo" id="stop-hmo">';
    html = html + '<div class="controls-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo" src="./static/images/stop.png" alt="stop-img">';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo">Stop</div>';
    html = html + '</div>';

    html = html + '<div class="controls-item-hmo" id="start-camera-hmo">';
    html = html + '<div class="controls-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo" src="./static/images/video-camera.png" alt="camera-img">';
    html = html + '<i class="fa fa-chevron-up fa-icon-hmo"></i>';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo">Camera</div>';
    html = html + '</div>';

    html = html + '<div class="controls-item-hmo" id="stop-camera-hmo">';
    html = html + '<div class="controls-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo" src="./static/images/video-slash.png" alt="camera-slash-img">';
    html = html + '<i class="fa fa-chevron-up fa-icon-hmo"></i>';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo">Camera</div>';
    html = html + '</div>';

    html = html + '<div class="controls-item-hmo" id="start-mic-hmo">';
    html = html + '<div class="controls-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo" src="./static/images/microphone.png" alt="microphone-img">';
    html = html + '<i class="fa fa-chevron-up fa-icon-hmo"></i>';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo">Mic</div>';
    html = html + '</div>';

    html = html + '<div class="controls-item-hmo" id="stop-mic-hmo">';
    html = html + '<div class="controls-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo" src="./static/images/mic-off.png" alt="microphone-off-img">';
    html = html + '<i class="fa fa-chevron-up fa-icon-hmo"></i>';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo">Mic</div>';
    html = html + '</div>';

    html = html + '<div class="controls-item-hmo">';
    html = html + '<div class="controls-circle-hmo controls-trash-circle-hmo">';
    html = html + '<img class="controls-item-img-hmo" src="./static/images/trash.png" alt="trash-img">';
    html = html + '<i class="fa fa-chevron-up fa-icon-hmo"></i>';
    html = html + '</div>';
    html = html + '<div class="controls-item-text-hmo"></div>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + '</div>';

    div.innerHTML = html;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './static/controls.css';
    document.head.appendChild(link);

    // INJECT CAMERA
    const videoContainer = document.createElement('div');
    videoContainer.setAttribute('id', 'camera-container-hmo');
    videoContainer.setAttribute('class', 'camera-container-hmo');
    videoContainer.innerHTML = '<video id="video-camera-hmo" class="video-camera-hmo" playsinline autoplay></video>';
    document.body.appendChild(videoContainer);

    // const video = document.createElement('video');
    // video.setAttribute('id', 'video-camera-hmo');
    // video.setAttribute('class', 'video-hmo');
    // video.setAttribute('playsinline', true);
    // video.setAttribute('autoplay', true);
    // document.body.appendChild(video);
}

injectControls();

let defaultAudio = undefined;
let allMediaDevices = [];

////////////////////////////////// VIDEO /////////////////////////////////////////////////
const videoElement = document.getElementById('video-camera-hmo');

function gotStream(stream) {
    window.stream = stream;
    videoElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

const gotDevices = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        // console.log(devices);
        allMediaDevices = devices;
        devices.forEach(element => {
            if (!defaultAudio) {
                if (element.kind === 'audioinput') {
                    defaultAudio = element.deviceId;
                }
                // console.log(element);
                // const constraints = {
                //     audio: { deviceId: defaultAudio },
                //     video: { deviceId: undefined }
                // };
                // startVideo(constraints);
            }
        });
    }).catch(error => {
        console.log(error.message);
    })
}

const startVideo = (constraints) => {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotStream)
        .then(gotDevices)
        .catch(handleError);
}

////////////////////////////////// END VIDEO /////////////////////////////////////////////////

chrome.runtime.onMessage.addListener((message, sender, sendRespose) => {
    if (message.action === 'showControls') {
        const controls = document.getElementById('controls-hmo');

        controls.style.display = 'block';

        if (message.camera === true && message.audio === true) {
            const camera = document.getElementById('camera-container-hmo');
            camera.style.display = 'block';

            const constraints = {
                audio: { deviceId: defaultAudio },
                video: { deviceId: undefined }
            };
            startVideo(constraints);

            const cameraBtnStart = document.getElementById('start-camera-hmo');
            const cameraBtnStop = document.getElementById('stop-camera-hmo');

            const micBtnStart = document.getElementById('start-mic-hmo');
            const micBtnStop = document.getElementById('stop-mic-hmo');

            cameraBtnStart.style.display = 'flex';
            cameraBtnStop.style.display = 'none';

            micBtnStart.style.display = 'flex';
            micBtnStop.style.display = 'none';
        } else if (message.camera === true && message.audio === false) {
            const camera = document.getElementById('camera-container-hmo');
            camera.style.display = 'block';

            const cameraBtnStart = document.getElementById('start-camera-hmo');
            const cameraBtnStop = document.getElementById('stop-camera-hmo');

            const micBtnStart = document.getElementById('start-mic-hmo');
            const micBtnStop = document.getElementById('stop-mic-hmo');

            cameraBtnStart.style.display = 'flex';
            cameraBtnStop.style.display = 'none';

            micBtnStart.style.display = 'none';
            micBtnStop.style.display = 'flex';

            const constraints = {
                audio: false,
                video: { deviceId: undefined }
            };

            startVideo(constraints);
        } else if (message.camera === false && message.audio === true) {
            const cameraBtnStart = document.getElementById('start-camera-hmo');
            const cameraBtnStop = document.getElementById('stop-camera-hmo');

            const micBtnStart = document.getElementById('start-mic-hmo');
            const micBtnStop = document.getElementById('stop-mic-hmo');

            cameraBtnStart.style.display = 'none';
            cameraBtnStop.style.display = 'flex';

            micBtnStart.style.display = 'flex';
            micBtnStop.style.display = 'none';

            const constraints = {
                audio: { deviceId: defaultAudio },
                video: false
            };

            startVideo(constraints);
        } else {
            const cameraBtnStart = document.getElementById('start-camera-hmo');
            const cameraBtnStop = document.getElementById('stop-camera-hmo');

            const micBtnStart = document.getElementById('start-mic-hmo');
            const micBtnStop = document.getElementById('stop-mic-hmo');

            cameraBtnStart.style.display = 'none';
            cameraBtnStop.style.display = 'flex';

            micBtnStart.style.display = 'none';
            micBtnStop.style.display = 'flex';
        }
    }

    if (message.action === 'hideControls') {
        const controls = document.getElementById('controls-hmo');

        controls.style.display = 'none';

        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop();
            });
            const camera = document.getElementById('camera-container-hmo');
            camera.style.display = 'none';
        }
    }

    // if (message.action === 'showCamera') {
    //     const camera = document.getElementById('camera-container-hmo');
    //     camera.style.display = 'block';
    // }

    // if (message.action === 'hideCamera') {
    //     const camera = document.getElementById('camera-container-hmo');
    //     camera.style.display = 'none';
    // }
});

const stopRecorderBtn = document.getElementById('stop-hmo');
stopRecorderBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopRecording' });
    const controls = document.getElementById('controls-hmo');
    controls.style.display = 'none';

    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
        const camera = document.getElementById('camera-container-hmo');
        camera.style.display = 'none';
    }
});

const startCameraBtn = document.getElementById('start-camera-hmo');
startCameraBtn.addEventListener('click', () => {
    const camera = document.getElementById('camera-container-hmo');
    const cameraBtnStart = document.getElementById('start-camera-hmo');
    const cameraBtnStop = document.getElementById('stop-camera-hmo');

    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });

        const micBtnStart = document.getElementById('start-mic-hmo');
        if (micBtnStart.style.display === 'flex') {
            const constraints = {
                audio: { deviceId: defaultAudio },
            };
            startVideo(constraints);
        }
    }

    camera.style.display = 'none';
    cameraBtnStart.style.display = 'none';
    cameraBtnStop.style.display = 'flex';
});

const stopCameraBtn = document.getElementById('stop-camera-hmo');
stopCameraBtn.addEventListener('click', () => {
    const cameraBtnStart = document.getElementById('start-camera-hmo');
    const cameraBtnStop = document.getElementById('stop-camera-hmo');

    cameraBtnStart.style.display = 'flex';
    cameraBtnStop.style.display = 'none';

    const micBtnStart = document.getElementById('start-mic-hmo');
    const micBtnStop = document.getElementById('stop-mic-hmo');

    if (micBtnStart.style.display === 'flex') {
        const constraints = {
            audio: { deviceId: defaultAudio },
            video: { deviceId: undefined }
        };
        startVideo(constraints);
    } else {
        const constraints = {
            video: { deviceId: undefined }
        };
        startVideo(constraints);
    }

    const camera = document.getElementById('camera-container-hmo');
    camera.style.display = 'block';
});

const startMicBtn = document.getElementById('start-mic-hmo');
startMicBtn.addEventListener('click', () => {
    const cameraBtnStart = document.getElementById('start-camera-hmo');

    const micBtnStart = document.getElementById('start-mic-hmo');
    const micBtnStop = document.getElementById('stop-mic-hmo');

    if (cameraBtnStart.style.display === 'flex') {
        const constraints = {
            video: { deviceId: undefined }
        };
        startVideo(constraints);

        const camera = document.getElementById('camera-container-hmo');
        camera.style.display = 'block';
    } else {
        const constraints = {};
        startVideo(constraints);

        const camera = document.getElementById('camera-container-hmo');
        camera.style.display = 'none';
    }

    micBtnStart.style.display = 'none';
    micBtnStop.style.display = 'flex';
});

const stopMicBtn = document.getElementById('stop-mic-hmo');
stopMicBtn.addEventListener('click', () => {
    const cameraBtnStart = document.getElementById('start-camera-hmo');

    const micBtnStart = document.getElementById('start-mic-hmo');
    const micBtnStop = document.getElementById('stop-mic-hmo');

    if (cameraBtnStart.style.display === 'flex') {
        const constraints = {
            audio: { deviceId: defaultAudio },
            video: { deviceId: undefined }
        };
        startVideo(constraints);

        const camera = document.getElementById('camera-container-hmo');
        camera.style.display = 'block';
    } else {
        const constraints = {
            audio: { deviceId: defaultAudio }
        };
        startVideo(constraints);

        const camera = document.getElementById('camera-container-hmo');
        camera.style.display = 'none';
    }

    micBtnStart.style.display = 'flex';
    micBtnStop.style.display = 'none';
});

///////////////////////////////////// DRAG CONTROLLER /////////////////////////////////////
const Draggable = (id) => {
    let draggableElem = document.getElementById(id);
    let initialX = 0,
        initialY = 0;
    let moveElement = false;

    //Events Object
    let events = {
        mouse: {
            down: "mousedown",
            move: "mousemove",
            up: "mouseup",
        },
        touch: {
            down: "touchstart",
            move: "touchmove",
            up: "touchend",
        },
    };
    let deviceType = "";

    //Detech touch device
    const isTouchDevice = () => {
        try {
            //We try to create TouchEvent (it would fail for desktops and throw error)
            document.createEvent("TouchEvent");
            deviceType = "touch";
            return true;
        } catch (e) {
            deviceType = "mouse";
            return false;
        }
    };
    isTouchDevice();

    //Start (mouse down / touch start)
    draggableElem.addEventListener(events[deviceType].down, (e) => {
        e.preventDefault();
        //initial x and y points
        initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        //Start movement
        moveElement = true;
    });

    //Move
    draggableElem.addEventListener(events[deviceType].move, (e) => {
        //if movement == true then set top and left to new X andY while removing any offset
        if (moveElement) {
            e.preventDefault();
            let newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
            let newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
            draggableElem.style.top =
                draggableElem.offsetTop - (initialY - newY) + "px";
            draggableElem.style.left =
                draggableElem.offsetLeft - (initialX - newX) + "px";
            initialX = newX;
            initialY = newY;
        }
    });

    //mouse up / touch end
    draggableElem.addEventListener(
        events[deviceType].up,
        (stopMovement = (e) => {
            moveElement = false;
        })
    );

    draggableElem.addEventListener("mouseleave", stopMovement);
    draggableElem.addEventListener(events[deviceType].up, (e) => {
        moveElement = false;
    });
}

Draggable("controls-hmo");
Draggable("camera-container-hmo");

