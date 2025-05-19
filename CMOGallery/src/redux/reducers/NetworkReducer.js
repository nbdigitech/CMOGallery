import { createSlice } from "@reduxjs/toolkit";

const networkSlice = createSlice({
    name:'network',
    initialState:{
        on:true
    },
    reducers:{
        updateNetwork:(state, action) => {
            state.on = !state.on
        }
    }
})

export default networkSlice.reducer
export const { updateNetwork } = networkSlice.actions