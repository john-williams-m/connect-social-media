import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    Box,
    InputBase,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Link,
    Drawer,
    ListItem,
    ListItemButton,
    List,
    Divider,
    ListItemText
} from '@mui/material'

import {
    Search,
    DarkMode,
    LightMode,
    Edit
} from '@mui/icons-material'

import { authActions } from "../../store/authSlice";
import FlexBetween from "../../components/FlexBetween";
import { UIAndContentActions } from "../../store/ui-content-slice";

export default function NavBar(props) {

    const fullName = useSelector(state => state.UIAndContent.userName)
    const { isAuth } = props
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isNonMobileScreens = useMediaQuery('(min-width: 1000px )')
    const theme = useTheme()

    const neutralLight = theme.palette.neutral.light
    const dark = theme.palette.neutral.dark
    const alt = theme.palette.background.alt



    return (
        <React.Fragment>
            <FlexBetween padding={'1rem 6%'} bgcolor={alt}>
                <FlexBetween gap={'1.75rem'} >
                    <Link component={'a'} onClick={() => navigate('/')} underline="none">
                        <Typography fontWeight={'bold'} fontSize='clamp(1rem, 2rem, 2.25rem)' color={'primary'}
                            sx={{
                                "&:hover": {
                                    cursor: 'pointer'
                                }
                            }} >Connect</Typography>
                    </Link>
                    {isNonMobileScreens && isAuth && (
                        <FlexBetween bgcolor={neutralLight} borderRadius='9px' gap={'3rem'} padding='0.1rem 1.5rem' >
                            <InputBase placeholder="Search..." />
                            <IconButton>
                                <Search />
                            </IconButton>
                        </FlexBetween>
                    )}
                </FlexBetween>

                {isNonMobileScreens ? (
                    <FlexBetween gap={'2rem'}>
                        <IconButton onClick={() => dispatch(UIAndContentActions.setMode())}>
                            {theme.palette.mode === 'dark' ? (
                                <DarkMode sx={{ fontSize: '25px' }} />
                            ) : (
                                <LightMode sx={{ color: dark, fontSize: '25px' }} />
                            )}
                        </IconButton>
                        {isAuth && <IconButton sx={{ color: dark }} onClick={() => { navigate('/') }}>
                            <AccountCircleIcon sx={{ fontSize: '25px' }} />
                        </IconButton>}
                        {isAuth && <FlexBetween>
                            <IconButton sx={{ color: dark }} onClick={() => {
                                dispatch(authActions.setLogout())
                                dispatch(UIAndContentActions.getBacktoInitialStage())
                            }}>

                                <LogoutIcon sx={{ fontSize: '25px' }} />
                            </IconButton>
                            <Typography ml={'0.5rem'} variant="body1">Logout</Typography>
                        </FlexBetween>}

                    </FlexBetween>
                ) : (
                    <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                        <MenuIcon />
                    </IconButton>
                )}

                {!isNonMobileScreens && isMobileMenuToggled && (
                    <Drawer
                        transitionDuration={300}
                        anchor="right"
                        variant="temporary"
                        open={isMobileMenuToggled}
                        onClose={() => setIsMobileMenuToggled(prev => !prev)}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                        }}
                    >
                        <Box onClick={() => setIsMobileMenuToggled(prev => !prev)} sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ my: 2 }}>
                                Connect
                            </Typography>
                            <Divider />
                            <List disablePadding>
                                <ListItem >
                                    <ListItemButton onClick={() => { dispatch(UIAndContentActions.setMode()) }} sx={{ textAlign: 'center', }}>
                                        {theme.palette.mode === 'dark' ? <LightMode sx={{ marginLeft: '1rem' }} /> : <DarkMode sx={{ marginLeft: '1rem' }} />}
                                        <ListItemText primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                {isAuth && <ListItem >
                                    <ListItemButton onClick={() => navigate('/')} sx={{ textAlign: 'center', }}>
                                        <AccountCircleIcon sx={{ fontSize: '25px', marginLeft: '1rem' }} />
                                        <ListItemText primary={fullName} />
                                    </ListItemButton>
                                </ListItem>}
                                {isAuth && <Divider />}
                                {isAuth && <ListItem >
                                    <ListItemButton onClick={() => navigate('/profile/edit')} sx={{ textAlign: 'center', }}>
                                        <Edit sx={{
                                            marginLeft: '1rem'
                                        }} />
                                        <ListItemText primary='Edit Profile' />
                                    </ListItemButton>
                                </ListItem>}
                                {isAuth && <Divider />}
                                {isAuth && <ListItem >
                                    <ListItemButton onClick={() => {
                                        dispatch(authActions.setLogout())
                                        dispatch(UIAndContentActions.getBacktoInitialStage())
                                    }} sx={{ textAlign: 'center', }}>
                                        <LogoutIcon sx={{
                                            marginLeft: '1rem'
                                        }} />
                                        <ListItemText primary='Logout' />
                                    </ListItemButton>
                                </ListItem>}

                            </List>
                        </Box>
                    </Drawer>
                )}

            </FlexBetween>
        </React.Fragment>
    )
}