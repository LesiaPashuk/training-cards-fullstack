import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from './reducers/slice/UserSlice'
import foldersReducer from './reducers/slice/FolderSlice'
import homePageReducer from './reducers/slice/HomePageSlice'
import cardsReducer from './reducers/slice/CardsSlice'
import topicReducer from './reducers/slice/TopicSlice'
const rootReducer= combineReducers({
    user:userReducer,
    folders:foldersReducer,
    homePageStore:homePageReducer,
    cards:cardsReducer,
    topics:topicReducer
})

export const setupStore=()=>{
    return configureStore({
        reducer: rootReducer
    })
}
export type RootState =ReturnType <typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']