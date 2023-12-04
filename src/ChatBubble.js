import React, { useState } from 'react';
import './ChatBubble.css';


function ChatBubble ({ text, buttons,onClick })    {
    
    return (
        
      <div className="chat-bubble">
        <div className="text">{text}</div>
        <div className="button-container">
        {buttons.map((buttonText, index) => (
          <button key={index} className="bubble-button" onClick={() => onClick(buttonText)}>
            {buttonText}
          </button>
        ))}
      </div>
        <div className="bubble-tail"></div>
      </div>
    );
  };

  export default ChatBubble;