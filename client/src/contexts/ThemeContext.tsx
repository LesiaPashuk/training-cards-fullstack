import axios from "axios";
import React from "react";
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
    const [id, setId]=useState<string>('');
    const setNewId=(newId:string)=>{
        setId(newId)
    }
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