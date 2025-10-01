import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { Card } from "./components/ui/card";
import { ChatBubble } from "./components/ui/chat-bubble";
import { TrashIcon } from "./components/ui/trash-icon";
import { CopyIcon } from "./components/ui/copy-icon";
import { MessageInput } from "./components/ui/message-input";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Prevent page scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('chat_session_id') || Math.random().toString(36).substring(2, 12);
      localStorage.setItem('chat_session_id', sid);
      setSessionId(sid);
      console.log('Chat session id:', sid);
      // Fetch history on load
      axios.get(`${API_BASE_URL}/history/${sid}`)
        .then(res => {
          setMessages(res.data.conversation || []);
        })
        .catch(() => setMessages([]));
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const timestamp = new Date().toISOString();
    const newMessages = [...messages, { user: 'me', text: input, timestamp }];
    setMessages(newMessages);
    setLoading(true);
    setIsGenerating(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        session_id: sessionId,
        messages: [{ user: 'me', text: input }],
      });
      const botTimestamp = new Date().toISOString();
      setMessages([...newMessages, { user: 'bot', text: res.data.response, timestamp: botTimestamp }]);
    } catch (err) {
      const botTimestamp = new Date().toISOString();
      setMessages([...newMessages, { user: 'bot', text: 'Error: Could not get response.', timestamp: botTimestamp }]);
    }
    setInput('');
    setLoading(false);
    setIsGenerating(false);
  };

  const handleStop = () => {
    setLoading(false);
    setIsGenerating(false);
    // Optionally cancel any ongoing request here
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
  };

  const handleDelete = idx => {
    // If user message, delete it and the next bot message (if exists)
    if (messages[idx].user === 'me') {
      const newMessages = messages.filter((_, i) => i !== idx && i !== idx + 1);
      setMessages(newMessages);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>My Chatbot</h2>
      <Card style={{ marginTop: 16 }}>
        <ScrollArea style={{ border: 'none', background: '#fafafa', height: 800 }}>
          {messages.map((msg, idx) => {
            // Format timestamp to HH:MM
            const timestamp = msg.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.user === 'me' ? 'flex-end' : 'flex-start' }}>
                <ChatBubble text={msg.text} isUser={msg.user === 'me'}>
                  {(msg.user === 'me' || msg.user === 'bot') && (
                    <div style={{ position: 'absolute', bottom: 7, right: 8, display: 'flex', gap: 4 }}>
                      {msg.user === 'me' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(idx)}
                          style={{ padding: 2, minWidth: 0, height: 15, width: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          disabled={loading}
                          aria-label="Delete"
                        >
                          <TrashIcon size={16} />
                        </Button>
                      )}
                      {msg.user === 'bot' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(msg.text);
                              alert('Copied to clipboard!');
                            } catch (e) {
                              alert('Failed to copy.');
                            }
                          }}
                          style={{ padding: 2, minWidth: 0, height: 15, width: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label="Copy"
                        >
                          <CopyIcon size={16} />
                        </Button>
                      )}
                    </div>
                  )}
                </ChatBubble>
                <span style={{ fontSize: '12px', color: '#888', marginTop: 2 }}>
                  {timestamp}
                </span>
              </div>
            );
          })}
          {loading && <div>Bot is typing...</div>}
        </ScrollArea>
        <MessageInput
          value={input}
          onChange={e => setInput(e.target.value)}
          onSend={sendMessage}
          disabled={loading}
          onStop={handleStop}
          onClear={handleClear}
          isGenerating={isGenerating}
        />
      </Card>
    </div>
  );
}

export default App;
