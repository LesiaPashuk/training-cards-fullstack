import axios from "axios";
import { ICard, RequestCardsData } from "../../models/ICard";
import { RequestPracticeSetData } from "../../models/IPracticeSet";
export const cardsApi = {
    create:async(data:RequestCardsData):Promise<ICard[]>=>{
        const response = await axios.post(`http://localhost:4000/api/homepage/newflashcardset/cards`, data)
        return response.data
    },
    changePrivilageStatus:async(id:string):Promise<ICard>=>{
        const response = await axios.patch(`http://localhost:4000/api/homepage/cards`, {id})
        return response.data
    }, 
    getFromSet:async(data:RequestPracticeSetData):Promise<ICard[]>=>{
        const response = await axios.get(`http://localhost:4000/api/homepage/practice-set`, {params:data})
        return response.data
    },
    getAllUserCards:async(userId:string):Promise<ICard[]>=>{
        const response = await axios.get(`http://localhost:4000/api/homepage/all-cards`, {params:{id:userId}})
        return response.data
    }
}