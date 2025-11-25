import { IFolder } from "./IFolder";
export interface IUser{
    _id: string;
    email:string;
    username:string;
    password?:string;
    __v?: number;
}
export interface UserState{
    user:IUser|null, 
    isLoading:boolean, 
    error:string, 
}
export type LogInFormDataType ={
    email:string, 
    password:string,
}
export type FormType = {
  username: string;
  email: string;
  passwordFirst: string;
  passwordSecond: string;
};
export type RequestType = {
  username: string;
  email: string;
  password: string;
}