import { useState, useRef, useEffect } from "react";
import api from "./api";

function App() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [activeChatId, setActiveChatId] = useState(
    crypto.randomUUID()
  );

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const askQuestion = async () => {

    if (!question.trim() || loading) return;

    const currentQuestion = question;

    const userMessage = {
      role: "user",
      text: currentQuestion
    };

    const assistantMessage = {
      role: "assistant",
      text: "",
      sources: []
    };

    // ✅ Add BOTH user message AND empty assistant bubble BEFORE streaming
    setMessages(prev => [...prev, userMessage, assistantMessage]);

    setQuestion("");
    setLoading(true);

    try {
      const eventSource = new EventSource(
        `http://localhost:8080/api/ai/rag-stream?chatId=${activeChatId}&question=${encodeURIComponent(currentQuestion)}`
      );

      eventSourceRef.current = eventSource;

      let firstChunk = true;

      eventSource.onmessage = (event) => {

        if (firstChunk) {
          setLoading(false);
          firstChunk = false;
        }

        // ✅ Now last message is always the assistant bubble — safe to append
        setMessages(prev =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, text: msg.text + event.data + " " }
              : msg
          )
        );
      };

      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
      };

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const uploadFile = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = file.name.endsWith(".pdf")
        ? "/api/upload/pdf"
        : "/api/upload/txt";

      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const uploadMessage = {
        role: "assistant",
        text: response.data
      };

      setMessages(prev => [...prev, uploadMessage]);

    } catch (error) {
      console.error(error);
    }
  };

  const newChat = () => {
    setMessages([]);
    setActiveChatId(crypto.randomUUID());
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      background: "#0f0f10",
      color: "#fff",
      fontFamily: "Arial"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: 260,
        borderRight: "1px solid rgba(255,255,255,0.08)",
        padding: 16,
        background: "#171717"
      }}>
        <button
          onClick={newChat}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "#c96442",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          + New Chat
        </button>

        <div style={{ marginTop: 24, fontSize: 12, color: "#999" }}>
          Conversational RAG Assistant
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <div style={{
          height: 60,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between"
        }}>
          <div style={{ fontWeight: "bold", fontSize: 16 }}>
            Enterprise RAG Assistant
          </div>
          <div style={{ fontSize: 12, color: "#aaa" }}>
            Gemini · Qdrant · Redis
          </div>
        </div>

        {/* CHAT */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>

          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 18
              }}
            >
              <div style={{
                maxWidth: "70%",
                background: message.role === "user" ? "#c96442" : "#1f1f1f",
                padding: "14px 18px",
                borderRadius: 16,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>

                {/* ✅ Show a blinking cursor on the last assistant message while loading */}
                {message.text || (message.role === "assistant" && loading && index === messages.length - 1)
                  ? message.text
                  : null}

                {message.role === "assistant" && loading && index === messages.length - 1 && (
                  <span style={{
                    display: "inline-block",
                    width: 8,
                    height: 14,
                    background: "#c96442",
                    marginLeft: 2,
                    verticalAlign: "middle",
                    animation: "blink 1s step-end infinite"
                  }} />
                )}

                {message.sources && message.sources.length > 0 && (
                  <div style={{
                    marginTop: 12,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: 10
                  }}>
                    <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>
                      Sources
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {message.sources.map((source, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 8,
                            background: "#2b2b2b",
                            fontSize: 11
                          }}
                        >
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ✅ "Thinking..." only shows before the first chunk arrives */}
          {loading && messages[messages.length - 1]?.text === "" && (
            <div style={{ color: "#999", fontSize: 14, marginBottom: 12 }}>
              Thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: 16
        }}>
          {selectedFile && (
            <div style={{
              marginBottom: 12,
              background: "#1f1f1f",
              padding: 10,
              borderRadius: 10,
              fontSize: 13
            }}>
              Uploaded: {selectedFile.name}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askQuestion();
                }
              }}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 14,
                color: "#fff",
                outline: "none"
              }}
            />

            <label style={{
              background: "#1f1f1f",
              padding: "0 16px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}>
              📎
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={uploadFile}
              />
            </label>

            <button
              onClick={askQuestion}
              disabled={loading}
              style={{
                background: "#c96442",
                border: "none",
                borderRadius: 12,
                padding: "0 20px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                opacity: loading ? 0.6 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Blinking cursor keyframe */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

    </div>
  );
}

export default App;