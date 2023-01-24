import { useTheme } from '@emotion/react'
import { Box, Typography } from '@mui/material'

import Friend from '../../components/Friend'
import WidgetWrapper from '../../components/WidgetWrapper'

const FriendListWidget = (props) => {
    const { palette } = useTheme()

    return (
        <WidgetWrapper>
            <Typography color={palette.neutral.dark}
                variant='h5'
                fontWeight={'500'}
                sx={{ mb: '1.5rem' }}>
                Friend List
            </Typography>
            {props.friendsList.length === 0 && <Typography textAlign={'center'} variant='h6'>No Friends</Typography>}
            <Box display='flex' flexDirection='column' gap='1.5rem' >
                {props.friendsList.map((friend) => (
                    <Friend
                        key={friend.id}
                        friendId={friend.id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    )
}

export default FriendListWidget