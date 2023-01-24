import {
    LocationOnOutlined,
    LinkedIn,
    Edit
} from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add';
import TwitterIcon from '@mui/icons-material/Twitter';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
    Box,
    Typography,
    Divider,
    useTheme,
    IconButton,
} from '@mui/material'

import { useSelector } from 'react-redux'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import WidgetWrapper from '../../components/WidgetWrapper'
import FlexBetween from '../../components/FlexBetween'
import UserImage from '../../components/UserImage'

const UserWidget = (props) => {
    const { userId } = useSelector(state => state.auth)
    const { palette } = useTheme()
    const navigate = useNavigate()
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main
    let showManageAccountIcons = false
    if (props.userId === userId) {
        showManageAccountIcons = true
    }

    return (
        <React.Fragment>
            <WidgetWrapper>
                <FlexBetween gap={'0.5rem'} pb='1.1rem' >
                    <FlexBetween gap={'1rem'}>
                        <UserImage image={props.picturePath} />
                        <Box>
                            <Typography variant='h4' color={dark} fontWeight='500'
                                sx={{
                                    "&:hover": {
                                        color: palette.primary.main,
                                        cursor: 'pointer'
                                    }
                                }}>{props.firstName} {props.lastName}</Typography>
                            <Typography color={medium}>Friends Count: {props.friends.length}</Typography>
                        </Box>
                    </FlexBetween>
                    {showManageAccountIcons && <IconButton onClick={() => { navigate(`/profile/edit`) }}  >
                        <Edit />
                    </IconButton>}
                </FlexBetween>
                <Divider />

                <Box p='1rem 0'>
                    <Box display={'flex'} alignItems='center' gap={'1rem'} >
                        <LocationOnOutlined fontSize='large' sx={{ color: main }} />
                        <Typography color={medium}>{props.location}</Typography>
                    </Box>
                </Box>
                <Divider />

                <Box p='1rem 0'>
                    <Typography fontSize={'1rem'} color={main} fontWeight='500' mb='1rem'>
                        Social Profile
                    </Typography>
                    {!props.linkedIn && !props.twitter && (
                        <FlexBetween>

                            <Typography>No Social Profiles</Typography>
                            {showManageAccountIcons && <IconButton onClick={() => { navigate(`/profile/edit`) }}  >
                                <AddIcon />
                            </IconButton>}
                        </FlexBetween>
                    )}
                    {props.twitter && <FlexBetween gap={'1rem'} mb='0.5rem'>
                        <FlexBetween gap='1rem'>
                            <TwitterIcon />
                            <Box>
                                <Typography color={main} fontWeight='500'>
                                    Twitter
                                </Typography>
                                {/* <Typography color={medium}>Social Network</Typography> */}
                            </Box>
                        </FlexBetween>
                        <IconButton href={props.twitter} target='_blank'>
                            <OpenInNewIcon sx={{ color: main }} />
                        </IconButton>
                    </FlexBetween>}

                    {props.linkedIn && <FlexBetween gap={'1rem'} mb='0.5rem'>
                        <FlexBetween gap='1rem'>
                            <LinkedIn color={medium} />
                            <Box>
                                <Typography color={main} fontWeight='500'>
                                    LinkedIn
                                </Typography>
                                {/* <Typography color={medium}>Network Platform</Typography> */}
                            </Box>
                        </FlexBetween>
                        <IconButton href={props.linkedIn} target='_blank'>
                            <OpenInNewIcon sx={{ color: main }} />
                        </IconButton>
                    </FlexBetween>}
                </Box>
            </WidgetWrapper>
        </React.Fragment>
    )
}

export default UserWidget