import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function ChatBot({onClose}) {

  // const {messages, input, welcome, isLoading} = session;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [welcome, setWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const chatsRef = useRef(null);
  const endRef = useRef(null);

  // const suggestions = [
  //   "Guide me how to make",
  //   "Convert units",
  //   "Explain why?"
  // ];


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
  // useEffect(() => {
  //   const scrollToBottom = () => {
  //     if (chatsRef.current) {
  //       chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
  //     }
  //   };
  //   requestAnimationFrame(scrollToBottom);
  // }, [messages, isLoading]);
// Auto-scroll to bottom on new messages or loading state changes
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);



  return (
    <div className="bot-container">
      <div className="chat-header">
        <span>AI Cooking Expert</span>
        <button className="close-chat-btn" onClick={onClose}>×</button>
      </div>

      <div className="chat-container">
        <div className="chats" ref={chatsRef}>
          {welcome && !messages.length && (
            <h2 className="bot-name">Hello, AJ</h2>
          )}

          {messages.map((msg, idx) =>
            msg.from === 'user' ? (
              <div key={idx} className="user-chat">
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
              </div>
            ) : (
              <div key={idx} className="bot-chat">
                <ReactMarkdown
                  children={msg.text}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p style={{ whiteSpace: "pre-wrap", margin: "0 0 0.5rem" }} {...props} />
                    )
                  }}
                />
              </div>
            )
          )}

          
          {isLoading && (
            <div className="bot-loading">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
      <div className="bot-input">
        <input
          type="text"
          placeholder="Cook everything"
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



// import React, { useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm    from "remark-gfm";
// import remarkBreaks from "remark-breaks";

// export default function ChatBot({ onClose, session, setSession }) {
//   // 1) Destructure all chat state from parent session
//   const { messages, input, welcome, isLoading } = session;

//   const chatsRef = useRef(null);
//   const endRef   = useRef(null);

//   // 2) On first mount only, fetch up to 15 messages
//   useEffect(() => {
//     if (messages.length) return; // already loaded
//     (async () => {
//       try {
//         const token = localStorage.getItem("token") || "";
//         const res   = await fetch(
//           `${import.meta.env.VITE_API_URL}/chat/history`,
//           { headers: { "x-auth-token": token } }
//         );
//         const data = await res.json();
//         const hist = Array.isArray(data)
//           ? data.map(m => ({ from: m.from, text: m.text }))
//           : [];
//         setSession(prev => ({
//           ...prev,
//           messages: hist,              // up to 15 from server
//           welcome:  hist.length === 0, // show greeting only if no history
//           isLoading:false
//         }));
//       } catch (err) {
//         console.error("Error fetching chat history:", err);
//       }
//     })();
//   }, [messages.length, setSession]);

//   // 3) Send a new message
//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text) return;

//     // a) Optimistically append user message & clear input
//     setSession(prev => ({
//       ...prev,
//       messages: [...prev.messages, { from: "user", text }],
//       input:    "",
//       welcome:  false,
//       isLoading:true
//     }));

//     try {
//       const token = localStorage.getItem("token") || "";
//       const res   = await fetch(
//         `${import.meta.env.VITE_API_URL}/chat/ask`,
//         {
//           method:  "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "x-auth-token": token
//           },
//           body: JSON.stringify({ question: text })
//         }
//       );
//       const { answer } = await res.json();
//       const botText = answer || "Sorry, I couldn't fetch a response.";

//       // b) Append bot reply
//       setSession(prev => ({
//         ...prev,
//         messages: [...prev.messages, { from: "bot", text: botText }],
//         isLoading:false
//       }));
//     } catch (err) {
//       console.error("Chat API error:", err);
//       setSession(prev => ({
//         ...prev,
//         messages: [...prev.messages, { from: "bot", text: "Oops! Something went wrong." }],
//         isLoading:false
//       }));
//     }
//   };

//   // 4) Auto-scroll to bottom on each new message or loading change
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages.length, isLoading]);

//   return (
//     <div className="bot-container">
//       <div className="chat-header">
//         <span>AI Cooking Expert</span>
//         <button className="close-chat-btn" onClick={onClose}>×</button>
//       </div>

//       <div className="chat-container">
//         <div className="chats" ref={chatsRef}>
//           {welcome && messages.length === 0 && (
//             <h2 className="bot-name">Hello, AJ</h2>
//           )}

//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={msg.from === "user" ? "user-chat" : "bot-chat"}
//             >
//               {msg.from === "user" ? (
//                 <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
//               ) : (
//                 <ReactMarkdown
//                   children={msg.text}
//                   remarkPlugins={[remarkGfm, remarkBreaks]}
//                   components={{
//                     p: ({ node, ...props }) => (
//                       <p
//                         style={{ whiteSpace: "pre-wrap", margin: "0 0 0.5rem" }}
//                         {...props}
//                       />
//                     )
//                   }}
//                 />
//               )}
//             </div>
//           ))}

//           {isLoading && (
//             <div className="bot-loading">
//               <p>Thinking...</p>
//             </div>
//           )}

//           <div ref={endRef} />
//         </div>
//       </div>

//       <div className="bot-input">
//         <input
//           type="text"
//           placeholder="Ask me anything..."
//           value={input}
//           onChange={e =>
//             setSession(prev => ({ ...prev, input: e.target.value }))
//           }
//           onKeyDown={e => e.key === "Enter" && !isLoading && sendMessage()}
//           disabled={isLoading}
//         />
//         <button
//           className="bot-arrow"
//           onClick={sendMessage}
//           disabled={isLoading}
//         >
//           <i className="fa-solid fa-arrow-up" />
//         </button>
//       </div>
//     </div>
//   );
// }
