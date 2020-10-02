import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { css } from '@emotion/core';
import { useStateValue } from './StateProvider';
import moment from 'moment';
import { db } from './firebase';

const override = css`
  display: block;
  margin: auto;
  border-color: red;
`;

export default function Messages({
  messages,
  selectedChannel,
  usersArray,
  uploadImage,
}) {
  const messagesEndRef = useRef([]);
  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
  // const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [{ sentMessage }] = useStateValue();

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    console.log(selectedChannel);
    // db.collection()
    setLoading(sentMessage ? false : true);
    setTimeout(() => {
      setLoading(false);
      scrollToBottom();
    }, 500);
  }, [messages, sentMessage]);

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
                <p>{moment.unix(message.timestamp.seconds).format('h:mma')}</p>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };
  // console.log(messages);
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
