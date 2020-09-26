import React, { useState } from 'react';
import firebase from 'firebase/app';
import SendIcon from '@material-ui/icons/Send';
import { db } from './firebase';
import { useStateValue } from './StateProvider';
export default function SubmitMessenger({
  userInfo,
  channels,
  userFromDb,
  uploadImage,
  inputNameChannel,
  selectedChannel,
}) {
  const [input, setInput] = useState('');
  const [{ sentMessage }, dispatch] = useStateValue();
  const docName = selectedChannel ? selectedChannel : 'mainChannel';

  const handleMessage = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    db.collection('channels').doc(docName).collection('messages').add({
      timestamp: firebase.firestore.Timestamp.now(),
      content: input,
      edit: false,
      email: userInfo.email,
      uploadImage: uploadImage,
    });
    dispatch({
      type: 'SUBMIT_MESSAGE',
      sentMessage: true,
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
