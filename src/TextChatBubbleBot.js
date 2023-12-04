import React from 'react';
import './ChatBubble.css';

function TextChatBubbleBot ({ text })   {
    return (
      <div className="chat-bubble">
        <div className="text">{text}</div>
        <div className="bubble-tail-user"></div>
      </div>
    );
  };

  export default TextChatBubbleBot;