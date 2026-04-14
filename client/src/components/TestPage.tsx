import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks/redux';
import { RootState } from '../store/store';
import { asyncAllCardsFromServer } from '../store/reducers/slice/PracticeSetSlice';
import { useOurContext } from '../contexts/ThemeContext';

const TEST_STORAGE_KEY = 'test-progress';

type SideType = 'front' | 'back';

const TestPage = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: userId } = useOurContext();
  
  const allCards = useSelector((state: RootState) => state.practiceSet.allCards || []);
  const isLoading = useSelector((state: RootState) => state.practiceSet.isLoading);
  
  const [current, setCurrent] = useState(0);
  const [side, setSide] = useState<SideType>('front');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [orderedCards, setOrderedCards] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(asyncAllCardsFromServer({ id: userId }));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem(TEST_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrent(data.current || 0);
        setSide(data.side || 'front');
        setAnswers(data.answers || {});
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      TEST_STORAGE_KEY,
      JSON.stringify({ current, side, answers })
    );
  }, [current, side, answers]);

  useEffect(() => {
    if (!allCards || allCards.length === 0) return;
    
    let arr = [...allCards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    setOrderedCards(arr);
    setCurrent(0);
    setAnswers({});
  }, [allCards]);

  const card = orderedCards[current];
  const total = orderedCards.length;

  const handleAnswer = (know: boolean) => {
    if (!card) return;
    setAnswers((prev) => ({ ...prev, [card._id]: know }));
  };

  const currentAnswered = card && (card._id in answers);

  const handleNext = () => {
    if (current < total - 1 && currentAnswered) {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
    }
  };

  const handleFlip = () => {
    setSide((s) => (s === 'front' ? 'back' : 'front'));
    setIsFlipped(!isFlipped);
  };

  const finished = Object.keys(answers).length === total && total > 0;
  const correct = Object.values(answers).filter(Boolean).length;
  const incorrect = Object.values(answers).filter((v) => !v).length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const clearProgress = useCallback(() => {
    localStorage.removeItem(TEST_STORAGE_KEY);
    setCurrent(0);
    setSide('front');
    setAnswers({});
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-br from-[#1a1616] via-[#1a1616] to-[#2a2222]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-4xl">⚙️</div>
        <div className="text-xl">Loading cards...</div>
      </div>
    </div>;
  }

  if (total === 0 && !finished) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-br from-[#1a1616] via-[#1a1616] to-[#2a2222] flex-col gap-4 px-4">
        <div className="bg-gradient-to-br from-[#292626] to-[#1e1b1b] rounded-3xl shadow-2xl p-8 border border-[#3a3535] text-center">
          <div className="text-3xl mb-4">📚</div>
          <div className="text-2xl font-bold mb-4">No cards available</div>
          <div className="text-gray-400 mb-6">Create flashcards to start the test</div>
          <button 
            onClick={() => navigate('/homepage')} 
            className="px-8 py-3 bg-gradient-to-r from-[#a50808] to-[#d60a0a] rounded-lg text-white font-semibold hover:from-[#c50909] hover:to-[#ff4444] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🏠 Back to home
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1616] via-[#1a1616] to-[#2a2222] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#292626] to-[#1e1b1b] rounded-3xl shadow-2xl p-8 md:p-12 min-w-[340px] md:min-w-[420px] flex flex-col items-center border border-[#3a3535] backdrop-blur-sm">
          <div className="text-5xl mb-6">📊</div>
          <div className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#a50808] to-[#ff6b6b] bg-clip-text text-transparent">Test Results</div>
          
          <div className="w-full mb-8 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1616] border border-cyan-900/30">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📚</div>
                <div>
                  <div className="text-sm text-gray-400">Total cards</div>
                  <div className="text-2xl font-bold text-cyan-400">{total}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1616] border border-green-900/30">
              <div className="flex items-center gap-3">
                <div className="text-3xl">✅</div>
                <div>
                  <div className="text-sm text-gray-400">Correct answers</div>
                  <div className="text-2xl font-bold text-green-400">{correct}/{total}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Score</div>
                <div className="text-xl font-semibold text-green-400">{Math.round((correct / total) * 100)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1616] border border-red-900/30">
              <div className="flex items-center gap-3">
                <div className="text-3xl">❌</div>
                <div>
                  <div className="text-sm text-gray-400">Wrong answers</div>
                  <div className="text-2xl font-bold text-red-400">{incorrect}/{total}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Score</div>
                <div className="text-xl font-semibold text-red-400">{Math.round((incorrect / total) * 100)}%</div>
              </div>
            </div>

            <div className="w-full bg-[#1a1616] rounded-lg overflow-hidden border border-[#3a3535] p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Overall result</span>
                <span className="text-sm font-semibold text-cyan-400">{percent}%</span>
              </div>
              <div className="w-full bg-[#2a2626] rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8 w-full">
            <button 
              className="w-full px-6 py-3 bg-gradient-to-r from-[#a50808] to-[#d60a0a] rounded-lg text-white font-semibold hover:from-[#c50909] hover:to-[#ff4444] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={clearProgress}
            >
              🔄 Retake test
            </button>
            <button 
              className="w-full px-6 py-3 bg-gradient-to-r from-[#292626] to-[#1e1b1b] rounded-lg text-white font-semibold hover:from-[#3a3535] hover:to-[#2a2626] transition-all duration-200 shadow-lg hover:shadow-xl border border-[#3a3535] hover:border-[#a50808]"
              onClick={() => { clearProgress(); navigate('/homepage'); }}
            >
              🏠 Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-br from-[#1a1616] via-[#1a1616] to-[#2a2222]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-4xl">⚙️</div>
        <div className="text-xl">Loading...</div>
      </div>
    </div>;
  }

// ... (начало кода без изменений до return)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1616] via-[#1a1616] to-[#2a2222] text-white flex flex-col">
      <div className="relative bg-gradient-to-r from-[#292626] to-[#1e1b1b] shadow-xl border-b border-[#4c4848]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a50808] via-[#d60a0a] to-transparent"></div>
        
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => { clearProgress(); navigate('/homepage'); }} 
            className="text-white bg-gradient-to-r from-[#a50808] to-[#d60a0a] px-5 py-2 rounded-lg hover:from-[#c50909] hover:to-[#ff4444] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            ← Exit
          </button>
          <div className="text-2xl font-bold text-center flex-1 mx-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Test all cards</div>
          <div className="text-gray-400 text-sm px-4 py-2 bg-[#1a1616] rounded-lg">
            {current + 1} / {total}
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Test progress</span>
            <span className="text-xs font-semibold text-cyan-400">{Object.keys(answers).length} / {total} answers</span>
          </div>
          <div className="w-full bg-[#1a1616] rounded-full h-2 overflow-hidden border border-[#3a3535]">
            <div 
              className="bg-gradient-to-r from-[#a50808] via-[#d60a0a] to-[#ff6b6b] h-full transition-all duration-500"
              style={{ width: `${total > 0 ? ((current + 1) / total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Progress dots */}
        <div className="mb-8 flex items-center gap-2">
          {[...Array(Math.min(total, 5))].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                i < current ? 'bg-green-500' : i === current ? 'bg-[#a50808]' : 'bg-[#3a3535]'
              }`}
            />
          ))}
          {total > 5 && <span className="text-gray-500 text-sm ml-2">+{total - 5}</span>}
        </div>

        {/* Card container */}
        <div className="relative group w-full max-w-[500px]">
          <div
            className={`bg-gradient-to-br from-[#2a2626] to-[#1e1b1b] rounded-3xl shadow-2xl p-12 min-h-[280px] md:min-h-[350px] flex items-center justify-center text-2xl md:text-3xl font-semibold border border-[#3a3535] hover:border-[#a50808] transition-all duration-300 cursor-pointer relative overflow-hidden`}
            onClick={handleFlip}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a50808]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative text-center max-h-full overflow-y-auto px-4">
              {side === 'front' ? card.term : card.definition}
            </div>
            <div className="absolute top-4 right-4 text-gray-500 text-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300">🔄</div>
          </div>
        </div>

        {/* Swap Button Slot */}
        <div className='h-[80px] mt-6 flex items-center justify-center'>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-[#413d3d] to-[#5a5555] rounded-lg text-white hover:from-[#5a5555] hover:to-[#6b6666] transition-all duration-200 font-semibold shadow-lg active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
          >
            🔄 Swap Side
          </button>
        </div>

        {/* Answer Buttons Slot */}
        <div className="h-[100px] flex items-center justify-center">
          {side === 'back' && !currentAnswered && (
            <div className="flex gap-4 flex-col md:flex-row animate-in fade-in duration-300">
              <button 
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center gap-2 min-w-[160px]"
                onClick={() => handleAnswer(true)}
              >
                ✅ I know this
              </button>
              <button 
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center gap-2 min-w-[160px]"
                onClick={() => handleAnswer(false)}
              >
                ❌ Still learning
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8 flex-wrap justify-center mt-4">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-[#413d3d] to-[#5a5555] rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#5a5555] hover:to-[#6b6666] transition-all duration-200 font-semibold shadow-lg"
            onClick={handlePrev} 
            disabled={current === 0}
          >
            ◀ Previous
          </button>
          
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Card</span>
            <span className="text-3xl font-bold text-[#a50808]">{current + 1}</span>
            <span className="text-gray-400 text-xs uppercase tracking-wider">of {total}</span>
          </div>

          <button 
            className="px-6 py-3 bg-gradient-to-r from-[#a50808] to-[#d60a0a] rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#c50909] hover:to-[#ff4444] transition-all duration-200 font-semibold shadow-lg"
            onClick={handleNext} 
            disabled={!currentAnswered || current === total - 1}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
});


export default TestPage;
