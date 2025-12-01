import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AddFlashCard } from "./AddFlashCard";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useOurContext } from "../contexts/ThemeContext";
import { useAppDispatch } from "../store/hooks/redux";
import { asyncCreateTopic } from "../store/reducers/slice/TopicSlice";
import { asyncCreateCards } from "../store/reducers/slice/CardsSlice";
import React from "react";

 const NewFlashCardSet = React.memo(() => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [countCard, setCountCard] = useState<number[]>([1]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cards, setCards] = useState<
    Map<number, { term: string; definition: string }>
  >(new Map([[1, { term: "", definition: "" }]]));

  const [searchParams] = useSearchParams();
  const { id } = useOurContext();

  const handelOnChange = useCallback(() => {
    setCountCard((prev)=>{
       const lastNumber = prev.at(-1) ?? 0;
       return [...prev, lastNumber]
    })
  },[]);

  const titleHandelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  },[]);

  const descriptionHandelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  },[]);

  const deleteCardButton = useCallback((id: number) => {
    setCountCard((prev)=> prev.filter(el=>el!==id))
    setCards((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  },[]);

  const newInfoInCard = useCallback((id: number, term: string, definition: string) => {
    setCards((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, { term: term, definition: definition });
      return newMap;
    });
  },[]);

  useEffect(()=>{
    setCards((prev)=>{
      const newMap= new Map(prev)
      let changed=false

      countCard.forEach(id=>{
        if(!newMap.has(id)){
          newMap.set(id, {term:'', definition:''})
          changed=true
        }
      })
      return changed? newMap:prev
    })
  }, [countCard])

  const saveCardSetButton = useCallback(async () => {
    try {
      const folderID = searchParams.get("folderID");
      if (cards.size === 0 || !folderID) {
        alert("Добавьте хотя бы одну карточку");
        return;
      }
      const cardsArray = Array.from(cards.entries()).map(([id, card]) => ({
        positionInTheCollection: id,
        term: card.term,
        definition: card.definition,
      }));


      const responseTopic = await dispatch(
        asyncCreateTopic({
          title,
          description,
          folderID,
          userID: id,
        })
      ).unwrap();

      if (!responseTopic) {
        console.log("не получилось создать топик");
        return;
      }

      const response = await dispatch(
        asyncCreateCards({
          cards: cardsArray,
          folderID,
          topicID: responseTopic._id,
        })
      ).unwrap();

      if (response) {
        alert("set was created!!!!");
        setTitle("");
        setDescription("");
        navigate("/homepage");
      }
    } catch (err) {
      console.error("Ошибка при создании набора карточек:", err);
      alert("Произошла ошибка при создании набора карточек");
    }
  },[cards, title, description, searchParams, id, dispatch, navigate]);
  return (
    <>
      <div className="fixed inset-0 bg-[#a50808] -z-10"></div>

      <div className="min-h-screen bg-[#1a1616]">
        <header className="bg-[#292626] shadow-sm border-b border-[#4c4848]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-white">
                Create flashcard set
              </h1>
              <nav>
                <ul className="flex space-x-8">
                  <Link to="/homepage">
                    <li className="text-gray-300 hover:text-[#a50808] cursor-pointer font-medium transition-colors duration-200">
                      {" "}
                      Home
                    </li>
                  </Link>
                  <li className="text-gray-300 hover:text-[#a50808] cursor-pointer font-medium transition-colors duration-200">
                    Test
                  </li>
                  <li className="text-gray-300 hover:text-[#a50808] cursor-pointer font-medium transition-colors duration-200">
                    Folders
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 py-3 bg-[#292626] border border-[#4c4848] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] transition-all duration-200 text-lg font-medium"
              onChange={titleHandelChange}
              value={title}
            />
            <input
              type="text"
              placeholder="Add a description.."
              className="w-full px-4 py-3 bg-[#292626] border border-[#4c4848] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] transition-all duration-200"
              onChange={descriptionHandelChange}
              value={description}
            />
          </div>
        </article>

        <main className="flex justify-center px-4 sm:px-6 lg:px-8 pb-8">
          <div className="w-full max-w-6xl space-y-6">
            {countCard.map((el) => (
                <AddFlashCard
                  key={el}
                  id={el}
                  deleteCardButton={deleteCardButton}
                  newInfoInCard={newInfoInCard}
                />
              )
            )}
          </div>
        </main>

      
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 pb-8">
          <div className="w-full max-w-xl flex justify-center gap-6">
            {" "}
            <button
              type="button"
              onClick={handelOnChange}
              className="flex-1 px-8 py-4 bg-[#a50808] hover:bg-[#c50909] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg max-w-xs"
            >
              <span className="text-lg">+</span>
              <span>Add Card</span>
            </button>
            {/* Кнопка сохранения - более интересная */}
            <button
              type="button"
              onClick={saveCardSetButton}
              className="flex-1 px-8 py-4 bg-[#158735] hover:bg-[#2abf55] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg max-w-xs"
            >
              <span className="text-lg">⭐</span>
              <span>Save Set</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
});
export default NewFlashCardSet