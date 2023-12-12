import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './SquareButton.css';
import ChatBubble from './ChatBubble';
import ChatBubbleUser from './ChatBubbleUser';
import TextChatBubbleBot from './TextChatBubbleBot';

function App() {
  const [chatBubbleUser, setBubbleUser] = useState([]);
  const [chatBubbleBot, setBubbleBot] = useState([]);
  const [chatBubbleChat, setBubbleChat] = useState([]);
  const [dataFromSpring, setDataFromSpring] = useState('');
  const [backendResponse, setBackendResponse] = useState(null);
  const buttons = ['두통', '메스꺼움', '복통', '기침', '어지러움', '치통', '생리통'];

  useEffect(() => {
    axios.get('/api/data')
      .then(response => {
        setDataFromSpring(response.data);
      })
      .catch(error => {
        console.error('데이터를 받아오지 못했습니다.', error);
      });
  }, []);

  const sendDataToSpring = () => {
    const dataToSend = '리액트에서 보내는 데이터';
    axios.post('/api/receive', dataToSend)
      .then(response => {
        console.log('데이터를 성공적으로 보냈습니다.', response.data);
      })
      .catch(error => {
        console.error('데이터를 보내지 못했습니다.', error);
      });
  };

  const sendToBackend = async (data) => {
    try {
      
      const response = await fetch('http://3.233.233.47:8080/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // JSON 형태가 아니라 text/plain으로 변경
      },
      body: JSON.stringify(data), // JSON.stringify를 사용하여 문자열로 변환
    });
      if (response.ok) {
        const responseData = await response.json();
        setBackendResponse(responseData);
        addNewBubbleBot(responseData.message);
      } else {
        addNewBubbleBot('Network response was not ok.');
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      addNewBubbleBot(data+"입니다.");
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleButtonClick = (text) => {
    addNewBubbleUser(text); // 사용자쪽 말풍선
    const dataToSend = text; // 백엔드에 전달할 데이터
    sendToBackend(dataToSend);
  };

  const addNewBubbleUser = (text) => {
    const newBubbleUser = {
      text: text,
    };
    setBubbleUser([...chatBubbleUser, newBubbleUser]);
  };

  const addNewBubbleBot = (text) => {
    const isDuplicate = chatBubbleBot.some(bubble => bubble.text === text);
  
    if (!isDuplicate) {
      setBubbleBot(prevBubbles => [...prevBubbles, { text }]);
    }
  };

  const addNewBubbleChat = (text) => {
    const newBubbleChat = {
      text: text,
    };
    setBubbleChat([...chatBubbleChat, newBubbleChat]);
};

  const handleReset = () => {
    window.location.reload(); // 페이지 새로고침
  };

  const handleInputEnter = (e) => {
    if (e.key === 'Enter') {
      const userInput = e.target.value;
      addNewBubbleUser(userInput);
      sendToBackend(userInput);
      e.target.value = ''; // 입력란 비우기
    }
  };

  return (
    <div className="center-container">
      <div className="subcenter-container">
        <div className="title">Medicine Chatbot</div>
        <div className="reset-button" onClick={handleReset}>
          초기화
        </div>
        <input type="text" placeholder="증상을 입력해 주세요." onKeyPress={handleInputEnter} />
        <div className="square-container">
          <ChatBubble text="어디가 아프신가요?" buttons={buttons} onClick={handleButtonClick} />
          {chatBubbleUser.map((bubble, index) => (
            <React.Fragment key={index}>
              <ChatBubbleUser
                key={'user-' + index}
                text={bubble.text + '이 있어. 약을 추천해줄래?'}
                addNewBubble={addNewBubbleUser}
              />
                <TextChatBubbleBot
      key={'bot-' + chatBubbleBot.length + index} 
      text={chatBubbleBot[index] ? chatBubbleBot[index].text : ''} 
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
