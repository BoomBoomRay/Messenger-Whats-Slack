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
  const [{ email }, dispatch] = useStateValue();
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
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            content: input,
            edit: false,
            email: userInfo.email,
            uploadImage: uploadImage,
          }),
          recieverHasRead: false,
        });
      db.collection(email)
        .doc(userInfo.email)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            content: input,
            edit: false,
            email: userInfo.email,
            uploadImage: uploadImage,
          }),
          recieverHasRead: false,
        });
      dispatch({
        type: 'DIRECT_MESSAGE_SELECT',
        email: userInfo.email,
      });
      // db.collection(userInfo.email).doc(email).collection('messages').add({
      //   timestamp: firebase.firestore.Timestamp.now(),
      //   content: input,
      //   edit: false,
      //   email: userInfo.email,
      //   uploadImage: uploadImage,
      //   recieverHasRead: false,
      // });
      // db.collection(email).doc(userInfo.email).collection('messages').add({
      //   timestamp: firebase.firestore.Timestamp.now(),
      //   content: input,
      //   edit: false,
      //   email: userInfo.email,
      //   uploadImage: uploadImage,
      //   recieverHasRead: false,
      // });
    } else {
      console.log(docName);
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
        }); // db.collection('channels').doc(docName).collection('messages').add({
      //   timestamp: firebase.firestore.Timestamp.now(),
      //   content: input,
      //   edit: false,
      //   email: userInfo.email,
      //   uploadImage: uploadImage,
      //   channel: docName,
      // });
      dispatch({
        type: 'SELECT_CHANNEL',
        user: docName,
      });
    }
    dispatch({
      type: 'SUBMIT_MESSAGE',
      sentMessage: true,
      userSentMg: userInfo.email,
    });
    setInput('');
  };
  return (
    <div>
      <div className='input-container'>
        <input
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
