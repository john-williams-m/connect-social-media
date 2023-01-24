import React, { useState } from "react";
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Divider, IconButton, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import SendIcon from '@mui/icons-material/Send';
import FlexBetween from "../../components/FlexBetween";
import { UIAndContentActions } from "../../store/ui-content-slice";
const PostWidget = (props) => {

    const {
        postId,
        createdUserId,
        firstName,
        lastName,
        description,
        location,
        picturePath,
        userPicturePath,
        likes,
        comments
    } = props

    const [showComments, setShowComments] = useState(false)
    const [showSnackBar, setShowSnackBar] = useState(false)
    const [comment, setComment] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const dispatch = useDispatch()
    const { userId, token } = useSelector(state => state.auth)
    const isLiked = likes.includes(userId)
    const likeCount = likes.length

    const { palette } = useTheme()
    const main = palette.neutral.main
    const primary = palette.primary.main

    const patchLike = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/like`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            }
        )
        const updatedPost = await response.json()
        dispatch(UIAndContentActions.setPost({ post: updatedPost }))
    }


    const patchComment = async () => {
        try {
            if (comment.trim().length === 0) {
                throw new Error('Enter the valid comment')
            }
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/posts/comment`, {
                method: 'POST',
                body: JSON.stringify({
                    postId: postId,
                    comment: comment
                }),
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            }
            )
            const updatedPost = await response.json()
            dispatch(UIAndContentActions.setPost({ post: updatedPost }))
            setComment('')
        } catch (err) {
            setError(true)
            setErrorMsg(err.message || 'Comment validation failed')
        }
    }

    const handleClose = () => {
        setError(false)
    }
    const handleSnackBarClose = () => {
        setShowSnackBar(false)
    }

    return (
        <React.Fragment>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
            <Snackbar open={showSnackBar} autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity="info" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    URL Copied to Clipboard
                </Alert>
            </Snackbar>
            <WidgetWrapper m='2rem 0'>
                <Friend
                    creatorUserId={createdUserId}
                    friendId={createdUserId}
                    name={`${firstName} ${lastName}`}
                    subtitle={location}
                    userPicturePath={userPicturePath} />
                <Typography color={main} sx={{ mt: '1rem' }}>
                    {description}
                </Typography>
                {picturePath && (
                    <img width={'100%'} height='auto' alt={'post'} style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }} src={props.picturePath} />
                )}
                <FlexBetween
                    mt={'0.25rem'}>
                    <FlexBetween gap={'1rem'}>

                        <FlexBetween gap={'0.3rem'}>
                            <IconButton onClick={patchLike}>
                                {isLiked ? (
                                    <FavoriteOutlined sx={{ color: primary }} />
                                ) : (
                                    <FavoriteBorderOutlined />
                                )}
                            </IconButton>
                            <Typography>{likeCount}</Typography>
                        </FlexBetween>

                        <FlexBetween gap='0.3rem'>
                            <IconButton onClick={() => setShowComments(!showComments)}>
                                <ChatBubbleOutlineOutlined />
                            </IconButton>
                            <Typography>{comments.length}</Typography>
                        </FlexBetween>

                    </FlexBetween>

                    <IconButton onClick={() => {
                        navigator.clipboard.writeText(`copied text`)
                        setShowSnackBar(true)
                    }}>
                        <ShareOutlined />
                    </IconButton>

                </FlexBetween>
                {showComments && (
                    <Box mt='0.5rem'>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <TextField fullWidth name="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Enter your comments here..." variant="standard" />
                            <IconButton onClick={patchComment}>
                                <SendIcon sx={{
                                    m: '0 0.30rem'
                                }} />
                            </IconButton>
                        </Box>

                        {comments.map((comment, i) => (
                            <Box key={`${firstName} ${lastName}-${i}`}>
                                <Divider />
                                <Typography sx={{
                                    color: main,
                                    m: '0.5rem 0',
                                    pl: '1rem'
                                }}>
                                    {comment}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </WidgetWrapper>
        </React.Fragment>
    )
}

export default PostWidget