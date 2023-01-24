import { CircularProgress } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import FlexBetween from '../../components/FlexBetween'
import { UIAndContentActions } from '../../store/ui-content-slice'
import PostWidget from './PostWidget'

const PostsWidget = (props) => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const posts = useSelector(state => state.UIAndContent.posts)
    const token = useSelector(state => state.auth.token)
    const getPosts = useCallback(async () => {
        setIsLoading(true)
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/posts`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await response.json()
        dispatch(UIAndContentActions.setPosts({ post: data }))
        setIsLoading(false)
    }, [token, dispatch])
    const getUserPosts = useCallback(async () => {
        setIsLoading(true)
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/posts/${props.userId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const data = await response.json()
        dispatch(UIAndContentActions.setPosts({ post: data }))
        setIsLoading(false)
    }, [dispatch, props.userId, token])
    const { isProfile } = props
    useEffect(() => {
        if (isProfile) {
            getUserPosts()
        }
        else {
            getPosts()
        }
    }, [isProfile, getUserPosts, getPosts])

    if (isLoading) {
        return (
            <FlexBetween width={'100%'} height={'100%'}>
                <CircularProgress sx={{
                    marginLeft: '50%',
                    marginTop: '25%'
                }} color='info' />
            </FlexBetween>
        )
    }

    return (
        <React.Fragment>
            {!isLoading && posts && (
                posts.map(post => (
                    <PostWidget
                        key={post.id}
                        postId={post.id}
                        createdUserId={post.userId}
                        firstName={post.firstName}
                        lastName={post.lastName}
                        description={post.description}
                        location={post.location}
                        picturePath={post.picturePath}
                        userPicturePath={post.userPicturePath}
                        likes={post.likes}
                        comments={post.comments} />
                ))
            )}
        </React.Fragment>
    )
}

export default PostsWidget