import {
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material'
import Auth from './Auth'

const Authenticate = () => {

    const theme = useTheme()
    const isNonMobileScreens = useMediaQuery('(min-width: 1000px)')
    return (
        <Box>
            <Box width={isNonMobileScreens ? '50%' : '93%'} p='2rem' m={'2rem auto'} borderRadius='1.5rem' bgcolor={theme.palette.background.alt} >
                <Auth />
            </Box>
        </Box>
    )
}

export default Authenticate