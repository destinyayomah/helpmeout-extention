import { extendTheme } from '@chakra-ui/react'
import { primaryColor, secondaryColor } from './utils/colors'

const theme = extendTheme({
    fonts: {
        heading: `'Work Sans Variable', sans-serif`,
        body: `'Work Sans Variable', sans-serif`
    },
    colors: {
        primaryColor: {
            50: primaryColor,
            100: primaryColor,
            200: primaryColor,
            300: primaryColor,
            400: primaryColor,
            500: primaryColor,
            600: primaryColor,
            700: primaryColor,
            800: primaryColor,
            900: primaryColor
        },
        secondaryColor: {
            50: secondaryColor,
            100: secondaryColor,
            200: secondaryColor,
            300: secondaryColor,
            400: secondaryColor,
            500: secondaryColor,
            600: secondaryColor,
            700: secondaryColor,
            800: secondaryColor,
            900: secondaryColor
        }
    }
})

export default theme