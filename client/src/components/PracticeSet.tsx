import React, { useCallback, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useOurContext } from "../contexts/ThemeContext"
import { useAppDispatch } from "../store/hooks/redux"
import { asyncCardsFromSetServer } from "../store/reducers/slice/PracticeSetSlice"

const PracticeSet=React.memo(()=>{
    const [searchParams]= useSearchParams()
    const setID = searchParams.get('setID')
    const { id } = useOurContext();
    const dispatch = useAppDispatch();


    useEffect(()=>{
      
          if(id && setID){
        dispatch(asyncCardsFromSetServer({id, setID}))
        .then((response)=>console.log(response.payload))
       }
    },[id, setID, dispatch])
    return <></>
})
export default  PracticeSet