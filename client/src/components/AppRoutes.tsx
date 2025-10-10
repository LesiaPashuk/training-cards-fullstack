import React from "react";
import { Routes,  Route } from "react-router-dom";
import { SignUp } from "./SignUp";
import { LogIn } from "./LogIn";
import {HomePage} from './HomePage'
import { NewFlashCardSet } from "./NewFlashCardSet";
export const AppRoutes =()=>{
    return (
        <Routes>
            <Route path='/' element={<LogIn></LogIn>}></Route>
            <Route path='/register' element={<SignUp></SignUp>}></Route>
            <Route path='/homepage' element={<HomePage></HomePage>}></Route>
            <Route path='/homepage/newflashcardset' element={<NewFlashCardSet></NewFlashCardSet>}></Route>
        </Routes>
    )
}