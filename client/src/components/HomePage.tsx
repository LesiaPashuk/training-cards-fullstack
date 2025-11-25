import axios from "axios";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useOurContext } from "../contexts/ThemeContext";
import { IFolder } from "../store/models/IFolder";
import { useAppDispatch } from "../store/hooks/redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  asyncFolderCreate,
  asyncFoldersLoading,
} from "../store/reducers/slice/FolderSlice";
import {
  closePortal,
  openPortal,
  changeSelectFolderID,
  changeOption,
} from "../store/reducers/slice/HomePageSlice";
import {
  asyncChangeSortOption,
  asyncChangeTopicPrivilageStatus,
  asyncTopicsFromServer,
  changeSortOption,
// sortFavorite,
  sortTopicByDateOldest,
  sortTopicByDateYoungest,
//  topicPrivilegeStar,
} from "../store/reducers/slice/TopicSlice";
import { SortOptionType } from "../store/models/ITopic";

export function SelectFolder({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  const modalRoot = document.getElementById("modal-root");
  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>,
    modalRoot
  );
}

export const HomePage = React.memo(() => {
  const { id } = useOurContext();
  const dispatch = useAppDispatch();
  const { folders } = useSelector((state: RootState) => state.folders);
  const { topics, sortOption } = useSelector(
    (state: RootState) => state.topics
  );
  const { isModelOpen, option, selectFolderID } = useSelector(
    (state: RootState) => state.homePageStore
  );
  const navigate = useNavigate();

  const [inputFolderName, setInputFolderName] = useState("");

  const handelInputFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFolderName(e.target.value);
  };
  const saveFolderChoose = () => {
    dispatch(closePortal());
    navigate(`/homepage/newflashcardset?folderID=${selectFolderID}`);
  };
  const fuoChangeSortOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
  
    let value = e.target.value;
    dispatch(asyncChangeSortOption({previousSortOption:sortOption, userID:id, sortOption:value as SortOptionType}));
    switch (value) {
      case "recentlyWatched":
        break;
      case "fromOldest":
        dispatch(sortTopicByDateOldest());
        break;
      case "fromYoungest":
        dispatch(sortTopicByDateYoungest());
        break;
      case "favorite":
       // dispatch(sortFavorite())
        break;
      default:

    }
  };
  const folderFromServer = async () => {
    const resolve = await dispatch(asyncFoldersLoading(id)).unwrap();
    dispatch(changeSelectFolderID(resolve[0]._id));
  };
  const topicsFromServer = async () => {
    console.log("сейчас будет диспач");
    const resolve = await dispatch(asyncTopicsFromServer(id)).unwrap();
    console.log(resolve);
  };
  
  useEffect(() => {
    topicsFromServer();
  }, [id]);

  useEffect(() => {
    folderFromServer();
  }, [id, folders]);

  const createNewFolder = async () => {
    try {
      const response = await dispatch(
        asyncFolderCreate({ folderName: inputFolderName, id })
      ).unwrap();

      if (response) {
        dispatch(closePortal());
        setInputFolderName("");
        folderFromServer();
        navigate(`/homepage/newflashcardset?folderID=${response._id}`);
      }
    } catch (err) {
      console.error("ошибка создания папки", err);
    }
  };
  const createOrSaveChoose = () => {
    return option === "exist" ? saveFolderChoose() : createNewFolder();
  };
  return (
    <>
      {/* Красный фон для всей области за пределами страницы */}
      <div className="fixed inset-0 bg-[#a50808] -z-10"></div>

      <div className="min-h-screen bg-[#1a1616]">
        <header className="bg-[#292626] shadow-sm border-b border-[#4c4848]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-white">Your library </h1>
              <nav>
                <ul className="flex space-x-8">
                  <li className="text-gray-300 hover:text-[#a50808] cursor-pointer font-medium transition-colors duration-200">
                    {" "}
                    New Flashcard set
                  </li>
                  <li className="text-gray-300 hover:text-[#a50808] cursor-pointer font-medium transition-colors duration-200">
                    Test
                  </li>
                  <li className="text-gray-300 hover:text-[#a50808] cursor-pointer font-medium transition-colors duration-200">
                    <select>
                      <option key="null">Folder</option>
                      {folders?.map((folder) => (
                        <option key={folder._id} value={folder.folderName}>
                          {folder.folderName}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <select
              onChange={fuoChangeSortOption}
              value={sortOption}
              className="px-4 py-2 border border-[#4c4848] rounded-lg focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] outline-none transition-all duration-200 bg-[#292626] text-white"
            >
               <option value="recentlyWatched"> All </option>
               <option value="favorite">Favorite</option>
              <option value="recentlyWatched">Recently watched</option>
              <option value="fromOldest">From oldest</option>
              <option value="fromYoungest">From youngest</option>
              
            </select>
            <input
              type="text"
              placeholder="Found my modules"
              className="flex-1 px-4 py-2 border border-[#4c4848] rounded-lg focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] outline-none transition-all duration-200 placeholder-[#a4a1a1] bg-[#292626] text-white"
            />
          </div>

          {/* Grid с двумя колонками и фиксированной первой карточкой */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Фиксированная карточка для добавления */}
            {/*<Link to='newflashcardset'>*/}

            <div
              onClick={() => dispatch(openPortal())}
              className="bg-gradient-to-r from-[#2a2626] to-[#1e1b1b] rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-dashed border-[#3a3535] hover:border-red-600 cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center h-40 text-white group-hover:text-red-400 transition-colors duration-200">
                <svg
                  className="w-16 h-16  mt-6 mb-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-xl font-semibold mb-1">Add new module</p>
                <p className="text-sm text-gray-400">
                  Click to create a new flashcard set
                </p>
              </div>
            </div>
            {/*</Link>*/}

            {}
            {topics?.map((item) => (
              <div
                key={item._id}
                className="bg-gradient-to-r from-[#2a2626] to-[#1e1b1b] rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-[#3a3535] hover:border-red-600 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-white font-bold text-xl leading-tight mb-2 group-hover:text-red-400 transition-colors">
                      {item.topicname}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button
  className="flex items-center justify-center w-8 h-8 focus:outline-none"
  aria-label={item.privilege ? "Убрать из избранного" : "Добавить в избранное"}
  onClick={() => dispatch(asyncChangeTopicPrivilageStatus(item._id))}
>
  {item.privilege ? (
    // Заполненная звезда
    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L6.36 21l1.47-7.46L2 9.27l7.19-.63L12 2l2.81 6.64 7.19.63-5.83 5.27L17.64 21z" />
    </svg>
  ) : (
    // Контур звезды
    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 2l2.81 6.64L22 9.27l-5.83 5.27L17.64 21 12 17.27 6.36 21l1.47-7.46L2 9.27l7.19-.63L12 2z" />
    </svg>
  )}
</button>

                    <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v14m7-7H5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      className="w-4 h-4 mr-2 opacity-75"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m8-12l-4 4m0 0l-4 4"
                      />
                    </svg>
                    <span>
                      Размер:{" "}
                      <span className="font-medium text-white">
                        {item.topicSize}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      className="w-4 h-4 mr-2 opacity-75"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l6 5 6-5m-6 5v6"
                      />
                    </svg>
                    <span>
                      Папки:{" "}
                      <span className="font-medium text-cyan-400">
                        {item.folderName.join(", ")}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#332e2e]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center ring-2 ring-red-800">
                      <span className="text-white font-semibold text-sm">
                        {item.createdAt?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs">
                      <div>Создано:</div>

                      <div className="font-medium text-white">
                        {item.createdAt
                          ?.substring(0, 10)
                          .split("-")
                          .reverse()
                          .join(".")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-red-900/50 rounded-full text-red-300 text-xs font-medium">
                      {item.privilege ? "Избранное" : "Активно"}
                    </div>
                    <button className="w-9 h-9 bg-[#332e2e] hover:bg-[#403a3a] rounded-full flex items-center justify-center transition-colors group-hover:scale-110">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <SelectFolder isOpen={isModelOpen}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Choose folder for new flashcard set
        </h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="options"
                value="create"
                checked={option === "create"}
                onChange={() => {
                  dispatch(changeOption("create"));
                }}
              />
              <span>New folder</span>
            </label>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="options"
              value="exist"
              checked={option === "exist"}
              onChange={() => {
                dispatch(changeOption("exist"));
              }}
            />
            <span>Existing folders</span>
          </label>

          {option === "create" ? (
            <input
              type="text"
              placeholder="Folder name"
              onChange={handelInputFolderName}
              value={inputFolderName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ) : (
            <select
              onChange={(e) => {
                dispatch(changeSelectFolderID(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {folders?.map((folder) => (
                <option
                  key={folder._id}
                  value={folder._id}
                  onClick={() => {
                    dispatch(changeSelectFolderID(folder._id));
                  }}
                >
                  {folder.folderName}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => dispatch(closePortal())}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={createOrSaveChoose}
            disabled={option === "create" && !inputFolderName.trim()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition duration-200"
          >
            Create
          </button>
        </div>
      </SelectFolder>
    </>
  
)
}
)