import * as React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { SendIcon } from "./send-icon";
import { StopIcon } from "./stop-icon";
import { ClearIcon } from "./clear-icon";

export const MessageInput = ({ value, onChange, onSend, disabled, onStop, onClear, isGenerating }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value.trim()) onSend();
      }}
      style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <Input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={{ flex: 1, padding: 12, fontSize: 16, border: "none", background: "#f3f4f6" }}
        placeholder="Type your message..."
        disabled={disabled}
      />
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        style={{ padding: "8px 16px", fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <SendIcon size={16} />
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!isGenerating}
        onClick={onStop}
        style={{ padding: "8px 12px", fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <StopIcon size={16} />
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onClear}
        style={{ padding: "8px 12px", fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ClearIcon size={16} />
      </Button>
    </form>
  );
};
