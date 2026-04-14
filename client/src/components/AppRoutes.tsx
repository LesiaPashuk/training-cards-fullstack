import React, { Suspense } from "react";
import { Routes,  Route } from "react-router-dom";
import { Loader } from "./Loader";
const LogInLazy = React.lazy(()=>import("./LogIn"))
const SignUpLazy = React.lazy(()=>import("./SignUp"))
const HomePageLazy = React.lazy(()=>import('./HomePage'))
const NewFlashCardSetLazy = React.lazy(()=>import("./NewFlashCardSet"))
const PracticeSetLazy= React.lazy(()=>import('./PracticeSet'))
const FolderViewLazy= React.lazy(()=>import('./FolderView'))
const StudyPageLazy = React.lazy(()=>import('./StudyPage'))
const TestPageLazy = React.lazy(()=>import('./TestPage'))

export const AppRoutes =React.memo(()=>{
    return (
        <Routes>
            <Route path='/' element={<Suspense fallback={<Loader></Loader>}><LogInLazy></LogInLazy></Suspense>}></Route>
            <Route path='/register' element={<Suspense fallback={<Loader></Loader>}><SignUpLazy ></SignUpLazy></Suspense>}></Route>
            <Route path='/homepage' element={<Suspense fallback={<Loader></Loader>}><HomePageLazy></HomePageLazy></Suspense>}></Route>
            <Route path='/homepage/newflashcardset' element={<Suspense fallback={<Loader></Loader>}><NewFlashCardSetLazy></NewFlashCardSetLazy></Suspense>}></Route>
            <Route path='/homepage/practice' element={<Suspense fallback={<Loader></Loader>}><PracticeSetLazy></PracticeSetLazy></Suspense>}></Route>
            <Route path='/homepage/folder' element={<Suspense fallback={<Loader></Loader>}><FolderViewLazy></FolderViewLazy></Suspense>}></Route>
            <Route path='/homepage/test' element={<Suspense fallback={<Loader></Loader>}><TestPageLazy></TestPageLazy></Suspense>}></Route>
            <Route path='/study/:setId' element={<Suspense fallback={<Loader></Loader>}><StudyPageLazy /></Suspense>} />
        </Routes>
    )
})