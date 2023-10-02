import { useEffect, useState } from "react";

const useRecording = (deps?: any[]) => {
    const [data, setData] = useState<boolean | null | unknown>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const sendMessageToBackground = async (port: any) => {
            try {
                const response = await new Promise((resolve) => {
                    port.postMessage({ action: 'checkForActiveRecording' });
                    port.onMessage.addListener((message: any) => {
                        if (message.action === 'activeRecordingStatus') {
                            resolve(message.status);
                        }
                    });
                });

                setData(response);
                setLoading(false);
            } catch (error) {
                console.error('Error sending/receiving message:', error);
                setError('Error sending/receiving message');
                setLoading(false);
            }
        };

        const port = chrome.runtime.connect({ name: 'popup-connection' });
        sendMessageToBackground(port);

        return () => controller.abort();
    }, deps ? [...deps] : []);

    return { data, error, isLoading }
}

export default useRecording;