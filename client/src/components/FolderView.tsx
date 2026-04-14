import React, { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const FolderView = React.memo(()=>{
  const [searchParams] = useSearchParams()
  const folderID = searchParams.get('folderID')
  const navigate = useNavigate()
  const folders = useSelector((state: RootState)=>state.folders.folders)
  const topics = useSelector((state: RootState)=>state.topics.topics)

  const folder = useMemo(()=>folders.find(f=>f._id===folderID), [folders, folderID])
  const topicsInFolder = useMemo(()=> topics.filter(t=> t.folder && t.folder._id === folderID || (t.folderName && Array.isArray(t.folderName) && t.folderName.includes(folder?.folderName || ''))), [topics, folder, folderID])

  const navigateOnPracticePage= (setID:string)=>{
    navigate(`/homepage/practice?setID=${setID}`)
  }

  if(!folderID) return <div className="p-8 text-white">Folder not specified</div>

  return (
    <div className="min-h-screen bg-[#1a1616] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{folder? folder.folderName : 'Folder'}</h2>
  <p className="text-gray-400 mb-6"></p>

        {topicsInFolder.length === 0 ? (
          <div className="text-gray-400">No sets in this folder.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {topicsInFolder.map(item=> (
              <div key={item._id} className="bg-[#292626] p-4 rounded-lg border border-[#4c4848] flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">{item.topicname}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-400 mr-4">{item.topicSize} cards</div>
                  <button onClick={()=>navigateOnPracticePage(item._id)} className="px-3 py-2 bg-red-600 rounded text-white">Practice</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default FolderView
