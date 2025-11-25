import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CardsState, RequestCardsData } from '../../models/ICard';
import { cardsApi } from '../api/cardsApi';

const initialState:CardsState ={
    cards:[], 
    
    isLoading:false, 
    error:'',

}
export const asyncCreateCards= createAsyncThunk('cards/create', async(data :RequestCardsData, {rejectWithValue})=>{
    try{
        return await cardsApi.create(data)
    }
    catch(err){
        return rejectWithValue(err.message)
    }
} )

export const asynChangePrivilageStatus= createAsyncThunk('cards/changePrivilageStatus', async(id:string, {rejectWithValue})=>{
    try{
        return await cardsApi.changePrivilageStatus(id)
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})
export const cardsSlice =createSlice({
    name:'cards', 
    initialState, 
    reducers:{
    }, 
    extraReducers:(builder)=>{
        builder
        .addCase(asyncCreateCards.pending, (state)=>{
            state.isLoading= true
            state.error=''
        })
        .addCase(asyncCreateCards.fulfilled, (state, action)=>{
            state.isLoading=false, 
            state.error=''
            state.cards=action.payload
        })
        .addCase(asyncCreateCards.rejected, (state,action)=>{
            state.isLoading=false, 
            state.error=action.payload as string
        })
        .addCase(asynChangePrivilageStatus.pending, (state)=>{
            state.isLoading= true
            state.error=''
        })
        .addCase(asynChangePrivilageStatus.fulfilled,(state, action )=>{
            state.isLoading=false, 
            state.error=''
            const card =state.cards.find(card=>card._id===action.payload._id)
            if(card){
                card.privilege= action.payload.privilege;
            }
        })
        .addCase(asynChangePrivilageStatus.rejected, (state,action)=>{
            state.isLoading=false, 
            state.error = action.payload as string
        })
    }
})
export default cardsSlice.reducer