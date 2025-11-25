import axios from "axios";
import { FoldersState, IFolder } from "../../models/IFolder";
export const foldersApi ={
    loadingExist: async(id:string):Promise<IFolder[]>=>{
        const response = await axios.get(`http://localhost:4000/api/homepage/${id}`);
        return response.data 
    },
    create:async(nameFolder:string, id:string):Promise<IFolder>=>{
        const response = await axios.post(`http://localhost:4000/api/homepage/${id}`, {
        nameFolder,
      });
      return response.data
    }
}