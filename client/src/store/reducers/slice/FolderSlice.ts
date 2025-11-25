import axios from "axios";
import { FoldersState, IFolder } from "../../models/IFolder";
import { createAsyncThunk, createSlice, isRejectedWithValue, PayloadAction } from '@reduxjs/toolkit'
import { foldersApi } from "../api/folderApi";

const initialState:FoldersState={
    folders:[], 
    isLoading:false, 
    error:""
}

export const asyncFoldersLoading = createAsyncThunk(
    'folder/asyncFoldersLoading', 
    async(id:string, {rejectWithValue})=>{
        try{
            return await foldersApi.loadingExist(id)
        }
        catch(err){
            return rejectWithValue(err.message)
        }
    }
)
export const asyncFolderCreate=createAsyncThunk(
    'folder/asyncFolderCreate',
    async(data:{folderName:string, id:string}, {rejectWithValue})=>{
        try{
            if (!data.id) {
            console.error("user id is missing");
            return;
      }
      return await foldersApi.create(data.folderName, data.id)
        } 
        catch(err){
            return rejectWithValue(err.message)
        }
    }
)
export const foldersSlice= createSlice({
    name:"folders", 
    initialState, 
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(asyncFoldersLoading.pending, (state)=>{
            state.isLoading=true
            state.error=''
        })
        .addCase(asyncFoldersLoading.fulfilled, (state, action)=>{
            state.isLoading=false
            state.folders=action.payload
            state.error=''
        })
        .addCase(asyncFoldersLoading.rejected, (state, action)=>{
            state.isLoading=false
            state.error=action.payload as string
        })
        .addCase(asyncFolderCreate.pending, (state)=>{
            state.isLoading=true
            state.error=''
        })
        .addCase(asyncFolderCreate.fulfilled, (state, action)=>{
            state.isLoading=false
            action.payload?state.folders.push(action.payload):state.folders
            state.error=''
        })
        .addCase(asyncFolderCreate.rejected, (state, action)=>{
            state.isLoading=false
            state.error=action.payload as string
        })
    }
})
export default foldersSlice.reducer