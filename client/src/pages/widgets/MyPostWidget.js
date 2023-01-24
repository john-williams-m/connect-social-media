import React from "react";
import {
    EditOutlined,
    DeleteOutline,
    ImageOutlined,
} from '@mui/icons-material'
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    Snackbar,
    Alert
} from "@mui/material"

import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UIAndContentActions } from "../../store/ui-content-slice";
import Dropzone from "react-dropzone";

export default function MyPostWidget(props) {

    const dispatch = useDispatch()
    const [showUploadingStatus, setShowUploadingStatus] = useState(null)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isImage, setIsImage] = useState(false)
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState('')
    const { palette } = useTheme()
    const { userId, token } = useSelector(state => state.auth)
    const mediumMain = palette.neutral.mediumMain
    const medium = palette.neutral.medium
    const handlePost = async () => {
        try {
            if (image && description && image.size < 1000000 && (image.type === 'image/png' || image.type === 'image/jpeg' || image.type === 'image/jpg')) {
                const formData = new FormData()
                formData.append('userId', userId);
                formData.append('description', description)
                if (image) {
                    formData.append('picture', image)
                }
                setShowUploadingStatus(true)
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/posts/new`,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const responseData = await response.json()
                if (!response.ok) {
                    throw new Error(responseData.message, response.status)
                }
                dispatch(UIAndContentActions.setPosts({ post: responseData, newPost: true }))
                setImage(null)
                setShowUploadingStatus(false)
                setIsImage(false)
                setDescription('')


            }
            else {
                if (description.length === 0) {
                    throw new Error('Enter Description to post')
                }
                if (!image) {
                    throw new Error('Attach Image to post')
                }
                else {
                    throw new Error('Validation failed')
                }
            }
        } catch (err) {
            setError(true)
            setErrorMsg(err.message)
        }
    }
    const handleClose = () => {
        setError(false)
    }
    const handleSnackBarClose = () => {
        setShowUploadingStatus(false)
    }

    return (
        <React.Fragment>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
            <Snackbar open={showUploadingStatus} autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity="info" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    Uploading
                </Alert>
            </Snackbar>
            <WidgetWrapper>
                <FlexBetween gap={'1.5rem'}>
                    <UserImage image={props.image} />
                    <InputBase placeholder="What's on your mind..."
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        sx={{
                            width: '100%',
                            backgroundColor: palette.neutral.light,
                            borderRadius: '2rem',
                            padding: '1rem 2rem'
                        }} />
                </FlexBetween>
                {isImage && (
                    <Box
                        borderRadius={'2rem'}
                        border={`1px solid ${medium}`}
                        mt='1rem'
                        p='1rem'>
                        <Dropzone acceptedFiles={'.jpg,.jpeg,.png'} multiple={false}
                            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}>
                            {({ getRootProps, getInputProps }) => (
                                <FlexBetween>
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p={'1rem'}
                                        width='100%'
                                        sx={{
                                            "&:hover": { cursor: 'pointer' }
                                        }}>
                                        <input {...getInputProps()} />
                                        {!image ? (
                                            <p>Add Image Here (Image Size must be Less than 1MB)</p>
                                        ) : <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>}
                                        {image && (
                                            <IconButton
                                                onClick={() => setImage(null)}
                                                sx={{ width: '15%' }}>
                                                <DeleteOutline />
                                            </IconButton>
                                        )}
                                    </Box>
                                </FlexBetween>
                            )}
                        </Dropzone>
                    </Box>
                )}
                <Divider sx={{ margin: '1.25rem 0' }} />

                <FlexBetween>
                    <FlexBetween gap='0.25rem'
                        onClick={() => setIsImage(!isImage)}>
                        <ImageOutlined sx={{ color: mediumMain }} />
                        <Typography color={mediumMain}
                            sx={{ "&:hover": { cursor: 'pointer', color: medium } }}>
                            Image
                        </Typography>
                    </FlexBetween>

                    <Button onClick={handlePost}
                        sx={{
                            color: palette.background.alt,
                            backgroundColor: palette.primary.main,
                            borderRadius: '3rem',
                            "&:hover": {
                                backgroundColor: palette.primary.main
                            },

                        }}>POST</Button>
                </FlexBetween>
            </WidgetWrapper>
        </React.Fragment>
    )
}