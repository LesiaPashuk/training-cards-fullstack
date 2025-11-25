import axios from "axios";
import { ICard, RequestCardsData } from "../../models/ICard";
export const cardsApi = {
    create:async(data:RequestCardsData):Promise<ICard[]>=>{
        const response = await axios.post(`http://localhost:4000/api/homepage/newflashcardset/cards`, data)
        return response.data
    },
    changePrivilageStatus:async(id:string):Promise<ICard>=>{
        const response = await axios.patch(`http://localhost:4000/api/homepage/cards`, {id})
        return response.data
    }
}