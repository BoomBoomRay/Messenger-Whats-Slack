import Messages from '../Messages/Messages';
import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../../utils/firebase';
import SubmitMessenger from '../Submit/SubmitMessenger';
import LeftNavigation from '../LeftNavigation/LeftNavigation';
import { useStateValue } from '../../utils/StateProvider';
import Mprofile from '../Profile/Mprofile';
import './Messenger.css';

export default function Messenger({
  userInfo,
  logout,
  usersArray,
  handleToggleDarkMode,
  toggleDarkMode,
}) {
  const [uploadImage, setuploadImage] = useState(null);
  const [chanels, setChannels] = useState(null);
  const [messages, setMessage] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('mainChannel');
  const [{ nameOfChannel, email, deleted }, dispatch] = useStateValue();
  const [userTyping, setUserTyping] = useState(false);

  const changeEmailtoUserName = usersArray?.filter(
    (i) => i.email === selectedChannel
  );
  const lastUser = { messages: messages };

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

        if (email) {
          db.collection(userInfo.email)
            .doc(email)
            .onSnapshot((res) => {
              setMessage(res.data()?.messages ? res.data().messages : []);
            });
          setSelectedChannel(email);
        } else if (nameOfChannel) {
          db.collection('channels')
            .doc(nameOfChannel)
            .onSnapshot((res) => {
              setMessage(res.data()?.messages ? res.data().messages : []);
            });
          setSelectedChannel(nameOfChannel);
        } else {
          db.collection('channels')
            .doc('mainChannel')
            .onSnapshot((res) => setMessage(res.data()?.messages));
          setSelectedChannel('mainChannel');
        }
        db.collection('channels')
          .where('channel', '==', true)
          .onSnapshot((res) => {
            setChannels(res.docs.map((d) => d.data()));
          });
      }
    };
    loadData();

    return () => {
      mounted = false;
    };
  }, [
    uploadImage,
    renderImgfromDB,
    userInfo.email,
    dispatch,
    nameOfChannel,
    email,
    deleted,
  ]);

  const changeChannel = (ind, boolean, sentBY) => {
    const specificChannel = chanels[ind].channelName;

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
      isChannel: true,
    });
    dispatch({
      type: 'NEW_CREATED_CHANNEL',
      nameOfChannel: '',
    });
    db.collection('channels')
      .doc(selectedChnlString)
      .onSnapshot((res) => {
        setMessage(res.data()?.messages ? res.data().messages : []);
      });
    if (sentBY !== userInfo.email) {
      db.collection('channels').doc(specificChannel).update({
        recieverHasRead: boolean,
      });
    }
  };
  const selectDM = (email) => {
    dispatch({
      type: 'DIRECT_MESSAGE_SELECT',
      email: email,
      isChannel: false,
    });
    dispatch({
      type: 'SELECT_CHANNEL',
      user: '',
    });
    dispatch({
      type: 'NEW_CREATED_CHANNEL',
      nameOfChannel: '',
    });
    setSelectedChannel(email);
    db.collection(userInfo.email)
      .doc(email)
      .onSnapshot((res) => {
        const messages = res.data();
        setMessage(
          messages ? (messages.messages ? messages.messages : []) : []
        );
      });
  };

  return (
    <>
      <LeftNavigation
        toggleDarkMode={toggleDarkMode}
        userInfo={userInfo}
        selectedChannel={selectedChannel}
        selectDM={selectDM}
        messages={messages}
        changeChannel={changeChannel}
        channels={chanels}
        setMessage={setMessage}
        usersArray={usersArray}
      />

      <div className='messengerContainer'>
        <div
          className={toggleDarkMode ? 'title-container-d' : 'title-container'}
        >
          <h1>
            Room: #{' '}
            {changeEmailtoUserName[0]?.user
              ? changeEmailtoUserName[0].user
              : nameOfChannel
              ? nameOfChannel
              : selectedChannel}
          </h1>
        </div>
        <form>
          <Messages
            toggleDarkMode={toggleDarkMode}
            userTyping={userTyping}
            lastUser={lastUser}
            userInfo={userInfo}
            uploadImage={uploadImage}
            messages={messages}
            usersArray={usersArray}
            selectedChannel={nameOfChannel ? nameOfChannel : selectedChannel}
            deleted={deleted}
          />

          <SubmitMessenger
            channels={chanels}
            setUserTyping={setUserTyping}
            userTyping={userTyping}
            userInfo={userInfo}
            uploadImage={uploadImage}
            selectedChannel={nameOfChannel ? nameOfChannel : selectedChannel}
          />
        </form>
      </div>

      <Mprofile
        toggleDarkMode={toggleDarkMode}
        handleToggleDarkMode={handleToggleDarkMode}
        logout={logout}
        userInfo={userInfo}
        usersArray={usersArray}
      />
    </>
  );
}
