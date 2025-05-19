import { createSlice } from "@reduxjs/toolkit";
import { getDistricts, getEvents, getPhotos, getUserDownload, getUserDownloadHistory, recordDownloadHistory, searchEvent, searchEventByDistrict, searchImage } from "../actions/EventAction";

const eventSlice = createSlice({
    name:"event",
    initialState:{
        loading:false,
        error:null,
        eventsList:[],
        eventPhotos:[],
        districts:[],
        // searchImages:[],
        userDownloads:{},
        userDownloadHistory:[],
        userDownloadViewLeft:0,
        eventId:'',
        downloadTrigger:false,
        downloadWarningModal:false,
        messageModal:false,
        downloadPath:false
    },
    reducers:{
        removeBadge:(state) => {
            state.userDownloadViewLeft = 0
        },
        downloadTrigger:(state) => {
            state.downloadTrigger = true
            state.downloadWarningModal = false
        },
        resetDownloadTrigger:(state) => {
            state.downloadTrigger = false
            state.downloadWarningModal = false
        },
        downloadWarningModal:(state) => {
            state.downloadWarningModal = true
        },
        openMessageModal:(state) => {
            state.messageModal = true
        },
        resetMessageModal:(state) => {
            state.messageModal = false
        },
        setDownloadPath:(state, action) =>{
           state.downloadPath = action.payload
        }
    },
    extraReducers:(builder)=>{
        //get events
        builder
        .addCase(getEvents.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getEvents.fulfilled, (state, action)=> {
            state.loading = false;
            state.eventsList = action.payload.albums
            state.error = null;
            state.eventPhotos = []
        })
        .addCase(getEvents.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


        //get photos
        builder
        .addCase(getPhotos.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getPhotos.fulfilled, (state, action)=> {
            let result = [];
            if(state.eventId == action?.payload?.eventId){
            result = action.payload?.data?.photos?.filter((value) => {
                let check = state.eventPhotos?.find((item)=> item.photo_id == value.photo_id)
                if(!check){
                    return value
                }
            })
            state.eventPhotos = [...state.eventPhotos, ...result]
            }
            else{
            state.eventPhotos = action?.payload?.data?.photos
            }
            state.eventId = action?.payload?.eventId
            state.loading = false;
           
            state.error = null;
        })
        .addCase(getPhotos.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


        //get districts
        builder
        .addCase(getDistricts.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getDistricts.fulfilled, (state, action)=> {
            state.loading = false;
            state.districts = action.payload;
            state.eventPhotos = [];
            state.error = null;
        })
        .addCase(getDistricts.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })

        //search images
        builder
        .addCase(searchImage.pending, (state)=> {
            // state.loading = true;
            state.error = null;
        })
        .addCase(searchImage.fulfilled, (state, action)=> {
            state.loading = false;
            // state.searchImages = action.payload
            state.eventPhotos = action.payload.photos
            state.error = null;
        })
        .addCase(searchImage.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


        //search events
        builder
        .addCase(searchEvent.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchEvent.fulfilled, (state, action)=> {
            state.loading = false;
            state.eventsList = action.payload
            state.eventPhotos = []
            state.error = null;
            state.eventPhotos = []
        })
        .addCase(searchEvent.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


        //search events by district
        builder
        .addCase(searchEventByDistrict.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchEventByDistrict.fulfilled, (state, action)=> {
            state.loading = false;
            state.eventsList = action.payload
            state.error = null;
        })
        .addCase(searchEventByDistrict.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


        //get user downloads
        builder
        .addCase(getUserDownload.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserDownload.fulfilled, (state, action)=> {
            state.loading = false;
            state.userDownloads = action.payload
            state.error = null;
        })
        .addCase(getUserDownload.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


        //get user downloads history
        builder
        .addCase(getUserDownloadHistory.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserDownloadHistory.fulfilled, (state, action)=> {
            state.loading = false;
            state.userDownloadHistory = action.payload
            state.error = null;
        })
        .addCase(getUserDownloadHistory.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })

        //add user downloads history
        builder
        .addCase(recordDownloadHistory.pending, (state)=> {
            state.error = null;
        })
        .addCase(recordDownloadHistory.fulfilled, (state, action)=> {
            state.userDownloadViewLeft = parseInt(state.userDownloadViewLeft) + parseInt(1)
            state.error = null;
        })
        .addCase(recordDownloadHistory.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload || 'Fetched Error';
        })


    }
})

export default eventSlice.reducer
export const { removeBadge, resetDownloadTrigger,  openMessageModal,
    downloadTrigger, downloadWarningModal, setDownloadPath, resetMessageModal } = eventSlice.actions