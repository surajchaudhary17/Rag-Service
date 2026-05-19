import { useState, useRef, useEffect } from "react";
import api from "./api";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor"/>
  </svg>
);

const ClipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 7.5l-5.5 5.5a4 4 0 01-5.657-5.657l6-6a2.5 2.5 0 013.536 3.536l-6.001 6a1 1 0 01-1.414-1.414l5.5-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1.75 3.5h10.5M5.25 3.5V2.333a.583.583 0 01.583-.583h2.334a.583.583 0 01.583.583V3.5M11.083 3.5l-.583 7.583a.583.583 0 01-.583.584H4.083a.583.583 0 01-.583-.584L2.917 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12.25 7a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zM7 9.333V7M7 4.667h.006" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="3" r="1" fill="currentColor"/>
    <circle cx="7" cy="7" r="1" fill="currentColor"/>
    <circle cx="7" cy="11" r="1" fill="currentColor"/>
  </svg>
);

function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#9ca3af",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`
        }}/>
      ))}
    </div>
  );
}

function FileCard({ file }) {
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column",
      background: "#fff", borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.1)",
      padding: "10px 12px", minWidth: 140, maxWidth: 200,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      marginBottom: 8
    }}>
      <span style={{
        fontSize: 12, fontWeight: 600, color: "#111827",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        marginBottom: 2
      }}>{file.name}</span>
      {file.lineCount !== null && (
        <span style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>
          {file.lineCount} lines
        </span>
      )}
      <div style={{ marginTop: "auto" }}>
        <span style={{
          display: "inline-block",
          fontSize: 10, fontWeight: 700, color: "#374151",
          border: "1px solid #d1d5db",
          borderRadius: 5, padding: "2px 6px",
          letterSpacing: "0.05em"
        }}>
          {file.name.split(".").pop().toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: "8px",
      animation: "fadeSlideIn 0.25s ease-out"
    }}>
      {/* File card above the bubble for user messages */}
      {isUser && message.file && <FileCard file={message.file} />}

      <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", width: "100%" }}>
        {!isUser && (
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #c96442 0%, #d4845a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
            flexShrink: 0, marginRight: 10, marginTop: 2,
            boxShadow: "0 2px 8px rgba(201,100,66,0.3)"
          }}>C</div>
        )}
        <div style={{
          maxWidth: isUser ? "60%" : "72%",
          background: isUser
            ? "linear-gradient(135deg, #c96442 0%, #b8593a 100%)"
            : "rgba(255,255,255,0.04)",
          border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "12px 16px",
          fontSize: 14,
          lineHeight: 1.65,
          color: isUser ? "#fff" : "#e5e7eb",
          letterSpacing: "0.01em",
          boxShadow: isUser
            ? "0 4px 16px rgba(201,100,66,0.25)"
            : "0 1px 4px rgba(0,0,0,0.3)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}>
          {message.text}
        </div>
      </div>
    </div>
  );
}

