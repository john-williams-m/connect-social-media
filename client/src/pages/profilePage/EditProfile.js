import { Alert, Box, Button, Snackbar, useMediaQuery, Typography, TextField, useTheme } from "@mui/material"
import { useFormik } from "formik"
import * as yup from 'yup'
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UIAndContentActions } from "../../store/ui-content-slice"
import { useNavigate } from "react-router-dom"

const EditProfileSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    location: yup.string().required('Required'),
    twitter: yup.string(),
    linkedIn: yup.string()
})



export default function EditProfile() {

    const user = useSelector(state => state.UIAndContent.user)

    const { userId, token } = useSelector(state => state.auth)
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [errorMsg, setErrorMsg] = useState()

    const theme = useTheme()
    const isNonMobileScreens = useMediaQuery('(min-width: 1000px)')
    const isNonMobile = useMediaQuery('(min-width: 600px)')

    const initialValues = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        location: user.location || '',
        occupation: user.occupation || '',
        linkedIn: user.linkedIn || '',
        twitter: user.twitter || ''
    }

    const handleFormSubmit = async (values) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/edit`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                }
            )
            const responseData = await response.json()
            if (!response.ok) {
                throw new Error(responseData.message || 'Updation Failed', response.status)
            }
            dispatch(UIAndContentActions.setProfileData({ userData: responseData }))
            navigate('/')
        } catch (err) {
            setError(true)
            setErrorMsg(err.message)
        }
    }

    const handleClose = () => {
        setError(false)
    }

    const formik = useFormik({
        initialValues,
        validationSchema: EditProfileSchema,
        onSubmit: handleFormSubmit
    })

    return (
        <React.Fragment>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
            <Box width={isNonMobileScreens ? '50%' : '93%'} p='2rem' m={'2rem auto'} borderRadius='1.5rem' bgcolor={theme.palette.background.alt} >

                <Typography textAlign={'center'} fontWeight={'500'} variant='h5' sx={{
                    mb: '1.5rem'
                }}>
                    Profile Editing Page
                </Typography>
                <Box onSubmit={formik.handleSubmit} component='form'
                    display={'grid'}
                    gap='30px'
                    gridTemplateColumns={'repeat(4, minmax(0, 1fr))'}
                    sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}>

                    <TextField
                        label='First Name'
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                        name='firstName'
                        error={Boolean(formik.touched.firstName) && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        sx={{ gridColumn: 'span 2' }}
                    />

                    <TextField
                        label='Last Name'
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                        name='lastName'
                        error={Boolean(formik.touched.lastName) && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        sx={{ gridColumn: 'span 2' }}
                    />

                    <TextField
                        label='Location'
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.location}
                        name='location'
                        error={Boolean(formik.touched.location) && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                        sx={{ gridColumn: 'span 4' }}
                    />

                    <TextField
                        label='Twitter Profile Link'
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.twitter}
                        name='twitter'
                        error={Boolean(formik.touched.twitter) && Boolean(formik.errors.twitter)}
                        helperText={formik.touched.twitter && formik.errors.twitter}
                        sx={{ gridColumn: 'span 4' }}
                    />
                    <TextField
                        label='LinkedIn Profile Link'
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.linkedIn}
                        name='linkedIn'
                        error={Boolean(formik.touched.linkedIn) && Boolean(formik.errors.linkedIn)}
                        helperText={formik.touched.linkedIn && formik.errors.linkedIn}
                        sx={{ gridColumn: 'span 4' }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        sx={{
                            gridColumn: 'span 4',
                            m: '2rem 0',
                            p: '1rem',
                            backgroundColor: palette.primary.main,
                            color: palette.primary.light,
                            fontSize: '1rem',
                            "&:hover": {
                                color: palette.primary.main,
                                border: `1px solid ${palette.primary.main}`
                            }
                        }}>
                        Update
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}