import { EditOutlined } from "@mui/icons-material";
import { Alert, Box, Button, Snackbar, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'
import FlexBetween from "../../components/FlexBetween";
import { authActions } from "../../store/authSlice";


const registerSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email('Invalid email!').required('Required'),
    password: yup.string().required('Required').min(5),
    location: yup.string().required('Required'),
    picture: yup.string().required('Required'),
    linkedIn: yup.string(),
    twitter: yup.string()
})

const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().required('Required')
})



export default function Auth() {

    const [Register, setRegister] = useState(true)
    const [statusSnackBar, setStatusSnackBar] = useState()
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const { palette } = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isNonMobile = useMediaQuery('(min-width: 600px)')

    const initialValuesLogin = {
        email: '',
        password: ''
    }

    const initialValuesRegister = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        location: '',
        picture: '',
        linkedIn: '',
        twitter: ''
    }

    const handleFormSubmit = async (values) => {
        if (Register) {
            try {
                if (values.picture && values.picture.size < 1000000 && (values.picture.type === 'image/png' || values.picture.type === 'image/jpeg' || values.picture.type === 'image/jpg')) {
                    const formData = new FormData();
                    for (let value in values) {
                        formData.append(value, values[value])
                    }
                    formData.append('picture', values.picture.name)
                    setStatusSnackBar(true)
                    const savedUserResponse = await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
                        {
                            method: 'POST',
                            body: formData
                        }
                    )
                    if (!savedUserResponse.ok) {
                        setStatusSnackBar(false)
                        const savedUser = await savedUserResponse.json()
                        throw new Error(savedUser.message, savedUserResponse.status)
                    }
                    const savedUser = await savedUserResponse.json()
                    setStatusSnackBar(false)
                    if (savedUser) {
                        dispatch(authActions.setLogin({
                            userId: savedUser.userId,
                            token: savedUser.token
                        }))
                        navigate('/')
                    }
                }
                else {
                    throw new Error('Image validation failed')
                }

            } catch (err) {
                setError(true)
                setErrorMsg(err.message || 'Registration Failed')
            }
        }
        else {
            try {
                const loggedInResponse = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: { 'Content-Type': 'application/json' }
                }
                )
                if (!loggedInResponse.ok) {
                    const existingUser = await loggedInResponse.json()
                    throw new Error(existingUser.message, 401)
                }
                const existingUser = await loggedInResponse.json()
                if (existingUser) {
                    dispatch(
                        authActions.setLogin({
                            userId: existingUser.userId,
                            token: existingUser.token
                        })
                    )
                    navigate('/')
                }
            } catch (err) {
                setError(true)
                setErrorMsg(err.message || 'Login Failed')
            }
        }
    }

    const handleClose = () => {
        setError(false)
    }
    const handleRegisterSnackBarClose = () => {
        setStatusSnackBar(true)
    }

    let formik
    formik = useFormik({
        initialValues: Register ? initialValuesRegister : initialValuesLogin,
        validationSchema: Register ? registerSchema : loginSchema,
        onSubmit: handleFormSubmit
    })


    return (
        <React.Fragment>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
            <Snackbar open={statusSnackBar} autoHideDuration={6000} onClose={handleRegisterSnackBarClose}>
                <Alert onClose={handleRegisterSnackBarClose} severity="info" sx={{ width: '100%', fontSize: { xs: '1rem', md: '1rem' }, m: { xs: '2rem', md: '1rem' } }}>
                    Registering, Please wait
                </Alert>
            </Snackbar>
            <Typography textAlign={'center'} fontWeight={'500'} variant='h5' sx={{
                mb: '1.5rem'
            }}>
                Welcome Back to Connect, {Register ? 'Sign up' : 'Login'} to Connect with Others!
            </Typography>
            <Box onSubmit={formik.handleSubmit} component='form'
                display={'grid'}
                gap='30px'
                gridTemplateColumns={'repeat(4, minmax(0, 1fr))'}
                sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}>
                {Register && <TextField
                    label='First Name'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    name='firstName'
                    error={Boolean(formik.touched.firstName) && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    sx={{ gridColumn: 'span 2' }}
                />}
                {Register && <TextField
                    label='Last Name'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    name='lastName'
                    error={Boolean(formik.touched.lastName) && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    sx={{ gridColumn: 'span 2' }}
                />}
                {Register && <TextField
                    label='Location'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.location}
                    name='location'
                    error={Boolean(formik.touched.location) && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    sx={{ gridColumn: 'span 4' }}
                />}
                <TextField
                    label='Email'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    name='email'
                    error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                    label='Password'
                    type={'password'}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name='password'
                    error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={{ gridColumn: 'span 4' }}
                />

                {Register && <Box
                    gridColumn={'span 4'}
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius='5px'
                    p={'1rem'}
                >
                    <Dropzone acceptedFiles={'.jpg,.jpeg,.png'} multiple={false}
                        onDrop={(acceptedFiles) => formik.setFieldValue('picture', acceptedFiles[0])}>
                        {({ getRootProps, getInputProps }) => (
                            <Box
                                {...getRootProps()}
                                border={`2px dashed ${palette.primary.main}`}
                                p={'1rem'}
                                sx={{
                                    "&:hover": { cursor: 'pointer' }
                                }}>
                                <input {...getInputProps()} />
                                {!formik.values.picture ? (
                                    <p>Add Profile Picture (Required, must be less than 1MB)</p>
                                ) : <FlexBetween>
                                    <Typography>{formik.values.picture.name}</Typography>
                                    <EditOutlined />
                                </FlexBetween>}
                            </Box>
                        )}
                    </Dropzone>
                </Box>}

                {Register && <TextField
                    label='Twitter Profile Link'
                    type={'url'}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.twitter}
                    name='twitter'
                    error={Boolean(formik.touched.twitter) && Boolean(formik.errors.twitter)}
                    helperText={formik.touched.twitter && formik.errors.twitter}
                    sx={{ gridColumn: 'span 4' }}
                />}
                {Register && <TextField
                    label='LinkedIn Profile Link'
                    type={'url'}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.linkedIn}
                    name='linkedIn'
                    error={Boolean(formik.touched.linkedIn) && Boolean(formik.errors.linkedIn)}
                    helperText={formik.touched.linkedIn && formik.errors.linkedIn}
                    sx={{ gridColumn: 'span 4' }}
                />}

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
                    {Register ? 'Register' : 'Login'}
                </Button>
                <Typography
                    onClick={() => {
                        setRegister(prev => !prev)
                        formik.resetForm()
                    }}
                    sx={{
                        gridColumn: 'span 4',
                        textDecoration: 'none',
                        color: palette.primary.main,
                        "&:hover": {
                            cursor: 'pointer',
                        }
                    }}>
                    {Register ? 'Already have an account? Login here' : `Don't have an account? Sign up here.`}
                </Typography>
            </Box>
        </React.Fragment>
    )
}

