import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { hskWords } from "~/data/hskWords";

export default function Flashcards() {
  const [words, setWords] = useState([...hskWords]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Shuffle words
  const shuffleWords = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCorrectCount(0);
  };

  // Handle text-to-speech
  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(words[currentIndex].pinyin);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = (wasCorrect?: boolean) => {
    if (wasCorrect !== undefined) {
      setCorrectCount(prev => wasCorrect ? prev + 1 : prev);
    }
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    setShowAnswer(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setShowAnswer(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'r') {
        speakWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.addEventListener('keydown', handleKeyPress);
      window.speechSynthesis.cancel();
    };
  }, [currentIndex]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={shuffleWords}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-400"
          aria-label="Shuffle cards"
        >
          Shuffle
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div 
          className="w-96 min-h-64 border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6 relative"
          onClick={() => setShowAnswer(!showAnswer)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowAnswer(!showAnswer);
            }
          }}
          aria-label={`Flashcard: ${showAnswer ? 'showing answer' : 'showing question'}`}
        >
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakWord();
              }}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Speak word"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {!showAnswer ? (
            <div className="text-4xl mb-2">{words[currentIndex].word}</div>
          ) : (
            <>
              <div className="text-2xl mb-4">{words[currentIndex].pinyin}</div>
              <div className="text-xl text-center">{words[currentIndex].meaning}</div>
            </>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handlePrevious()}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-400"
            aria-label="Previous card"
          >
            Previous
          </button>
          <button
            onClick={() => handleNext()}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-400"
            aria-label="Next card"
          >
            Next
          </button>
        </div>
        
        <div className="mt-4 text-gray-600">
          Card {currentIndex + 1} of {words.length}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Keyboard shortcuts: Space (flip card), ← → (navigate), R (speak)
        </div>
      </div>
    </div>
  );
}