import { Box, Divider, HStack, Image, Text, VStack } from "@chakra-ui/react"
import Draggable from "react-draggable"
import { useRef } from "react";
import recording from '../assets/recording.png'
import pause from '../assets/pause.png'
import stop from '../assets/stop.png'
import trash from '../assets/trash.png'
import videoCamera from '../assets/video-camera.png'
// import videoSlash from '../assets/video-slash.png'
// import micOff from '../assets/mic-off.png'
import microphone from '../assets/microphone.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"; 

const Controls = () => {
    const nodeRef = useRef(null);

    return <>
        <Draggable
            nodeRef={nodeRef}
            defaultPosition={{ x: 0, y: 0 }}
        >
            <HStack
                cursor='pointer'
                ref={nodeRef}
                w='567px'
                h='102px'
                bg='#E4E4E4'
                borderRadius='200px'
                justifyContent='center'
            >
                <HStack
                    bg='#141414'
                    w='551px'
                    h='86px'
                    borderRadius='200px'
                    padding='20px'
                    spacing='20px'
                >
                    <Text color='white' fontSize='20px' fontWeight='medium'>00:00:00</Text>

                    <Image src={recording} w='20px' h='20px' />

                    <Divider orientation="vertical" borderColor='white' />

                    <VStack>
                        <Box
                            w='44px'
                            h='44px'
                            bg='white'
                            borderRadius='32px'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Image src={pause} w='8px' h='11px' />
                        </Box>
                        <Text color='white' fontSize='12px' fontWeight='medium'>Pause</Text>
                    </VStack>

                    <VStack>
                        <Box
                            w='44px'
                            h='44px'
                            bg='white'
                            borderRadius='32px'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Image src={stop} w='24px' h='24px' />
                        </Box>
                        <Text color='white' fontSize='12px' fontWeight='medium'>Stop</Text>
                    </VStack>

                    <VStack>
                        <Box
                            w='44px'
                            h='44px'
                            bg='white'
                            borderRadius='32px'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            pos='relative'
                        >
                            <Image src={videoCamera} w='24px' h='24px' />
                            <Box
                                pos='absolute'
                                bottom='0'
                                right='0'
                                background='white'
                                h='12px'
                                w='12px'
                                borderRadius='2px'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                            >
                                <FontAwesomeIcon icon={faChevronUp} fontSize='8px' />
                            </Box>
                        </Box>
                        <Text color='white' fontSize='12px' fontWeight='medium'>Camera</Text>
                    </VStack>

                    <VStack>
                        <Box
                            w='44px'
                            h='44px'
                            bg='white'
                            borderRadius='32px'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            pos='relative'
                        >
                            <Image src={microphone} w='24px' h='24px' />
                            <Box
                                pos='absolute'
                                bottom='0'
                                right='0'
                                background='white'
                                h='12px'
                                w='12px'
                                borderRadius='2px'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                            >
                                <FontAwesomeIcon icon={faChevronUp} fontSize='8px' />
                            </Box>
                        </Box>
                        <Text color='white' fontSize='12px' fontWeight='medium'>Mic</Text>
                    </VStack>

                    <VStack>
                        <Box
                            w='44px'
                            h='44px'
                            bg='#4B4B4B'
                            borderRadius='32px'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Image src={trash} w='24px' h='24px' />
                        </Box>
                        <Text></Text>
                    </VStack>
                </HStack>
            </HStack>
        </Draggable>
    </>
}

export default Controls