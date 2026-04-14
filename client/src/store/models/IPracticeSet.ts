import { ICard } from "./ICard";

export interface PracticeSetState{
   cards:ICard[], 
   allCards:ICard[],
   isLoading:boolean, 
   error:string,
}
export interface RequestPracticeSetData{
   id:string,
   setID:string, 
   
}