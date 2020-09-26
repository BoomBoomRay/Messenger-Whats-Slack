import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { db } from './firebase';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { css } from '@emotion/core';

const override = css`
  display: block;
  margin: auto;
  border-color: red;
`;

export default function Messages({ messages, usersArray, uploadImage }) {
  const messagesEndRef = useRef(null);
  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
  const [loading, setLoading] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      scrollToBottom();
    }, 1500);
  }, [messages]);

  const imgError = (e) => {
    e.target.src =
      'https://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-md.png';
  };
  const renderMessages = () => {
    return (
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
    );
  };

  return (
    <div className='messengerContainerList'>
      {loading ? (
        <PropagateLoader
          color={'#3f51b5'}
          css={override}
          className='message_loader'
        />
      ) : messages.length <= 0 ? (
        <h2> Start the chat!</h2>
      ) : (
        <>{renderMessages()}</>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

//! Another example of flatmap
// const matchingUser = userNameArray.flatMap((i) =>
//   usersArray.filter((n) => n.email === i)
// );
