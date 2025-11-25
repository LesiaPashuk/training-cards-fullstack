import { HomePageState } from "../../models/IHomePage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { FormType, RequestType } from "../../models/IUser";

const initialState: HomePageState = {
  isModelOpen: false,
  option: "create",
  selectFolderID: "",
};

export const homePageSlice = createSlice({
  name: "home-page",
  initialState,
  reducers: {
    closePortal: (state) => {
      state.isModelOpen = false;
    },
    openPortal:(state) => {
      state.isModelOpen = true;
    },
    changeSelectFolderID:(state, action:PayloadAction<string>)=>{
        state.selectFolderID=action.payload
    }, 
    changeOption:(state, action:PayloadAction<'create'|'exist'>)=>{
        state.option=action.payload
    }
  },
});
export const { closePortal, openPortal,changeSelectFolderID,changeOption } = homePageSlice.actions;
export default homePageSlice.reducer;
