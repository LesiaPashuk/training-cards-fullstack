import React, { Suspense } from "react";
import { Routes,  Route } from "react-router-dom";
import { Loader } from "./Loader";
//import { SignUp } from "./SignUp";
//import { LogIn } from "./LogIn";
//import {HomePage} from './HomePage'
//import { NewFlashCardSet } from "./NewFlashCardSet";
const LogInLazy = React.lazy(()=>import("./LogIn"))
const SignUpLazy = React.lazy(()=>import("./SignUp"))
const HomePageLazy = React.lazy(()=>import('./HomePage'))
const NewFlashCardSetLazy = React.lazy(()=>import("./NewFlashCardSet"))

export const AppRoutes =React.memo(()=>{
    return (
        <Routes>
            <Route path='/' element={<Suspense fallback={<Loader></Loader>}><LogInLazy></LogInLazy></Suspense>}></Route>
            <Route path='/register' element={<Suspense fallback={<Loader></Loader>}><SignUpLazy ></SignUpLazy></Suspense>}></Route>
            <Route path='/homepage' element={<Suspense fallback={<Loader></Loader>}><HomePageLazy></HomePageLazy></Suspense>}></Route>
            <Route path='/homepage/newflashcardset' element={<Suspense fallback={<Loader></Loader>}><NewFlashCardSetLazy></NewFlashCardSetLazy></Suspense>}></Route>
        </Routes>
    )
})