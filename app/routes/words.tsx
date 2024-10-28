import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { hskWords } from "~/data/hskWords";

export default function Words() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const filteredWords = hskWords.filter((word) => {
    const matchesSearch =
      searchTerm.toLowerCase() === "" ||
      word.word.includes(searchTerm) ||
      word.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleWordInteraction = (word: (typeof hskWords)[0]) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(word.pinyin);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">HSK Word List</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>

      <div
        className="bg-blue-100 my-4 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Notice: </strong>
        <span className="block sm:inline">
          For best experience, use Chrome browsers.
        </span>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search words..."
          className="px-4 py-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => (
          <button
            key={word.word}
            className="border rounded-lg p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-500 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={() => handleWordInteraction(word)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleWordInteraction(word);
              }
            }}
            aria-label={`${word.word}, ${word.pinyin}, meaning: ${word.meaning}. Click or press Enter to hear pronunciation.`}
            tabIndex={0}
          >
            <div className="text-4xl mb-2">{word.word}</div>
            <div className="text-gray-400">{word.pinyin}</div>
            <div className="text-sm text-gray-400 mt-2">{word.meaning}</div>
            <div className="text-gray-400 mt-2">{word.example_sentence}</div>

            {/* Sound icon indicator */}
            <div className="absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
