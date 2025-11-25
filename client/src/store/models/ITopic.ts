import { IFolder } from "./IFolder";
import { IUser } from "./IUser";

export interface ITopic{
    _id: string;
    _v?:number;
    topicname:string;
    user:IUser, 
    description:string, 
    createdAt?: string;
    recentlyWatched?: string;
    folder:IFolder, 
    privilege:Boolean,
    topicSize:number, 
    folderName:String[]
}
export type RequestTopicData={
        title:string,
        description:string,
        folderID:string|null, 
        userID:string
}

export interface TopicState{
   topics:ITopic[], 
   copyTopics:ITopic[], 
   isLoading:boolean, 
   error:string,
   sortOption:SortOptionType
}
export type SortOptionType = 'recentlyWatched' | 'fromOldest' | 'fromYoungest' | 'favorite' | 'all';
