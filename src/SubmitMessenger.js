import React, { useState } from 'react';
import firebase from 'firebase/app';
import SendIcon from '@material-ui/icons/Send';
import { db, storage } from './firebase';
import { useStateValue } from './StateProvider';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { EmailTwoTone } from '@material-ui/icons';
export default function SubmitMessenger({
  userInfo,
  uploadImage,
  selectedChannel,
}) {
  const [input, setInput] = useState('');
  const [msgImg, setMsgImg] = useState(null);
  const [{ email, user, userSentMsg }, dispatch] = useStateValue();
  const docName = selectedChannel ? selectedChannel : 'mainChannel';
  const [progress, setProgress] = useState(0);

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
              liked: [],
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
              liked: [],
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
            liked: [],
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

  const addPhoto = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      handleUpload(imageFile);
    }
  };
  const handleUpload = (img) => {
    console.log(img);
    if (user) {
      storage
        .ref(`channels/${user}/${img.name}`)
        .put(img)
        .on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref(`channels/${user}`)
              .child(img.name)
              .getDownloadURL()
              .then((url) => {
                setMsgImg(url);
                submitChannelImg(url);
              });
          }
        );
    } else {
      storage
        .ref(`channels/${email}/${img.name}`)
        .put(img)
        .on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref(`channels/${email}`)
              .child(img.name)
              .getDownloadURL()
              .then((url) => {
                setMsgImg(url);
                submitMessageImg(url);
              });
          }
        );
    }
  };

  const submitChannelImg = (url) => {
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
          liked: [],
          imageMessage: url,
        }),
        recieverHasRead: false,
        sentBy: userInfo.email,
      });
  };
  const submitMessageImg = (url) => {
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
            liked: [],
            imageMessage: url,
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
            liked: [],
            imageMessage: url,
          }),
          recieverHasRead: false,
          createdBy: email,
          dmRecipient: userInfo.email,
          list: true,
        },
        { merge: true }
      );
  };
  return (
    <div className='input-container'>
      <label onChange={addPhoto}>
        <input style={{ display: 'none' }} type='file' />
        <AttachFileIcon className='attach__photo' />
      </label>
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
  );
}
