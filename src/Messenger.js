import Messages from './Messages';
import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from './firebase';
import Mprofile from './Mprofile';
import { useHistory } from 'react-router-dom';
import SubmitMessenger from './SubmitMessenger';

export default function Messenger({ messages, userInfo, logout, usersArray }) {
  const [uploadImage, setuploadImage] = useState(null);
  const [userFromDb, setuserFromDb] = useState(null);
  const history = useHistory();

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
  }, [uploadImage, renderImgfromDB, userInfo.email]);

  const goToProfile = () => {
    history.push('/profile');
  };
  return (
    <>
      <button onClick={goToProfile}>Profile</button>
      <div className='messengerContainer'>
        <form>
          <div className='title-container'>
            <h1>Messenger</h1>
          </div>
          <Messages
            userInfo={userInfo}
            uploadImage={uploadImage}
            messages={messages}
            usersArray={usersArray}
          />
          <SubmitMessenger
            userInfo={userInfo}
            userFromDb={userFromDb}
            uploadImage={uploadImage}
          />
        </form>
      </div>
    </>
  );
}
