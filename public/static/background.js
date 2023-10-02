console.log('Service worker registered');

const handleMessages = async (message, sender, sendResponse) => {
    if (message.action === 'startRecording' && message.mode === 'currentTab') {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const existingContexts = await chrome.runtime.getContexts({});
        let recording = false;

        const offscreenDocument = existingContexts.find(
            (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
        );

        // If an offscreen document is not already open, create one.
        if (!offscreenDocument) {
            // Create an offscreen document.
            await chrome.offscreen.createDocument({
                url: 'static/offscreen.html',
                reasons: ['USER_MEDIA'],
                justification: 'Recording from chrome.tabCapture API',
            });
        } else {
            recording = offscreenDocument.documentUrl.endsWith('#recording');
        }

        // Get a MediaStream for the active tab.
        const streamId = await chrome.tabCapture.getMediaStreamId({
            targetTabId: tab.id
        });

        // Send the stream ID to the offscreen document to start recording.
        chrome.runtime.sendMessage({
            type: 'startRecording',
            target: 'offscreen',
            data: streamId
        });

        // send message to show controls
        chrome.tabs.sendMessage(tab.id, { action: 'showControls', camera: message.camera, audio: message.audio });

        sendResponse(`current tab recording triggered: ${message.mode}`);
    }

    if (message.action === 'startRecording' && message.mode === 'fullScreen') {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const existingContexts = await chrome.runtime.getContexts({});
        let recording = false;

        const offscreenDocument = existingContexts.find(
            (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
        );

        // If an offscreen document is not already open, create one.
        if (!offscreenDocument) {
            // Create an offscreen document.
            await chrome.offscreen.createDocument({
                url: 'static/offscreen.html',
                reasons: ['USER_MEDIA'],
                justification: 'Recording from chrome.tabCapture API',
            });
        } else {
            recording = offscreenDocument.documentUrl.endsWith('#recording');
        }

        // Send the stream ID to the offscreen document to start recording.
        chrome.runtime.sendMessage({
            type: 'fullScreenRecorder',
            target: 'offscreen',
        });

        // send message to show controls
        chrome.tabs.sendMessage(tab.id, { action: 'showControls', camera: message.camera, audio: message.audio });

        sendResponse(`current tab recording triggered: ${message.mode}`);
    }

    if (message.action === 'stopRecording') {
        const existingContexts = await chrome.runtime.getContexts({});
        let recording = false;

        const offscreenDocument = existingContexts.find(
            (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
        );

        if (offscreenDocument) {
            recording = offscreenDocument.documentUrl.endsWith('#recording');
        }

        if (recording) {
            chrome.runtime.sendMessage({
                type: 'stopRecording',
                target: 'offscreen'
            });

            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.tabs.sendMessage(tab.id, { action: 'hideControls' });
            console.log('sent controls hide request');


            sendResponse(`current tab stop recording triggered: ${message.mode}`);
        } else {
            sendResponse('There was no active recording...');
        }
    }

    if (message.action === 'checkForActiveRecording') {
        const existingContexts = await chrome.runtime.getContexts({});
        let recording = false;

        const offscreenDocument = existingContexts.find(
            (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
        );

        if (offscreenDocument) {
            recording = offscreenDocument.documentUrl.endsWith('#recording');
        }

        if (recording) {
            sendResponse(true);
            console.log('servic-worker:', true);
        } else {
            sendResponse(false);
            console.log('servic-worker:', false);
        }
    }
}

chrome.runtime.onMessage.addListener(handleMessages);

const connections = {};

chrome.runtime.onConnect.addListener((port) => {
    const tabId = port.sender.tabId;
    connections[tabId] = port;

    port.onMessage.addListener(async (message) => {
        if (message.action === 'checkForActiveRecording') {
            const existingContexts = await chrome.runtime.getContexts({});
            let recording = false;

            const offscreenDocument = existingContexts.find(
                (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
            );

            if (offscreenDocument) {
                recording = offscreenDocument.documentUrl.endsWith('#recording');
            }

            if (recording) {
                port.postMessage({ action: 'activeRecordingStatus', status: true });
            } else {
                port.postMessage({ action: 'activeRecordingStatus', status: false });
            }
        }
    });

    port.onDisconnect.addListener(() => {
        delete connections[tabId];
    });
})