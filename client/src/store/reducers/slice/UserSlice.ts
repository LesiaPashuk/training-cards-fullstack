import { UserState,LogInFormDataType} from "../../models/IUser";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userApi } from "../api/userApi";
import { FormType, RequestType } from "../../models/IUser";

const initialState:UserState={
    user:null, 
    isLoading:false, 
    error:""
}
export const asyncUserLoading=createAsyncThunk(
    'user/asyncUserLoading', 
    async(data:LogInFormDataType, {rejectWithValue})=>{
        try{
            return await userApi.login(data)
        }
        catch(err){
            return rejectWithValue(err.message)
        }
}
)
export const asyncCreateUser = createAsyncThunk(
    'user/create', 
    async(data:FormType, {rejectWithValue})=>{
        try{
            if(data.passwordFirst!==data.passwordSecond){
               return rejectWithValue("Passwords don't match");
            }
            const dataForRequest: RequestType= { 
                        username:data.username, 
                        email:data.email, 
                        password:data.passwordFirst, 
                        
        }
            return await userApi.create(dataForRequest)
        }
        catch(err){
            return rejectWithValue(err.message)
        }
    }
)
export const userSlice = createSlice({
    name:"user", 
    initialState, 
    reducers:{ }, 
    extraReducers:(builder)=>{
        builder
        .addCase(asyncUserLoading.pending, (state)=>{
            state.isLoading=true
            state.error=""
        })
        .addCase(asyncUserLoading.fulfilled,(state, action)=>{
            state.isLoading=false
            state.error=""
            state.user= action.payload
        } )
        .addCase(asyncUserLoading.rejected,(state, action)=>{
            state.isLoading=false, 
            state.error=action.payload as string
        })
        .addCase(asyncCreateUser.pending, (state)=>{
            state.isLoading=true
            state.error=""
        })
        .addCase(asyncCreateUser.fulfilled, (state, action)=>{
            state.isLoading=false
            state.error=""
            state.user = action.payload;
        })
        .addCase(asyncCreateUser.rejected, (state, action)=>{
            state.isLoading=false
            state.error=action.payload as string
        })
    }
    
})

export default userSlice.reducer;
