import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name : 'filter',
    initialState:{
        isOpen:false
    },
    reducers:{
        openFilter : (state) => {
            state.isOpen = true
        },
        closeFilter: (state) => {
            state.isOpen = false
        }
    }
})

export const {openFilter, closeFilter} = filterSlice.actions
export default filterSlice.reducer;