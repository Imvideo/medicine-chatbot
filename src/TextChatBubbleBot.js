import React, { useEffect, useState } from 'react';
import './ChatBubble.css';

function TextChatBubbleBot ({ text }) {
  const [delayedText, setDelayedText] = useState('');

  useEffect(() => {
    // 1초 후에 text 값을 delayedText에 설정
    const timer = setTimeout(() => {
      setDelayedText(text);
    }, 1000);

    return () => clearTimeout(timer); // 컴포넌트가 unmount되기 전에 타이머를 정리
  }, [text]);

  return (
    <div className="chat-bubble">
      <div className="text">{delayedText}</div>
      <div className="bubble-tail"></div>
    </div>
  );
};

export default TextChatBubbleBot;
