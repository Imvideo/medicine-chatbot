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
  const [backendResponse, setBackendResponse] = useState([]);
  const buttons = ['두통', '메스꺼움', '복통', '기침', '어지러움', '치통'];
  
  const requestData = {
    userMessage: 'yourUsername'
  };
  
  const sendGetRequest = (text) => {
    fetch(`http://ec2-52-203-48-52.compute-1.amazonaws.com:8080/api/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received Data:', data);
        // const newBubbleUser = {
        //   text: text,
        // };
        // setBubbleUser([...chatBubbleUser, newBubbleUser]);
        const newBackendResponse = {
          data : data,
        };
        setBackendResponse([...backendResponse, newBackendResponse]);
        console.log('newBackendResponse 타입:', typeof newBackendResponse);


      
        //setBackendResponse(data);
        // 받은 데이터 처리
      })
      .catch(error => {
        console.error('Error:', error);
        // 에러 처리
      });
  };

  // const sendToBackend = async (data) => {
  //   requestData.userMessage = data;
  //   fetch('http://34.204.171.30:8080/askLexV2', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json', // 데이터 형식을 JSON으로 지정
  //       // 다른 필요한 헤더도 여기에 추가할 수 있습니다.
  //     },
  //     body: JSON.stringify(requestData) // 데이터를 JSON 문자열로 변환하여 body에 추가
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json(); // 응답 데이터를 JSON 형식으로 파싱
  //     })
  //     .then(data => {
  //       console.log('Success:', data);
  //       setTimeout(sendGetRequest(),4000); // 1초 후에 delayedAction 함수 실행
  //       ;
  //       // 서버 응답에 대한 처리
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //       // 에러 처리
  //     });
  //   };    
  const sendToBackend = async (data) => {
    requestData.userMessage = data;
  
    try {
      const response = await fetch('http://ec2-52-203-48-52.compute-1.amazonaws.com:8080/askLexV2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Success:', responseData);
      await sendGetRequest(); // 이 부분이 비동기적으로 처리됩니다.
    } catch (error) {
      console.error('Error:', error);
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
      addNewBubbleChat(userInput);
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
          {backendResponse && chatBubbleUser.map((bubble, index) => (
            <React.Fragment key={index}>
              <ChatBubbleUser
                key={'user-' + index}
                text={bubble.text + '이 있어. 약을 추천해줄래?'}
                addNewBubble={addNewBubbleUser}
              />
                <TextChatBubbleBot
      key={'bot-' + chatBubbleBot.length + index} 
      text={backendResponse[index] ? `${backendResponse[index].data.symptom}에 대한 약을 추천해 드리겠습니다.\n 
      약 이름은 ${backendResponse[index].data.itemName}입니다.
      약의 효능은 다음과 같습니다. ${backendResponse[index].data.effect}
      부작용은 다음과 같습니다. ${backendResponse[index].data.sideEffect}` : ' '} 

      addNewBubble={addNewBubbleBot}
    />
    <ChatBubble text="어디가 아프신가요?" buttons={buttons} onClick={handleButtonClick} />
  </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
