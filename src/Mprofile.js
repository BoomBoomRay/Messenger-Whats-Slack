import React, { useState, useCallback, useEffect } from 'react';
import { db, storage } from './firebase';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Slider from './Slider';
export default function Mprofile({
  userInfo,
  messages,
  logout,
  usersArray,
  handleToggleDarkMode,
  toggleDarkMode,
}) {
  const [userHandle, setuserHandle] = useState('');
  // const [imgLoading, setImgLoading] = useState(false);
  // const [image, setimage] = useState(null);
  const [currentImgfromStrg, setcurrentImgfromStrg] = useState('');
  const [uploadImage, setuploadImage] = useState(null);
  const [toggleChangeUserName, setToggleChangerUserName] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setToggleChangerUserName(!toggleChangeUserName);
  };

  const renderUserInfo = () => {
    let filterUser = usersArray
      .filter((i) => i.email === userInfo.email)
      .map((i) => i.user);
    return (
      <>
        <h2>Welcome {filterUser}</h2>
        <p onClick={() => setToggleChangerUserName(!toggleChangeUserName)}>
          Change Username?
        </p>
      </>
    );
  };
  const renderChangeUserNameInput = () => {
    return (
      <div className='changeUserName__div'>
        <form>
          <input
            placeholder={userHandle}
            value={userHandle}
            onChange={(e) => setuserHandle(e.target.value)}
          ></input>
          <button onClick={submitUsername} disabled={userHandle ? false : true}>
            Change
          </button>
        </form>
      </div>
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
    db.collection('users')
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
      // setimage(imageFile);
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

  return (
    <div
      className={toggleDarkMode ? 'profile-container-d' : 'profile-container'}
    >
      <div className='title-container-profile'>
        <h1>Profile</h1>
      </div>
      <div className='img-profile-div'>
        {renderUserInfo()}
        {toggleChangeUserName && renderChangeUserNameInput()}
        <div className='img-profile-container'>
          {/* <progress
              value={progress}
              max='100'
              style={{ display: imgLoading ? '!none' : 'none' }}
            /> */}
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
        <div className='logout__div'>
          <button onClick={logout}>Logout</button>
          <Slider handleToggleDarkMode={handleToggleDarkMode} />
        </div>
      </div>
    </div>
  );
}
