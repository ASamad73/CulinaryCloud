import { useState, useRef, useEffect } from "react";

// Predefined bot messages to cycle through
const BOT_MESSAGES = [
  "Hi there!",
  "I'm a bot, how can I help?",
  "That's interesting!",
  "Tell me more.",
  "Thanks for sharing!"
];

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botIndex, setBotIndex] = useState(0);
  const [welcome, setWelcome] = useState(true);
  const chatsRef = useRef(null);

  // Append user message and next bot reply
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    if (welcome) setWelcome(false);

    // User message
    const userMsg = { from: 'user', text };
    // Bot reply
    const botMsg = {
      from: 'bot',
      text: BOT_MESSAGES[botIndex % BOT_MESSAGES.length]
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setBotIndex(prev => prev + 1);
    setInput("");
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bot-container">
      <div className="chat-container">
        <div className="chats" ref={chatsRef}>
          {welcome && (
            <h2 className="bot-name">Hello, Abdul</h2>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.from === 'user' ? 'user-chat' : 'bot-chat'}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bot-input">
        <input
          type="text"
          placeholder="Ask anything"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="bot-arrow" onClick={sendMessage}>
          <i className="fa-solid fa-arrow-up" />
        </button>
      </div>
    </div>
  );
}