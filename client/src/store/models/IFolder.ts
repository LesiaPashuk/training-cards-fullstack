
export interface IFolder{
    _id: string;
    folderName: string;
    privilege: boolean;
    user: string;
    createdAt?: string;
    recentlyWatched?: string;
    __v?: number;
}

export interface FoldersState{
folders:IFolder[], 
isLoading:boolean,
error:string, 
}
