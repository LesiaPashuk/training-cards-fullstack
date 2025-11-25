import axios from "axios";
import {ITopic,RequestTopicData} from "../../models/ITopic";
export const topicApi ={
    create: async(data:RequestTopicData):Promise<ITopic>=>{
       
        const response = await axios.post(`http://localhost:4000/api/homepage/newflashcardset/topic`,{
        title:data.title,
        description:data.description,
        folderID:data.folderID, 
        userID:data.userID
        })
        return response.data
   
    },
    getAll:async(userID:string):Promise<ITopic[]>=>{
        const response = await axios.get(`http://localhost:4000/api/homepage/newflashcardset/topic`,{params:{userID:userID}})
        return response.data
    },
    changeTopicPrivilageStatus:async(topicId:string):Promise<ITopic>=>{
        const response = await axios.patch(`http://localhost:4000/api/homepage/topic`, {topicId})
        return response.data
    },
    getFavoriteTopics:async(userID:string):Promise<ITopic[]>=>{
        const response = await axios.get(`http://localhost:4000/api/homepage/topic/favorite`, {params:{userID}})
        return response.data
        
    },
}