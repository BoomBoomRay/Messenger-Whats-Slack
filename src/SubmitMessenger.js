import React, { useState } from 'react';
import firebase from 'firebase/app';
import SendIcon from '@material-ui/icons/Send';
import { db } from './firebase';
import { useStateValue } from './StateProvider';
export default function SubmitMessenger({
  userInfo,
  uploadImage,
  selectedChannel,
}) {
  const [input, setInput] = useState('');
  const [{ email, user, userSentMsg }, dispatch] = useStateValue();
  const docName = selectedChannel ? selectedChannel : 'mainChannel';
  const handleMessage = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };
  const submitMessage = (e) => {
    e.preventDefault();
    if (email) {
      db.collection(userInfo.email)
        .doc(email)
        .set(
          {
            // .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              timestamp: firebase.firestore.Timestamp.now(),
              content: input,
              edit: false,
              email: userInfo.email,
              uploadImage: uploadImage,
              channelName: email,
            }),
            recieverHasRead: false,
            createdBy: userInfo.email,
            dmRecipient: email,
            list: true,
          },
          { merge: true }
        );
      db.collection(email)
        .doc(userInfo.email)
        .set(
          {
            // .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              timestamp: firebase.firestore.Timestamp.now(),
              content: input,
              edit: false,
              email: userInfo.email,
              uploadImage: uploadImage,
              channelName: userInfo.email,
            }),
            recieverHasRead: false,
            createdBy: email,
            dmRecipient: userInfo.email,
            list: true,
          },
          { merge: true }
        );
    } else {
      db.collection('channels')
        .doc(docName)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            content: input,
            edit: false,
            email: userInfo.email,
            uploadImage: uploadImage,
            channelName: docName,
          }),
          recieverHasRead: false,
          sentBy: userInfo.email,
        });
      dispatch({
        type: 'SELECT_CHANNEL',
        user: docName,
      });
    }
    dispatch({
      type: 'SUBMIT_MESSAGE',
      sentMessage: true,
      userSentMsg: userInfo.email,
    });
    setInput('');
  };
  const msgIsRead = () => {
    if (email) {
      db.collection(userInfo.email).doc(email).update({
        recieverHasRead: true,
      });
    } else if (userInfo.email !== userSentMsg) {
      db.collection('channels').doc(docName).update({
        recieverHasRead: true,
      });
    }
  };
  return (
    <div>
      <div className='input-container'>
        <input
          onFocus={msgIsRead}
          className='input-message'
          value={input}
          onChange={handleMessage}
          placeholder='Type Message'
        ></input>
        <button className='send-button' onClick={submitMessage}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
