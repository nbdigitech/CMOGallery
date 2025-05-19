import {createSlice} from '@reduxjs/toolkit';
import { registerUser } from '../actions/registerAction';

const registerSlice = createSlice({
    name:'register',
    initialState:{
        user:null,
        token:null,
        loading:false,
        error:null
    },
    extraReducers:(builder) => {
        builder
        .addCase(registerUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false; 
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Login failed';
        });
    }
})

export default registerSlice.reducer;
