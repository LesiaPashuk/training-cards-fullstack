import { useState } from "react"

type PropsType = {
  id: number, 
  deleteCardButton: (id: number) => void
  newInfoInCard:(id:number, term:string, definition:string)=>void
}

export const AddFlashCard = (props: PropsType) => {
  const [term, setTerm] = useState<string>('')
  const [definition, setDefinition] = useState<string>('')
  
  const termHandelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTerm(e.target.value)
   props.newInfoInCard(props.id, e.target.value, definition)
  }
  
  const definitionHandelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefinition(e.target.value)
    props.newInfoInCard(props.id, term, e.target.value)
  }
  
  const deleteCardButton = () => {
    props.deleteCardButton(props.id)
  }
  
  return (
    <div className="bg-[#292626] rounded-lg w-full shadow-md p-8 hover:shadow-lg transition-all duration-200 border border-[#4c4848] hover:border-[#a50808]">
      <div className="flex flex-col h-full">
        {/* Header with buttons */}
        <div className="flex justify-end mb-0 ">
          <div className="flex space-x-2">
            <button 
              type="button"
              className="w-8 h-8 bg-[#a50808] rounded-full flex items-center justify-center text-white hover:bg-[#c50909] transition-colors duration-200 text-sm font-bold"
              onClick={deleteCardButton}
            >
              ×
            </button>
            <button 
              type="button"
              className="w-8 h-8 bg-[#413d3d] rounded-full flex items-center justify-center text-gray-300 hover:bg-[#5a5555] hover:text-white transition-colors duration-200"
            >
              ↕
            </button>
          </div>
        </div>
        
        {/* Term and Definition side by side */}
        <div className="flex flex-1 gap-6 mb-7">
          {/* Term - Left Side */}
          <div className="flex-1">
            <label className="block text-gray-400 text-sm font-medium mb-2">Term</label>
            <textarea 
              placeholder="Enter term"
              className="w-full min-h-[30px] px-4 py-3 bg-[#413d3d] border border-[#5a5555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] transition-all duration-200 resize-none"
              rows={1}
              onChange={termHandelChange}
              value={term}
            />
          </div>
          
          {/* Definition - Right Side */}
          <div className="flex-1">
            <label className="block text-gray-400 text-sm font-medium mb-2">Definition</label>
            <textarea 
              placeholder="Enter definition"
              className="w-full h-full min-h-[120px] px-4 py-3 bg-[#413d3d] border border-[#5a5555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a50808] focus:border-[#a50808] transition-all duration-200 resize-none"
              rows={4}
              onChange={definitionHandelChange}
              value={definition}
            />
          </div>
        </div>
      </div>
    </div>
  )
}