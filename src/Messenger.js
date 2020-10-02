import Messages from './Messages';
import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from './firebase';
import SubmitMessenger from './SubmitMessenger';
import LeftNavigation from './LeftNavigation';
import { useStateValue } from './StateProvider';
import Mprofile from './Mprofile';

export default function Messenger({ userInfo, logout, usersArray }) {
  const [uploadImage, setuploadImage] = useState(null);
  const [userFromDb, setuserFromDb] = useState(null);
  const [chanels, setChannels] = useState(null);
  const [messages, setMessage] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [, dispatch] = useStateValue();

  const renderImgfromDB = useCallback(
    (string) => {
      storage
        .ref(`images/${userInfo.email}`)
        .child(string)
        .getDownloadURL()
        .then((data) => {
          setuploadImage(data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [userInfo.email]
  );

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const response = await storage
        .ref(`images/${userInfo.email}`)
        .list()
        .then((data) => {
          return data;
        })
        .catch((error) => console.log(error));
      if (mounted) {
        if (response.items.length > 0) {
          renderImgfromDB(response.items[0].location.path_.slice(19));
        } else {
          setuploadImage(
            'https://www.clker.com/cliparts/d/L/P/X/z/i/no-image-icon-md.png'
          );
        }
        dispatch({
          type: 'SELECT_CHANNEL',
          user: 'mainChannel',
        });
        db.collection('channels')
          .doc('mainChannel')
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .onSnapshot((res) => {
            setMessage(res.docs.map((doc) => doc.data()));
          });
        db.collection('channels')
          .where('channel', '==', true)
          .onSnapshot((res) => {
            setChannels(res.docs.map((d) => d.data()));
          });
        db.collection('messages')
          .where('email', '==', userInfo.email)
          .get()
          .then((data) => {
            const user = data.docs.map((doc) => doc.data().user);
            setuserFromDb(user[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    loadData();

    return () => {
      mounted = false;
    };
  }, [uploadImage, renderImgfromDB, userInfo.email, dispatch]);

  const changeChannel = (ind) => {
    dispatch({
      type: 'SUBMIT_MESSAGE',
      sentMessage: false,
    });
    const selectedChnlString = chanels && chanels[ind].channelName;
    setSelectedChannel(selectedChnlString);
    dispatch({
      type: 'SELECT_CHANNEL',
      user: selectedChnlString,
    });
    dispatch({
      type: 'DIRECT_MESSAGE_SELECT',
      email: '',
    });
    db.collection('channels')
      .doc(selectedChnlString)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((res) => {
        setMessage(res.docs.map((doc) => doc.data()));
      });
  };
  const selectDM = (email) => {
    dispatch({
      type: 'DIRECT_MESSAGE_SELECT',
      email: email,
    });
    setSelectedChannel(email);
    db.collection(userInfo.email)
      .doc(email)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((res) => {
        setMessage(res.docs.map((doc) => doc.data()));
      });
  };
  return (
    <>
      <LeftNavigation
        userInfo={userInfo}
        selectDM={selectDM}
        changeChannel={changeChannel}
        channels={chanels}
      />
      <div className='messengerContainer'>
        <form>
          <div className='title-container'>
            <h1>Room: # {selectedChannel ? selectedChannel : 'mainChannel'}</h1>
          </div>

          <Messages
            userInfo={userInfo}
            uploadImage={uploadImage}
            messages={messages}
            usersArray={usersArray}
          />
          <SubmitMessenger
            channels={chanels}
            userInfo={userInfo}
            userFromDb={userFromDb}
            uploadImage={uploadImage}
            selectedChannel={selectedChannel}
          />
        </form>
      </div>
      <Mprofile
        logout={logout}
        userInfo={userInfo}
        usersArray={usersArray}
        messages={messages}
      />
    </>
  );
}