let chatIdCounter = 1;

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [chats, setChats] = useState([
    { id: 1, title: "Current Chat", messages: [], active: true }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [question]);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;
    const userMessage = {
      role: "user",
      text: question,
      file: selectedFile ? { name: selectedFile.file.name, lineCount: selectedFile.lineCount } : null
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Update chat title from first message
    setChats(prev => prev.map(c =>
      c.id === activeChatId
        ? { ...c, title: question.slice(0, 40) + (question.length > 40 ? "…" : ""), messages: updatedMessages }
        : c
    ));

    setLoading(true);
    setQuestion("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const response = await api.get("/api/ai/rag", { params: { question } });
      const aiMessage = { role: "assistant", text: response.data };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      setChats(prev => prev.map(c =>
        c.id === activeChatId ? { ...c, messages: finalMessages } : c
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Count lines for text files
    let lineCount = null;
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      lineCount = text.split("\n").length;
    }
    setSelectedFile({ file, lineCount });

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/api/upload/txt", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const newChat = () => {
    chatIdCounter++;
    const newId = chatIdCounter;
    const newChatObj = { id: newId, title: "New Chat", messages: [], active: true };
    setChats(prev => [...prev, newChatObj]);
    setActiveChatId(newId);
    setMessages([]);
  };

  const switchChat = (id) => {
    const chat = chats.find(c => c.id === id);
    if (chat) {
      setActiveChatId(id);
      setMessages(chat.messages);
    }
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    const remaining = chats.filter(c => c.id !== id);
    if (remaining.length === 0) {
      chatIdCounter++;
      const blank = { id: chatIdCounter, title: "New Chat", messages: [] };
      setChats([blank]);
      setActiveChatId(blank.id);
      setMessages([]);
    } else {
      setChats(remaining);
      if (activeChatId === id) {
        setActiveChatId(remaining[remaining.length - 1].id);
        setMessages(remaining[remaining.length - 1].messages);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #0f0f10; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .drawer-enter { animation: drawerIn 0.22s cubic-bezier(0.4,0,0.2,1); }
        @keyframes drawerIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .chat-item { transition: background 0.15s ease; }
        .chat-item:hover { background: rgba(255,255,255,0.06) !important; }
        .send-btn { transition: all 0.15s ease; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); }
        .send-btn:active:not(:disabled) { transform: scale(0.96); }
        .icon-btn { transition: background 0.15s ease, color 0.15s ease; }
        .icon-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .new-chat-btn { transition: background 0.15s ease; }
        .new-chat-btn:hover { background: rgba(255,255,255,0.08) !important; }
        textarea { font-family: 'Sora', sans-serif; }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        .loading-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div style={{
        height: "100vh", display: "flex",
        background: "#0f0f10", color: "#f3f4f6",
        fontFamily: "'Sora', sans-serif", overflow: "hidden"
      }}>

        {/* Sidebar */}
        {drawerOpen && (
          <div className="drawer-enter" style={{
            width: 260, flexShrink: 0,
            background: "#161618",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexDirection: "column",
            height: "100vh"
          }}>
            {/* Sidebar Header */}
            <div style={{
              padding: "16px 12px 12px",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #c96442, #b8593a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fff",
                  boxShadow: "0 2px 8px rgba(201,100,66,0.4)"
                }}>S</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", letterSpacing: "0.01em" }}>
Sharepoint intelligence</span>
              </div>
              <button
                className="icon-btn"
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: "transparent", border: "none", color: "rgba(255,255,255,0.4)",
                  cursor: "pointer", padding: "6px", borderRadius: 8, display: "flex"
                }}
              >
                <MenuIcon/>
              </button>
            </div>

            {/* New Chat Button */}
            <div style={{ padding: "0 10px 12px" }}>
              <button
                className="new-chat-btn"
                onClick={newChat}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "9px 12px",
                  color: "rgba(255,255,255,0.7)", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, fontFamily: "'Sora', sans-serif"
                }}
              >
                <PlusIcon/> New chat
              </button>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "4px 6px 8px"
              }}>Recent</div>

              {[...chats].reverse().map(chat => (
                <div
                  key={chat.id}
                  className="chat-item"
                  onClick={() => switchChat(chat.id)}
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px", borderRadius: 9, cursor: "pointer", marginBottom: 2,
                    background: activeChatId === chat.id
                      ? "rgba(201,100,66,0.12)"
                      : "transparent",
                    border: activeChatId === chat.id
                      ? "1px solid rgba(201,100,66,0.2)"
                      : "1px solid transparent"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div style={{ color: activeChatId === chat.id ? "#c96442" : "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                      <ChatIcon/>
                    </div>
                    <span style={{
                      fontSize: 12.5, color: activeChatId === chat.id ? "#f3f4f6" : "rgba(255,255,255,0.6)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      fontWeight: activeChatId === chat.id ? 500 : 400
                    }}>{chat.title}</span>
                  </div>
                  {hoveredChat === chat.id && (
                    <button
                      onClick={(e) => deleteChat(e, chat.id)}
                      style={{
                        background: "none", border: "none",
                        color: "rgba(255,255,255,0.35)", cursor: "pointer",
                        display: "flex", padding: 4, borderRadius: 6,
                        flexShrink: 0, transition: "color 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                    >
                      <TrashIcon/>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div style={{
              padding: "12px 12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "8px 10px", borderRadius: 9,
                background: "rgba(255,255,255,0.03)"
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: "#fff", flexShrink: 0
                }}>U</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#e5e7eb" }}>User</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>RAG Assistant</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>

          {/* Top Bar */}
          <div style={{
            height: 52, display: "flex", alignItems: "center",
            padding: "0 16px", gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(15,15,16,0.8)",
            backdropFilter: "blur(8px)", flexShrink: 0
          }}>
            {!drawerOpen && (
              <button
                className="icon-btn"
                onClick={() => setDrawerOpen(true)}
                style={{
                  background: "transparent", border: "none",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer",
                  padding: "7px", borderRadius: 8, display: "flex"
                }}
              >
                <MenuIcon/>
              </button>
            )}
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                {chats.find(c => c.id === activeChatId)?.title || "New Chat"}
              </span>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 6, padding: "3px 8px", letterSpacing: "0.04em"
            }}>
              Gemini · Qdrant · Spring Boot
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: isEmpty ? "0" : "24px 0 16px",
            display: "flex", flexDirection: "column"
          }}>
            {isEmpty ? (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "40px 24px", animation: "fadeSlideIn 0.4s ease-out"
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #c96442 0%, #b8593a 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 20,
                  boxShadow: "0 8px 32px rgba(201,100,66,0.35)"
                }}>S</div>
                <h2 style={{
                  fontSize: 22, fontWeight: 600, color: "#f3f4f6",
                  marginBottom: 8, textAlign: "center"
                }}>How can I help you today?</h2>
                <p style={{
                  fontSize: 13, color: "rgba(255,255,255,0.35)",
                  textAlign: "center", maxWidth: 340, lineHeight: 1.6
                }}>
                  Ask anything — your documents are indexed and ready for retrieval.
                </p>
                <div style={{
                  display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap", justifyContent: "center"
                }}>
                  {["Summarize my documents", "What's in the database?", "Extract key points"].map(s => (
                    <button
                      key={s}
                      onClick={() => setQuestion(s)}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 20, padding: "7px 14px",
                        fontSize: 12, color: "rgba(255,255,255,0.55)",
                        cursor: "pointer", fontFamily: "'Sora', sans-serif",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = "rgba(201,100,66,0.12)";
                        e.target.style.borderColor = "rgba(201,100,66,0.3)";
                        e.target.style.color = "#c96442";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = "rgba(255,255,255,0.04)";
                        e.target.style.borderColor = "rgba(255,255,255,0.09)";
                        e.target.style.color = "rgba(255,255,255,0.55)";
                      }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 740, width: "100%", margin: "0 auto", padding: "0 20px" }}>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg}/>
                ))}
                {loading && (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "linear-gradient(135deg, #c96442, #b8593a)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#fff",
                      flexShrink: 0, marginRight: 10, marginTop: 2
                    }}>C</div>
                    <div className="loading-shimmer" style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "18px 18px 18px 4px",
                      padding: "12px 16px"
                    }}>
                      <ThinkingDots/>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: "12px 20px 20px",
            background: "linear-gradient(to top, #0f0f10 80%, transparent)"
          }}>
            <div style={{
              maxWidth: 740, margin: "0 auto",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              transition: "border-color 0.2s ease"
            }}
            onFocus={() => {}}
            >
              {/* File preview card */}
              {selectedFile && (
                <div style={{ padding: "12px 14px 0" }}>
                  <div style={{
                    display: "inline-flex", flexDirection: "column",
                    background: "#fff", borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.1)",
                    padding: "10px 12px", minWidth: 140, maxWidth: 200,
                    position: "relative", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                  }}>
                    {/* Close button */}
                    <button
                      onClick={clearFile}
                      style={{
                        position: "absolute", top: -7, right: -7,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#6b7280", border: "2px solid #0f0f10",
                        color: "#fff", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, lineHeight: 1, padding: 0, fontWeight: 600
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.background = "#6b7280"}
                      title="Remove file"
                    >×</button>
                    {/* Filename */}
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: "#111827",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      marginBottom: 2
                    }}>{selectedFile.file.name}</span>
                    {/* Line count */}
                    {selectedFile.lineCount !== null && (
                      <span style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>
                        {selectedFile.lineCount} lines
                      </span>
                    )}
                    {/* Extension badge */}
                    <div style={{ marginTop: "auto" }}>
                      <span style={{
                        display: "inline-block",
                        fontSize: 10, fontWeight: 700, color: "#374151",
                        background: "transparent",
                        border: "1px solid #d1d5db",
                        borderRadius: 5, padding: "2px 6px",
                        letterSpacing: "0.05em"
                      }}>
                        {selectedFile.file.name.split(".").pop().toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                rows={1}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  color: "#f3f4f6", fontSize: 14, lineHeight: 1.6,
                  padding: "14px 16px 0", outline: "none", resize: "none",
                  fontFamily: "'Sora', sans-serif", minHeight: 48,
                  maxHeight: 160, overflowY: "auto"
                }}
              />
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px 10px"
              }}>
                <label style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
                  color: "rgba(255,255,255,0.45)",
                  transition: "background 0.15s ease, color 0.15s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }}
                title="Attach file"
                >
                  <PlusIcon/>
                  <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={uploadFile}/>
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                    {question.length > 0 ? `${question.length} chars` : "⏎ Send"}
                  </span>
                  <button
                    className="send-btn"
                    onClick={askQuestion}
                    disabled={!question.trim() || loading}
                    style={{
                      width: 34, height: 34, borderRadius: 10, border: "none",
                      background: question.trim() && !loading
                        ? "linear-gradient(135deg, #c96442, #b8593a)"
                        : "rgba(255,255,255,0.07)",
                      color: question.trim() && !loading ? "#fff" : "rgba(255,255,255,0.25)",
                      cursor: question.trim() && !loading ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: question.trim() && !loading ? "0 2px 12px rgba(201,100,66,0.4)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <SendIcon/>
                  </button>
                </div>
              </div>
            </div>
            <div style={{
              textAlign: "center", marginTop: 10,
              fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.02em"
            }}>
              Agent can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}