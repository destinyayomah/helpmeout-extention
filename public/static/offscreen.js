chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.target === 'offscreen') {
        switch (message.type) {
            case "startRecording":
                startRecording(message);
                break;
            case "stopRecording":
                stopRecording();
                break;
            case "fullScreenRecorder":
                startFullscreenRecording(message);
                sendResponse('started');
                break;
            default:
                throw new Error('Unrecognised message', message.type);
        }
    }
});

let recorder;
let data = [];

const startRecording = async message => {
    if (recorder?.state === 'recording') {
        throw new Error('Called startRecording while recording is in progress.');
    }

    const media = await navigator.mediaDevices.getUserMedia({
        audio: {
            mandatory: {
                chromeMediaSource: "tab",
                chromeMediaSourceId: message.data,
            },
        },
        video: {
            mandatory: {
                chromeMediaSource: "tab",
                chromeMediaSourceId: message.data,
            }
        },
    });

    // Continue to play the captured audio to the user.
    // const output = new AudioContext();
    // const source = output.createMediaStreamSource(media);
    // source.connect(output.destination);

    // Start recording.
    recorder = new MediaRecorder(media, { mimeType: 'video/webm' });
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.onstop = () => {
        const blob = new Blob(data, { type: 'video/webm' });
        window.open(URL.createObjectURL(blob), '_blank');

        // Clear state ready for next recording
        recorder = undefined;
        data = [];
    };
    recorder.start();

    window.location.hash = 'recording';
}

const stopRecording = async () => {
    recorder.stop();
    recorder.stream.getTracks().forEach((t) => t.stop());
    window.location.hash = '';
}

const startFullscreenRecording = async message => {
    if (recorder?.state === 'recording') {
        throw new Error('Called startRecording while recording is in progress.');
    }

    const media = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
            width: 99999999999,
            height: 9999999999
        },
    });

    // Start recording.
    recorder = new MediaRecorder(media, { mimeType: 'video/webm' });
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.onstop = () => {
        const blob = new Blob(data, { type: 'video/webm' });
        window.open(URL.createObjectURL(blob), '_blank');

        recorder = undefined;
        data = [];
    };
    recorder.start();

    window.location.hash = 'recording';
}