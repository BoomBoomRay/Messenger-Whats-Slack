import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { db } from './firebase';

export default function Messages({ messages, usersArray, uploadImage }) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const imgError = (e) => {
    e.target.src =
      'https://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-md.png';
  };

  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

  // const matchingUser = userNameArray.flatMap((i) =>
  //   usersArray.filter((n) => n.email === i)
  // );
  return (
    <div className='messengerContainerList'>
      {messages.length <= 0 ? (
        <h2> Loading....</h2>
      ) : (
        <>
          {sortedMessages.map((message, i) => (
            <div key={message.timestamp} className='message-container'>
              <div className='message-profile-div'>
                {usersArray
                  .filter((i) => i.email === message.email)
                  .map((i, _) => (
                    <img
                      key={_}
                      className='message-image'
                      alt=''
                      onError={imgError}
                      src={i.uploadImage}
                    ></img>
                  ))}
              </div>
              <div className='message-content-container'>
                <div className='message-userName-div'>
                  {usersArray
                    .filter((i) => i.email === message.email)
                    .map((i, _) => (
                      <span key={_} className='message-userName'>
                        {' '}
                        {i.user}..
                      </span>
                    ))}
                </div>
                <div className='message-content-div'>
                  <span className='message-content'>{message.content}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
