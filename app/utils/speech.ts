export const speakChinese = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.8; // Slightly slower for learning
  window.speechSynthesis.speak(utterance);
};
