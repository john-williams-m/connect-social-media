import {
    PersonAddOutlined,
    PersonRemoveOutlined
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    useTheme,
    IconButton
} from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FlexBetween from './FlexBetween'
import UserImage from './UserImage'
import { UIAndContentActions } from '../store/ui-content-slice'

const Friend = (props) => {

    const { palette } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userId, token } = useSelector(state => state.auth)
    const friendsId = useSelector((state) => state.UIAndContent.friendsId)

    const primaryLight = palette.primary.light
    const primaryDark = palette.primary.dark
    const main = palette.neutral.main
    const medium = palette.neutral.medium
    let showFriendIcon = true
    const { creatorUserId } = props

    const findByIndex = friendsId.findIndex(id => id === props.friendId)
    const isFriend = findByIndex > -1
    if (creatorUserId === userId) {
        showFriendIcon = false
    }

    const patchFriend = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
            {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    friendId: props.friendId,
                    isFriend: isFriend
                })
            }
        )
        const data = await response.json()
        dispatch(UIAndContentActions.setFriends({ userData: data.newUserData }))
    }

    return (
        <React.Fragment>
            <FlexBetween>
                <FlexBetween gap='1rem'>
                    <UserImage image={props.userPicturePath} size='55px' />
                    <Box onClick={() => {
                        navigate(`/profile/${props.friendId}`)
                    }}>
                        <Typography
                            color={main}
                            variant='h5'
                            fontWeight={'500'}
                            sx={{
                                "&:hover": {
                                    color: palette.primary.main,
                                    cursor: 'pointer'
                                }
                            }}>
                            {props.name}
                        </Typography>
                        <Typography color={medium} fontSize='0.75rem'>
                            {props.subtitle}
                        </Typography>
                    </Box>
                </FlexBetween>
                {showFriendIcon && <IconButton onClick={() => { patchFriend() }}
                    sx={{ backgroundColor: primaryLight, p: '0.6rem' }}>
                    {isFriend ? (
                        <PersonRemoveOutlined sx={{ color: primaryDark }} />
                    ) : (
                        <PersonAddOutlined sx={{ color: primaryDark }} />
                    )}
                </IconButton>}
            </FlexBetween>
        </React.Fragment>
    )
}


export default Friend
