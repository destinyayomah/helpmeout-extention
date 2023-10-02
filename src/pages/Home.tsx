import { Button, HStack, Image, Switch, Text, VStack } from "@chakra-ui/react"
import logo from '../assets/logo.png'
import monitorActive from '../assets/monitor-active.png'
import monitor from '../assets/monitor.png'
import copyActive from '../assets/copy-active.png'
import copy from '../assets/copy.png'
import videoCamera from '../assets/video-camera.png'
import microphone from '../assets/microphone.png'
import cog from '../assets/cog.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons"
import { primaryColor, secondaryColor } from "../utils/colors"
import { useEffect, useState } from "react"
import '@fontsource-variable/work-sans/index.css'
import useRecording from "../hooks/useRecording"

const Home = () => {
    const [mode, setMode] = useState('currentTab');
    const [camera, setCamera] = useState(true);
    const [audio, setAudio] = useState(true);
    const [isRecording, setIsRecording] = useState<boolean | null | unknown>(true);
    const { data, isLoading, error } = useRecording();


    useEffect(() => {
        setIsRecording(data);
    }, [data, isLoading]);

    const fullScreen = () => setMode('fullScreen');
    const currentTab = () => setMode('currentTab');

    const toggleCamera = () => {
        if (camera) {
            setCamera(false);
        } else {
            setCamera(true);
        }
    }

    const toggleAudio = () => {
        if (audio) {
            setAudio(false);
        } else {
            setAudio(true);
        }
    }

    const startRecording = async () => {
        let response = await chrome.runtime.sendMessage({ action: 'startRecording', camera, audio, mode });
        console.log(response);
        setIsRecording(true);
        window.close();
    }

    const stopRecording = async () => {
        let response = await chrome.runtime.sendMessage({ action: 'stopRecording', mode });
        console.log(response);
        setIsRecording(false);
    }

    if (error) return <Text>{error}</Text>

    if (isLoading) return <Text>is loading...</Text>

    return <>
        <VStack padding='30px'>
            <HStack w='100%' justifyContent='space-between'>
                <Image src={logo} w='100px' h='28px' />
                <HStack>
                    <Image src={cog} w='20px' h='20px' />
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        color={secondaryColor}
                        fontSize='20px'
                    />
                </HStack>
            </HStack>

            <Text
                marginTop='16px'
                fontSize='12px'
                color={primaryColor}
            >
                This extension helps you record and share help videos with ease.
            </Text>

            <HStack marginTop='24px' w='100%' justifyContent='space-around'>
                <VStack onClick={fullScreen} cursor='pointer'>
                    <Image src={mode == 'fullScreen' ? monitorActive : monitor} w='32px' h='32px' />
                    <Text
                        fontSize='14px'
                        color={mode == 'fullScreen' ? primaryColor : secondaryColor}
                        fontWeight='600'
                    >
                        Full screen
                    </Text>
                </VStack>

                <VStack onClick={currentTab} cursor='pointer'>
                    <Image src={mode == 'currentTab' ? copyActive : copy} w='32px' h='32px' />
                    <Text
                        fontSize='14px'
                        color={mode == 'currentTab' ? primaryColor : secondaryColor}
                        fontWeight='600'
                    >
                        Current Tab
                    </Text>
                </VStack>
            </HStack>

            {!isRecording && <HStack
                marginTop='24px'
                border={`1px solid ${primaryColor}`}
                borderRadius='10px'
                w='100%'
                h='48px'
                padding='0 20px'
                justifyContent='space-between'
            >
                <HStack>
                    <Image src={videoCamera} w='24px' h='24px' />
                    <Text fontSize='14px' fontWeight='600' color={primaryColor}>Camera</Text>
                </HStack>
                <Switch colorScheme='primaryColor' isChecked={camera} onChange={toggleCamera} />
            </HStack>}

            {!isRecording && <HStack
                marginTop='10px'
                border={`1px solid ${primaryColor}`}
                borderRadius='10px'
                w='100%'
                h='48px'
                padding='0 20px'
                justifyContent='space-between'
            >
                <HStack>
                    <Image src={microphone} w='24px' h='24px' />
                    <Text fontSize='14px' fontWeight='600' color={primaryColor}>Audio</Text>
                </HStack>
                <Switch colorScheme="primaryColor" isChecked={audio} onChange={toggleAudio} />
            </HStack>}

            {!isRecording ? <Button
                variant='ghost'
                border='none'
                marginTop='10px'
                w='100%'
                bg={primaryColor}
                color='#FAFDFF'
                fontSize='16px'
                borderRadius='12px'
                _focus={{
                    outline: 'none',
                    boxShadow: 'none'
                }}
                _hover={{
                    background: secondaryColor,
                    color: 'rgba(255,255,255, 0.6)'
                }}
                onClick={startRecording}
            >Start Recording</Button> :

                <Button
                    variant='ghost'
                    marginTop='10px'
                    w='100%'
                    bg='white'
                    color={primaryColor}
                    fontSize='16px'
                    borderRadius='12px'
                    border={`1px solid ${primaryColor}`}
                    _focus={{
                        outline: 'none',
                        boxShadow: 'none'
                    }}
                    _hover={{
                        background: primaryColor,
                        color: 'white'
                    }}
                    onClick={stopRecording}
                >Stop Recording</Button>}
        </VStack>

        {/* <HStack>
            {camera && <Camera />}
            {isRecording && <Controls />}
        </HStack> */}
    </>
}

export default Home