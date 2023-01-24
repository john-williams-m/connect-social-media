import {
    Box,
    CircularProgress,
    useMediaQuery
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FlexBetween from '../../components/FlexBetween'
import PostsWidget from '../widgets/PostsWidget'
import UserWidget from '../widgets/UserWidget'

const ProfilePage = () => {

    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const { token } = useSelector(state => state.auth)
    const isNonMobileScreens = useMediaQuery('(min-width:1000px)')
    useEffect(() => {
        const getUser = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const data = await response.json()
            setUser(data)
        }
        getUser()
    }, [token, userId])

    if (!user) {
        return (
            <FlexBetween>
                <Box display={'flex'} width='100%' height={'100%'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            </FlexBetween>
        )
    }
    return (
        <Box>
            <Box
                width={'100%'}
                padding='2rem 6%'
                display={isNonMobileScreens ? 'flex' : 'block'}
                gap={'2rem'}
                justifyContent='center '
            >
                <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
                    <UserWidget
                        userId={userId}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        location={user.location}
                        occupation={user.occupation}
                        picturePath={user.picturePath}
                        friends={user.friends}
                        viewedProfile={user.viewedProfile}
                        impressions={user.impressions}
                    />
                </Box>
                <Box flexBasis={isNonMobileScreens ? '42%' : undefined}
                >
                    <PostsWidget isProfile userId={userId} />
                </Box>
            </Box>
        </Box>
    )
}

export default ProfilePage