import { Box } from "@chakra-ui/react";
import { useRef } from "react";
import Draggable from "react-draggable"


const Camera = () => {
    const nodeRef = useRef(null);
    return <>
        <Draggable
            nodeRef={nodeRef}
        >
            <Box
                w='160px'
                h='160px'
                borderRadius='164px'
                ref={nodeRef}
                bg='rgba(0,0,0,0.1)'
            >

            </Box>
        </Draggable>
    </>
}

export default Camera