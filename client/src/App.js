import React, { Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import { themeSettings } from "./theme";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CircularProgress, CssBaseline } from "@mui/material";
import NavBar from "./pages/navBar";
import Authenticate from "./pages/login";
import FlexBetween from "./components/FlexBetween";

const EditProfile = React.lazy(() => import("./pages/profilePage/EditProfile"))
const ProfilePage = React.lazy(() => import('./pages/profilePage'))

function App() {

  const mode = useSelector(state => state.UIAndContent.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = useSelector(state => state.auth.token)

  return (
    <div className="App">
      <Suspense fallback={<FlexBetween width={'100%'} height="100%"><CircularProgress /></FlexBetween>}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar isAuth={isAuth} />
          <Routes>
            <Route path="/" element={isAuth ? <HomePage /> : <Navigate to={'/auth'} />} />
            <Route path="/auth" element={<Authenticate />} />
            <Route path="/profile/edit" element={isAuth ? <EditProfile /> : <Navigate to={'/auth'} />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to={'/auth'} />} />
          </Routes>
        </ThemeProvider>
      </Suspense>
    </div>
  );
}

export default App;