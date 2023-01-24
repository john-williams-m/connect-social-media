import { Box, CircularProgress, useMediaQuery } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FlexBetween from "../../components/FlexBetween"
import { UIAndContentActions } from "../../store/ui-content-slice"
import FriendListWidget from "../widgets/FriendListWidget"
import MyPostWidget from "../widgets/MyPostWidget"
import PostsWidget from "../widgets/PostsWidget"
import UserWidget from "../widgets/UserWidget"

const HomePage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector(state => state.UIAndContent.user)
    const friends = useSelector(state => state.UIAndContent.friends)
    const isNonMobileScreens = useMediaQuery('(min-width:1000px)')
    const { userId, token } = useSelector(state => state.auth)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            const responseData = await response.json()
            dispatch(UIAndContentActions.setProfileData({ userData: responseData }))
            setIsLoading(false)
        }
        fetchData()
    }, [userId, dispatch, token])

    if (isLoading) {
        return (
            <FlexBetween>
                <CircularProgress sx={{
                    marginLeft: '50%',
                    marginTop: '25%'
                }} color="info" />
            </FlexBetween>
        )
    }

    return (
        <React.Fragment>
            {!isLoading && user && <Box>
                <Box
                    width={'100%'}
                    padding='2rem 6%'
                    display={isNonMobileScreens ? 'flex' : 'block'}
                    gap={'0.5rem'}
                    justifyContent='space-between'
                >
                    <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
                        <UserWidget
                            userId={userId}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            location={user.location}
                            picturePath={user.picturePath}
                            friends={user.friends}
                            twitter={user.twitter}
                            linkedIn={user.linkedIn}
                        />
                    </Box>
                    <Box flexBasis={isNonMobileScreens ? '42%' : undefined}
                        mt={isNonMobileScreens ? undefined : '2rem'}>
                        <MyPostWidget image={user.picturePath} />
                        <PostsWidget userId={userId} />
                    </Box>
                    {isNonMobileScreens && (
                        <Box flexBasis={'26%'}>
                            <Box m='2rem 0'>
                                <FriendListWidget friendsList={friends} />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>}
        </React.Fragment>
    )
}

export default HomePage