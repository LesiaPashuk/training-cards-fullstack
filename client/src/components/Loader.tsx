import React from "react";

export const Loader = () => (
  <div className="min-h-screen bg-gradient-to-r from-[#5e041f] via-[#c92e2e] to-[#ffbaba] flex flex-col items-center justify-center p-4">

    <div className="mb-8 text-center">
      <div className="text-4xl font-bold text-white mb-2">FlashCards</div>
      <div className="text-gray-200">Master your knowledge</div>
    </div>
    
    {/* Анимированный спиннер */}
    <div className="relative w-20 h-20 mb-8">
      <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-white border-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-4 border-4 border-[#ffbaba]/50 rounded-full animate-pulse"></div>
    </div>
    
    {/* Прогресс текст */}
    <div className="text-white text-lg font-medium mb-2">Loading your cards...</div>
    
    {/* Анимированные точки */}
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
    
    <div className="mt-12 max-w-md text-center">
      <div className="text-gray-200 italic text-sm">
        "Repetition is the mother of learning"
      </div>
    </div>
  </div>
);