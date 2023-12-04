import React, { useState,useEffect } from 'react';
import './App.css';
import './SquareButton.css';
import ChatBubble from './ChatBubble';
import ChatBubbleUser from './ChatBubbleUser';
import TextChatBubbleBot from './TextChatBubbleBot';

function App() {
  const [chatBubbleUser, setBubbleUser] = useState([]);
  const [chatBubbleBot, setBubbleBot] = useState([]);
  const buttons = ['두통', '메스꺼움', '복통','기침','어지러움','치통','생리통'];
  const buttons1 = ['버튼 1',];

  useEffect(() => {
    // 데이터를 가져오는 함수 호출 (이 예제에서는 getBackendData라 가정)
    getBackendData();
  }, []);

  const getBackendData = () => {
    // 백엔드 API에서 데이터를 가져오는 비동기 함수 (fetch, axios 등 사용)
    fetch('https://127.0.0.1:8080/askLex?question=약')
      .then(response => response.json())
      .then(data => {
        // 받아온 데이터를 speechBubbles에 설정
        setBubbleBot(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleButtonClick = (text) => {
      addNewBubbleUser(text); // 사용자 턴일 때 사용자 말풍선 추가
      addNewBubbleBot(text); // 봇 턴일 때 봇 말풍선 추가
    };
  const addNewBubbleUser = (text) => {
    const newBubbleUser = {
      text: text
    };
    setBubbleUser([...chatBubbleUser, newBubbleUser]);
  };
  const addNewBubbleBot = (text) => {
    const newBubbleBot = {
      text: text
    };
    setBubbleBot([...chatBubbleBot, newBubbleBot]);
  }
  const handleReset = () => {
    window.location.reload(); // 페이지 새로고침
  };

  const handleInputEnter = (e) => {
    if (e.key === 'Enter') {
      addNewBubbleUser(e.target.value);
      e.target.value = ''; // 입력란 비우기
    }
  };


  return (
    <div className="center-container">
      <div className="subcenter-container">
      <div className="title">Medicine Chatbot</div>
      <div className="reset-button"onClick={handleReset}>초기화</div>
    <input type='text' placeholder="증상을 입력해 주세요." onKeyPress={handleInputEnter}/>
    <div className="square-container">
      <ChatBubble text="어디가 아프신가요?" buttons={buttons}
      onClick={handleButtonClick}/>
      {/* <ChatBubbleUser text="안녕하세요!sdfsdlfjlksdjfl" /> */}
    {chatBubbleUser.map((bubble, index) => (
      <React.Fragment key={index}>
      <ChatBubbleUser
        key={'user-' + index}
        text={bubble.text + "이 있어. 약을 추천해줄래?"} 
        addNewBubble={addNewBubbleUser}
      />
      <TextChatBubbleBot
        key={'bot-' + index}
        text={"여기 "+bubble.text + "에 효과가 있는 약들을 추천해줄게"} 
        addNewBubble={addNewBubbleBot}
      />
    </React.Fragment>
      ))}
    </div>
    </div>
    </div>
  );
}
export default App;
