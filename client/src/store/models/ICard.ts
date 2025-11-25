import { ITopic } from "./ITopic";

export interface ICard{
    term:string;
    definition:string, 
    positionInTheCollection:number, 
    privilege:boolean, 
    topic:ITopic;
    createdAt?: string;
    recentlyWatched?: string;
    _id: string;
}
export interface CardsState{
   cards:ICard[], 
   isLoading:boolean, 
   error:string,
}
export interface RequestCardsData{
    cards:RequestCard[], 
    folderID:string, 
    topicID:string
}
export interface RequestCard{
    term:string, 
    definition:string,
    positionInTheCollection:number
}