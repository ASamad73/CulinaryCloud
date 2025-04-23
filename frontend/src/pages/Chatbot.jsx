import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [welcome, setWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatsRef = useRef(null);

  // Fetch conversation history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/history`, {
          headers: {
            'x-auth-token': token || ''
          }
        });
        console.log('History fetch status:', res.status, res.statusText);
        const data = await res.json();
        console.log('History fetch data:', data);
        if (Array.isArray(data)) {
          setMessages(data.map(msg => ({ from: msg.from, text: msg.text })));
          if (data.length > 0) {
            setWelcome(false);
          }
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchHistory();
  }, []);

  // Send user message to backend and append bot response
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    if (welcome) setWelcome(false);

    const userMsg = { from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      const botReply = data.answer || "Sorry, I couldn't fetch a response.";
      const botMsg = { from: 'bot', text: botReply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat API error:', err);
      const errorMsg = { from: 'bot', text: "Oops! Something went wrong." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom on new messages or loading state changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatsRef.current) {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }
    };
    requestAnimationFrame(scrollToBottom);
  }, [messages, isLoading]);

  return (
    <div className="bot-container">
      <div className="chat-container">
        <div className="chats" ref={chatsRef}>
          {welcome && !messages.length && (
            <h2 className="bot-name">Hello, Abdul</h2>
          )}
          {messages.map((msg, idx) => (
            msg.from === 'user' ? (
              <div key={idx} className="user-chat">
                <p>{msg.text}</p>
              </div>
            ) : (
              <div key={idx} className="bot-chat">
                <p>{msg.text}</p>
              </div>
            )
          ))}
          {isLoading && (
            <div className="bot-loading">
              <p>Thinking...</p>
            </div>
          )}
        </div>
      </div>
      <div className="bot-input">
        <input
          type="text"
          placeholder="Ask anything"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isLoading && sendMessage()}
          disabled={isLoading}
        />
        <button className="bot-arrow" onClick={sendMessage} disabled={isLoading}>
          <i className="fa-solid fa-arrow-up" />
        </button>
      </div>
    </div>
  );
}