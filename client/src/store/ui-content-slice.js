import { createSlice } from '@reduxjs/toolkit'

const UIAndContentInitialState = {
    userName: '',
    mode: 'light',
    user: null,
    posts: [],
    friends: [],
    friendsId: []
}

const UIAndContentSlice = createSlice({
    name: 'Content',
    initialState: UIAndContentInitialState,
    reducers: {
        setProfileData: (state, action) => {
            state.userName = `${action.payload.userData.firstName} ${action.payload.userData.lastName}`
            state.user = action.payload.userData
            state.friends = action.payload.userData.friends
            state.friendsId = action.payload.userData.friends.map(friend => friend.id)
        },
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
        setFriends: (state, action) => {
            state.user.friends = action.payload.userData.friends
            state.friends = action.payload.userData.friends
            state.friendsId = action.payload.userData.friends.map(friend => friend.id)
        },
        setPosts: (state, action) => {
            if (action.payload.newPost) {
                state.posts = state.posts.concat(action.payload.post)
            }
            else {
                state.posts = action.payload.post
            }
        },
        setPost: (state, action) => {
            const updatedPost = state.posts.map(post => {
                if (post.id === action.payload.post.id) return action.payload.post
                return post;
            })
            state.posts = updatedPost
        },
        getBacktoInitialStage: (state) => {
            state.user = null
            state.posts = []
            state.friends = []
        }
    }
})

export const UIAndContentActions = UIAndContentSlice.actions
export default UIAndContentSlice.reducer