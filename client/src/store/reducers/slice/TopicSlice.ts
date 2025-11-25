import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITopic, RequestTopicData, SortOptionType } from "../../models/ITopic";
import { TopicState } from "../../models/ITopic";
import { topicApi } from "../api/topicApi";

const initialState: TopicState = {
  topics: [],
  copyTopics: [],
  isLoading: false,
  error: "",
  sortOption: "all",
};
export const asyncCreateTopic = createAsyncThunk(
  "topic/create",
  async (data: RequestTopicData, { rejectWithValue }) => {
    try {
      if (!data.folderID || (data.folderID === null && !data.userID)) {
        alert("Не указана папка для сохранения");
        return rejectWithValue("Не указана папка для сохранения");
      }
      if (!data.title.trim() || !data.description.trim()) {
        alert("Заполните название и описание");
        return;
      }
      return await topicApi.create(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const asyncTopicsFromServer = createAsyncThunk(
  "topic/get",
  async (userID: string, { rejectWithValue }) => {
    try {
      return await topicApi.getAll(userID);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const asyncChangeTopicPrivilageStatus = createAsyncThunk(
  "topic/patch",
  async (topicId: string, { rejectWithValue }) => {
    try {
      return await topicApi.changeTopicPrivilageStatus(topicId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const asyncFavoriteTopics = createAsyncThunk(
  "topic/getFavoriteTopics",
  async (userID: string, { rejectWithValue }) => {
    try {
      return await topicApi.getFavoriteTopics(userID);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const asyncChangeSortOption = createAsyncThunk(
  "topic/changeSortAndLoad",
  async (
    {
      sortOption,
      userID,
      previousSortOption,
      
    }: {
      sortOption: SortOptionType;
      userID: string;
      previousSortOption: SortOptionType;
    },
    { dispatch }
  ) => {
    try {
      if (previousSortOption === "favorite" && sortOption !== "favorite") {
        await dispatch(asyncTopicsFromServer(userID));
      }
      if (sortOption === "favorite") {
        await dispatch(asyncFavoriteTopics(userID));
        
      }
     // dispatch(changeSortOption(sortOption))
      return sortOption ;
    } catch (err) {throw new Error(err.message)}
  }
);

export const topicSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    changeSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    sortTopicByDateYoungest: (state) => {
      state.topics.sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          return dateB.valueOf() - dateA.valueOf();
        }
        return 0;
      });
    },
    sortTopicByDateOldest: (state) => {
      state.topics.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        let dateA = new Date(a.createdAt);
        let dateB = new Date(b.createdAt);
        return dateA.valueOf() - dateB.valueOf();
      });
    } /*,
    sortFavorite:(state)=>{
      state.topics =state.topics.filter((topic)=>{ return topic.privilege})
      console.log(state.topics)
    }*/,
  },

  extraReducers: (builder) => {
    builder
      .addCase(asyncCreateTopic.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(asyncCreateTopic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        action.payload?._id ? state.topics.push(action.payload) : state.topics;
      })
      .addCase(asyncCreateTopic.rejected, (state, action) => {
        (state.isLoading = false), (state.error = action.payload as string);
      })
      .addCase(asyncTopicsFromServer.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(asyncTopicsFromServer.fulfilled, (state, action) => {
        (state.isLoading = false), (state.error = "");
        state.topics = action.payload;
      })
      .addCase(asyncTopicsFromServer.rejected, (state, action) => {
        (state.isLoading = false), (state.error = action.payload as string);
      })
      .addCase(asyncChangeTopicPrivilageStatus.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(asyncChangeTopicPrivilageStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const topic = state.topics.find(
          (topic) => topic._id === action.payload._id
        );
        if (topic) {
          topic.privilege = action.payload.privilege;
        }
      })
      .addCase(asyncChangeTopicPrivilageStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(asyncFavoriteTopics.pending, (state) => {
        (state.isLoading = true), (state.error = "");
      })
      .addCase(asyncFavoriteTopics.fulfilled, (state, action) => {
        (state.isLoading = false), (state.error = "");
        state.topics = action.payload;
      })
      .addCase(asyncChangeSortOption.pending, (state, action) => {
        (state.isLoading = true), (state.error = "");
      })
      .addCase(asyncChangeSortOption.fulfilled, (state, action) => {
        (state.isLoading = false), (state.error = ""), (state.sortOption=action.payload)
      });
  },
});
export const {
  sortTopicByDateYoungest,
  sortTopicByDateOldest,
  changeSortOption,
} = topicSlice.actions;
export default topicSlice.reducer;
