import axios from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useOurContext } from "../contexts/ThemeContext";

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

interface Folder {
  _id: string;
  folderName: string;
  privilege: boolean;
  topic: any[];
  user: string;
  createdAt?: string;
  recentlyWatched?: string;
  __v?: number;
}

export const HomePage = () => {
  const { id } = useOurContext();
  const navigate = useNavigate();
  const [isModelOpen, setIsModalOpen] = useState(false);
  const [option, setOption] = useState("create");
  const [inputFolderName, setInputFolderName] = useState("");
  const [myFolders, setMyFolders] = useState<Folder[]>();
  const [selectFolderID, setSelectFolderID] = useState<String>("");
  const handelInputFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFolderName(e.target.value);
  };
  const saveFolderChoose = () => {

    closePortal();
    navigate(`/homepage/newflashcardset?folderID=${selectFolderID}`)

  };
  const openPortal = () => {
    setIsModalOpen(true);
  };

  const closePortal = () => {
    setIsModalOpen(false);
  };
  const folderFromServer = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/homepage/${id}`);
      setMyFolders(res.data);
      if(res.data.length>0)
      setSelectFolderID(res.data[0]._id)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    folderFromServer();
  }, [id, myFolders]);

  const createNewFolder = async () => {
    try {
      if (!id) {
        console.error("user id is missing");
        return;
      }
      const res = await axios.post(`http://localhost:4000/api/homepage/${id}`, {
        nameFolder: inputFolderName,
      });
      if (res.status === 200) {
        closePortal();
        setInputFolderName("");
        folderFromServer();
        navigate(`/homepage/newflashcardset?folderID=${res.data._id}`);

      }
    } catch (err) {
      console.error("ошибка создания папки", err);
      if (axios.isAxiosError(err)) {
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
      }
    }
  };
  const createOrSaveChoose=()=>{
    return option==='exist'?saveFolderChoose():createNewFolder()
  }
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
                      {myFolders?.map((folder) => (
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
            <select className="px-4 py-2 border border-[#4c4848] rounded-lg focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] outline-none transition-all duration-200 bg-[#292626] text-white">
              <option value="recently">Recently watched</option>
              <option value="oldest">From oldest</option>
              <option value="youngest">From youngest</option>
              <option value="favorite">Favorite</option>
            </select>
            <input
              type="text"
              placeholder="Found my modules"
              className="flex-1 px-4 py-2 border border-[#4c4848] rounded-lg focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] outline-none transition-all duration-200 placeholder-[#a4a1a1] bg-[#292626] text-white"
            />
          </div>
          <button className="text-white" onClick={openPortal}>
            dwdedwe
          </button>
          {/* Grid с двумя колонками и фиксированной первой карточкой */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            onClick={openPortal}
          >
            {/* Фиксированная карточка для добавления */}
            {/*<Link to='newflashcardset'>*/}

            <div className="bg-[#292626]rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border-2 border-dashed border-[#4c4848] hover:border-red-500 cursor-pointer group">
              <div className="flex flex-col items-center justify-center h-48 text-[#a4a1a1] group-hover:text-red-500 transition-colors duration-200">
                <svg
                  className="w-16 h-16 mb-4"
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
                <p className="text-xl font-semibold">Add new module</p>
                <p className="text-sm mt-2 text-[#a4a1a1] group-hover:text-[#c5bdbd]">
                  Click to create a new flashcard set
                </p>
              </div>
            </div>
            {/*</Link>*/}

            {/* Остальные карточки */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-[#292626] rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border border-[#4c4848] hover:border-red-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-[#413d3d] rounded w-3/4"></div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-[#a50808] rounded-full"></div>
                    <div className="w-6 h-6 bg-[#413d3d] rounded-full"></div>
                  </div>
                </div>
                <div className="h-4 bg-[#413d3d] rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-[#413d3d] rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-[#413d3d] rounded w-1/3 mb-6"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#a50808] rounded-full"></div>
                    <div className="h-3 bg-[#413d3d] rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-[#a50808] rounded w-16"></div>
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
                onChange={(e) => {
                  setOption(e.target.value);
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
              onChange={(e) => {
                setOption(e.target.value);
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
            <select onChange={(e)=>{setSelectFolderID(e.target.value)}}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              {myFolders?.map((folder) => (
                <option
                  key={folder._id}
                  value={folder._id}
                  onClick={() => {
                    setSelectFolderID(folder._id);
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
            onClick={closePortal}
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
  );
};
