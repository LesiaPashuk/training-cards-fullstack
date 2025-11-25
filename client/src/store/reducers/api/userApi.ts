
import axios from "axios";
import { IUser } from '../../models/IUser'
import { RequestType } from '../../models/IUser';

export const userApi={
    login: async(data:{ email: string; password: string }):Promise<IUser>=>{
        const response = await axios.post('http://localhost:4000/api/', data)
        return response.data
    },
    create:async(data:RequestType):Promise<IUser>=>{
       const response = await axios.post('http://localhost:4000/api/register', data)
       return response.data
    }
}
