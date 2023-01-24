import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: null,
    userId: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.userId = action.payload.userId
            state.token = action.payload.token
        },
        setLogout: (state, action) => {
            state.userId = null
            state.token = null
        },

    }
})


export const authActions = authSlice.actions
export default authSlice.reducer