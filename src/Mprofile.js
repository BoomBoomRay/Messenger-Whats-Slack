import React, { useState, useCallback, useEffect } from 'react';
import { db, storage } from './firebase';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { useHistory } from 'react-router-dom';

export default function Mprofile({ userInfo, messages, logout, usersArray }) {
  const [userHandle, setuserHandle] = useState('');
  const [imgLoading, setImgLoading] = useState(false);
  const [image, setimage] = useState(null);
  const [userFromDb, setuserFromDb] = useState(null);
  const [currentImgfromStrg, setcurrentImgfromStrg] = useState('');
  const [uploadImage, setuploadImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  const renderImgfromDB = useCallback(
    (string) => {
      setcurrentImgfromStrg(string);
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
        // db.collection('messages')
        //   .where('email', '==', userInfo.email)
        //   .get()
        //   .then((data) => {
        //     const user = data.docs.map((doc) => doc.data().user);
        //     setuserFromDb(user[0]);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      }
    };
    loadData();

    return () => {
      mounted = false;
    };
  }, [uploadImage, renderImgfromDB, userInfo.email]);

  const submitUsername = (e) => {
    db.collection('users')
      .where('email', '==', userInfo.email)
      .get()
      .then((data) => {
        data.docs.map((doc) =>
          doc.ref
            .update({
              user: userHandle,
            })
            .catch((error) => {
              console.log(error);
            })
        );
      });
    setuserHandle('');
  };

  const renderUserInfo = () => {
    let filterUser = usersArray
      .filter((i) => i.email === userInfo.email)
      .map((i) => i.user);
    return (
      <>
        <h2>User Handle: {filterUser}</h2>
      </>
    );
  };
  const uploadPhoto = (obj) => {
    const uploadTask = storage
      .ref(`images/${userInfo.email}/${obj.name}`)
      .put(obj);
    uploadTask.on(
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
          .ref(`images/${userInfo.email}`)
          .child(obj.name)
          .getDownloadURL()
          .then((url) => {
            setuploadImage(url);
            saveNewImgtoDb(url);
          });
      }
    );
  };
  const saveNewImgtoDb = (url) => {
    db.collection('messages')
      .where('email', '==', userInfo.email)
      .get()
      .then((data) => {
        data.docs.map((doc) =>
          doc.ref
            .update({
              uploadImage: url,
            })
            .catch((error) => {
              console.log(error);
            })
        );
      });
  };
  const handleUpload = (e) => {
    // If img already exists
    const imageFile = e.target.files[0];
    if (imageFile) {
      setimage(imageFile);
      if (currentImgfromStrg) {
        const storageRef = storage
          .ref(`images/${userInfo.email}`)
          .child(currentImgfromStrg);
        storageRef
          .delete()
          .then(() => {
            uploadPhoto(imageFile);
          })
          .catch((error) => {
            console.log(error);
          });
        // else
      } else {
        uploadPhoto(imageFile);
      }
    }
  };

  const backToMessenger = () => {
    history.replace('/messenger');
  };
  return (
    <div className='profile-container'>
      <div className='title-container-profile'>
        <h1>Profile</h1>
      </div>
      <button onClick={backToMessenger}>back</button>
      <div>
        <div className='img-profile-div'>
          <div className='img-profile-container'>
            <progress
              value={progress}
              max='100'
              style={{ display: imgLoading ? '!none' : 'none' }}
            />
            <label className='custom-file-upload' onChange={handleUpload}>
              <input style={{ display: 'none' }} type='file' />
              <img className='img-profile' alt='' src={uploadImage}></img>
              <AddPhotoAlternateIcon className='custom-file-img-icon' />
            </label>
            <label onChange={handleUpload}>
              <input style={{ display: 'none' }} type='file' />
              <p className='change-pic-label'>Change Picture</p>
            </label>
          </div>
        </div>
        <h2>{userInfo.email}</h2>
        {renderUserInfo()}
        <h2>{messages.user}</h2>
        <input
          placeholder={userHandle}
          value={userHandle}
          onChange={(e) => setuserHandle(e.target.value)}
        ></input>
        <button onClick={submitUsername} disabled={userHandle ? false : true}>
          Change Username
        </button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
