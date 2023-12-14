import React from 'react';
import './ChatBubble.css';

function ChatBubbleChat ({ text })   {
    return (
      <div className="chat-bubble align-right">
        <div className="text">{text}</div>
        <div className="bubble-tail-user"></div>
      </div>
    );
    
  };

  export default ChatBubbleChat;