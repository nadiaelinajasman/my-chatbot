import * as React from "react";
import ReactMarkdown from "react-markdown";

export const ChatBubble = ({ text, isUser, children }) => (
  <div
    style={{
      position: "relative",
      maxWidth: '80%',
      marginLeft: isUser ? 'auto' : 0,
      marginRight: isUser ? 0 : 'auto',
      marginBottom: 8,
      background: isUser ? '#e0f2fe' : '#f3f4f6',
      color: '#222',
      boxShadow: isUser ? '0 2px 8px rgba(56,189,248,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
      border: isUser ? '1px solid #38bdf8' : '1px solid #e5e7eb',
      textAlign: isUser ? 'right' : 'left',
      borderRadius: '12px',
      padding: '16px 24px',
      whiteSpace: isUser ? 'normal' : 'pre-wrap',
      fontFamily: isUser ? undefined : 'inherit',
    }}
  >
    {isUser ? text : <ReactMarkdown>{text}</ReactMarkdown>}
    {children}
  </div>
);
