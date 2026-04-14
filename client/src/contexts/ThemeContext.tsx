import axios from "axios";
import React, { useCallback, useMemo } from "react";
import Reacr, { createContext, useState, useEffect, useContext, ReactNode} from "react";

interface ThemeContextType {
    id:string;
    setNewId:(newId:string)=>void;
}

export const ThemeContext = createContext<ThemeContextType|undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({children}:ThemeProviderProps){
    const [id, setId]=useState<string>(()=>localStorage.getItem('userID')||"");
    const setNewId=useCallback((newId:string)=>{
        setId(newId)
        localStorage.setItem('userID',newId)
    }, []) 
    const value = useMemo(()=>({id, setNewId}),[id, setNewId])
    return (
    
    React.createElement(
      ThemeContext.Provider,
      { value: { id, setNewId } },
      children
    )
  );
}

export function useOurContext(){
    const context=useContext(ThemeContext)
   if(!context){
    throw new Error('полетел мой контекст')
   }
   return context
}