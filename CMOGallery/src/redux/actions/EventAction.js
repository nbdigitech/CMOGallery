import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../services/apiConfig";
import api from "../../utils/api";
import RNFetchBlob from 'rn-fetch-blob';
export const getEvents = createAsyncThunk(
    "events/get",
    async ({}, thunkAPI) => {
        try{
            const response = await api.get(`${baseUrl}albums`,{
                headers: {
                    Accept: 'application/json',
                  }
            })
            return response.data
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetched failed');
        }
    }
)

export const getPhotos = createAsyncThunk(
    'photos/get',
    async(data, thunkAPI) => {
        try{
            let pagination = ``;
            if(data.page>1 && data.limit != 'full'){
                pagination = `?page=${data.page}&limit=${data.limit}`;
            }
            else if(data.limit == 'full'){
                pagination = "?limit=0"
            }
            const response = await api.get(`${baseUrl}photos/${data.id}${pagination}`,{
                headers: {
                    Accept: 'application/json',
                  }
            })
            
            return {data:response.data, eventId:data.id}
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetched failed');
        }
    }
)

export const getDistricts = createAsyncThunk(
    'districts',
    async({}, thunkAPI) => {
        try{
            const response = await api.get(`${baseUrl}districts`,{
                headers: {
                    Accept: 'application/json',
                  }
            })
            return response.data
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetched failed');
        }
    }
)

export const searchImage = createAsyncThunk(
    'searchImage',
    async (formData, thunkAPI) => {
      try {
        const response = await RNFetchBlob.fetch(
          'POST',
          `${baseUrl}search-by-upload`, 
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: 'image',
              filename: formData.fileName || 'upload.jpg',
              type: formData.type || 'image/jpeg',
              data: RNFetchBlob.wrap(formData.uri.replace('file://', '')),
            },
          ]
        );
        if(response.error) return [];
        console.log('-lsjldjflsjdlfsdf', response)
        return response.json(); 
      } catch (error) {
        console.log('error in searchImage', error);
        return thunkAPI.rejectWithValue(error.message || 'Upload failed');
      }
    }
  );

export const searchEvent = createAsyncThunk(
    'eventSearch', 
    async (search, thunkAPI) => {
        try{
            const response = await api.post(`${baseUrl}master-search`,{
                query: search
            })
            return response.data
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response || 'Fetched failed');
        }
    }
)

export const searchEventByDistrict = createAsyncThunk(
    'searchEventByDistrict',
    async (district, thunkAPI) => {
        try{
        const response = await api.get(`${baseUrl}albums-by-district?name=${district}&page=1&limit=16`)
        return response.data.albums
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response || 'Fetched failed');
        }
    }
    
)

export const getUserDownload = createAsyncThunk('getUserDownload', 
async(userId, thunkAPI)=> {
    try{
        const response = await api.post(`${baseUrl}get-user-download-count`,{
            userId
        })
        console.log(response,'get download list')
        return response.data
    }
    catch(error){
        return thunkAPI.rejectWithValue(error.response || 'Fetched failed');
    }
})


export const getUserDownloadHistory = createAsyncThunk('getUserDownloadHistory', 
async(userId, thunkAPI)=> {
    try{
        const response = await api.post(`${baseUrl}get-download-history`,{
            userId
        })
        return response?.data?.history
    }
    catch(error){
        return thunkAPI.rejectWithValue(error.response || 'Fetched failed');
    }
})

export const recordDownloadHistory = createAsyncThunk('storeDownloadHistory', 
async(data, thunkAPI)=> {
    console.log(data, 'datadatadatadata')
    try{
        const response = await api.post(`${baseUrl}record-download-history`,{
            download:data.download,
            userId:data.userId
        })
     
        return response.data
    }
    catch(error){
        console.log('eeeee', error)
        return thunkAPI.rejectWithValue(error.response || 'Fetched failed');
    }
})
