import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CardsState, RequestCardsData } from '../../models/ICard';
import { cardsApi } from '../api/cardsApi';
import { PracticeSetState, RequestPracticeSetData } from '../../models/IPracticeSet';

const initialState:PracticeSetState={
    cards:[], 
    allCards:[],
    isLoading:false, 
    error:''
}

export const asyncCardsFromSetServer= createAsyncThunk('cards/getFromSet', async(data:RequestPracticeSetData, {rejectWithValue})=>{
    try {
        return await cardsApi.getFromSet(data)
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

export const asyncAllCardsFromServer= createAsyncThunk('cards/getAllCards', async(data:{id:string}, {rejectWithValue})=>{
    try {
        return await cardsApi.getAllUserCards(data.id)
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

export const practiceSetSlice = createSlice({
    name:'practiceSet', 
initialState, 
reducers:{},
extraReducers:(builder)=>{
    builder
    .addCase(asyncCardsFromSetServer.pending, (state)=>{
        state.isLoading= true, 
        state.error=''
    })
    .addCase(asyncCardsFromSetServer.fulfilled, (state, action)=>{
        state.isLoading= false, 
        state.error='', 
        state.cards=action.payload
    })
    .addCase(asyncCardsFromSetServer.rejected, (state, action)=>{
        state.isLoading=false, 
        state.error=action.payload as string
    })
    .addCase(asyncAllCardsFromServer.pending, (state)=>{
        state.isLoading= true, 
        state.error=''
    })
    .addCase(asyncAllCardsFromServer.fulfilled, (state, action)=>{
        state.isLoading= false, 
        state.error='', 
        state.allCards=action.payload
    })
    .addCase(asyncAllCardsFromServer.rejected, (state, action)=>{
        state.isLoading=false, 
        state.error=action.payload as string
    })
}})

export default practiceSetSlice.reducer
