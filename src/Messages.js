import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { css } from '@emotion/core';
import { useStateValue } from './StateProvider';
import moment from 'moment';
import { db } from './firebase';
import firebase, { firestore, functions } from 'firebase/app';

import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
const override = css`
  display: block;
  margin: auto;
  border-color: red;
`;

export const Messages = React.memo(
  ({ messages, usersArray, userInfo }) => {
    const messagesEndRef = useRef([]);
    const sortedMessages = messages?.sort((a, b) => a.timestamp - b.timestamp);
    const [loading, setLoading] = useState(false);
    const [liked, setLike] = useState(false);
    const [newLikeObj, setNewLikeObj] = useState(null);
    const [{ email, user, userSentMsg }, dispatch] = useStateValue();
    // const [likeCount, setLikeCount] = useState(0);
    const [{ sentMessage }] = useStateValue();

    const scrollToBottom = () => {
      if (
        messagesEndRef.current === null ||
        messagesEndRef.current.length <= 0
      ) {
        return;
      } else {
        messagesEndRef &&
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    useEffect(() => {
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

    const fireLikeBtn = (ind) => {
      const loggedInUser = userInfo.email;
      const existingUser = sortedMessages[ind].liked
        .map((i) => i)
        .includes(loggedInUser);

      const filteredLike = sortedMessages[ind].liked.filter(
        (i) => i !== loggedInUser
      );

      if (email) {
        if (existingUser) {
          const messages = sortedMessages?.map((i, indx) =>
            ind === indx
              ? {
                  ...i,
                  liked: (i.liked = filteredLike),
                }
              : i
          );
        } else {
          const messages = sortedMessages?.map((i, indx) =>
            ind === indx
              ? {
                  ...i,
                  liked: (i.liked = [...i.liked, loggedInUser]),
                }
              : i
          );
        }

        const userOne = messages.map((i, indx) =>
          ind === indx ? { ...i, channelName: (i.channelName = email) } : i
        );
        const userTwo = messages.map((i, indx) =>
          ind === indx
            ? { ...i, channelName: (i.channelName = userInfo.email) }
            : i
        );

        db.collection(userInfo.email).doc(email).set(
          {
            messages: userOne,
          },
          { merge: true }
        );
        db.collection(email).doc(userInfo.email).set(
          {
            messages: userTwo,
          },
          { merge: true }
        );
      } else {
        if (existingUser) {
          const messages = sortedMessages?.map((i, indx) =>
            ind === indx
              ? {
                  ...i,
                  liked: (i.liked = filteredLike),
                }
              : i
          );
        } else {
          const messages = sortedMessages?.map((i, indx) =>
            ind === indx
              ? { ...i, liked: (i.liked = [...i.liked, loggedInUser]) }
              : i
          );
        }
        db.collection('channels').doc(user).set(
          {
            messages: messages,
          },
          { merge: true }
        );
      }
    };
    const renderMessages = () => {
      const loggedInUser = userInfo.email;
      return (
        <>
          {sortedMessages?.map((message, i) => (
            <div
              key={message.timestamp}
              className={
                message.email === loggedInUser
                  ? 'message-container-user'
                  : 'message-container'
              }
            >
              <div className='message-profile-div'>
                {usersArray
                  .filter((i) => i.email === message.email)
                  .map((i, _) => (
                    <>
                      <img
                        key={i.timestamp}
                        className={
                          message.email === loggedInUser
                            ? 'message-image-user'
                            : 'message-image'
                        }
                        alt=''
                        onError={imgError}
                        src={i.uploadImage}
                      ></img>
                    </>
                  ))}
              </div>

              <div
                className={
                  message.email === loggedInUser
                    ? 'message-content-container-user'
                    : 'message-content-container'
                }
              >
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
                  <p>
                    {moment.unix(message.timestamp.seconds).format('h:mma')}
                  </p>
                </div>
              </div>

              <div className='heart__like__btn__div'>
                <FavoriteOutlinedIcon
                  onClick={() => fireLikeBtn(i)}
                  className={
                    message.liked.length > 0
                      ? 'heart__like__btn__liked'
                      : 'heart__like__btn'
                  }
                />
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
        ) : messages?.length <= 0 ? (
          <h2> Start the chat!</h2>
        ) : (
          <>{renderMessages()}</>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // console.log(prevProps);
    // console.log(nextProps);
    const nextChannel = nextProps?.messages
      ? nextProps.messages[nextProps.messages?.length - 1]?.channelName
      : nextProps;
    if (nextProps?.messages) {
      if (nextProps?.messages.length > 0) {
        if (nextChannel !== nextProps.selectedChannel) {
          return true;
        }
      }
    } else {
      return false;
    }
  }
);

export default Messages;
//! Another example of flatmap
// const matchingUser = userNameArray.flatMap((i) =>
//   usersArray.filter((n) => n.email === i)
// );
