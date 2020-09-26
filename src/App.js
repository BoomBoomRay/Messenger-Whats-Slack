import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import Messenger from './Messenger';
import './App.css';
import { Switch, Route, useHistory } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import firebase from 'firebase/app';
import Mprofile from './Mprofile';

function App() {
  const [userName, setuserName] = useState('');
  const [passWord, setPassword] = useState('');
  const [user, setuser] = useState(null);
  const [errorMessage, seterrorMessage] = useState('');
  const [messages, setMessage] = useState([]);
  const [usersArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [welcomeScreenLoading, setwelcomeScreenLoading] = useState(true);
  const [loggingOut, setLoggingoutLoading] = useState(false);
  const [emailVerification, setemailVerification] = useState(false);
  const history = useHistory();

  useEffect(() => {
    var unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setuser(user);
      } else {
        unsubscribe();
        setuser(null);
      }
    });
    // db.collection('channels')
    //   .doc('Channel1')
    //   .collection('messages')
    //   .orderBy('timestamp', 'desc')
    //   .onSnapshot((res) => {
    //     setMessage(res.docs.map((doc) => doc.data()));
    //   });
    // db.collection('messages')
    //   .orderBy('timestamp', 'desc')
    //   .onSnapshot((res) => {
    //     setMessage(res.docs.map((doc) => doc.data()));
    //   });
    db.collection('users').onSnapshot((res) => {
      setUserArray(res.docs.map((doc) => doc.data()));
    });
  }, []);

  setTimeout(() => {
    setwelcomeScreenLoading(false);
  }, 2000);

  const inputUserName = (e) => {
    e.preventDefault();
    setuserName(e.target.value);
    setemailVerification(false);
  };

  const inputPassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      let data = await auth.createUserWithEmailAndPassword(userName, passWord);
      if (data) {
        setuser(data.user);
        setuserName('');
        setPassword('');
        setRegistering(false);
        db.collection('users').add({
          timestamp: firebase.firestore.Timestamp.now(),
          email: userName,
          user: userName,
          uploadImage: '',
        });
        history.push('/messenger');
      } else {
        history.push('/');
      }
    } catch (error) {
      setRegistering(false);
      seterrorMessage(error.message);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await auth.signInWithEmailAndPassword(userName, passWord);
      setuser(response.user);
      setLoading(false);
      setemailVerification(false);
      setuserName('');
      setPassword('');
      if (response) {
        history.push('/messenger');
      } else {
        history.push('/');
      }
    } catch (error) {
      setLoading(false);
      seterrorMessage(error.message);
    }
  };

  const forgotPassword = () => {
    auth
      .sendPasswordResetEmail(userName)
      .then(() => {
        setemailVerification(true);
        seterrorMessage('');
      })
      .catch((error) => {
        console.log(error);
        seterrorMessage(error.message);
      });
  };

  const logout = () => {
    setemailVerification(false);
    setLoggingoutLoading(true);
    setTimeout(() => {
      setuser(null);
      history.push('/');
      auth
        .signOut()
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoggingoutLoading(false);
        });
      seterrorMessage('');
    }, 2000);
  };

  const loadingIcon = () => {
    return (
      <div className='three col'>
        {loading ? (
          <h2>Logging in</h2>
        ) : registering ? (
          <h2>Registering</h2>
        ) : loggingOut ? (
          <h2>Goodbye</h2>
        ) : null}
        <div className='loader' id='loader-3'></div>
      </div>
    );
  };

  return (
    <Switch>
      <>
        <div className='App'>
          {welcomeScreenLoading ? (
            <>{loadingIcon()}</>
          ) : loading ? (
            <>{loadingIcon()}</>
          ) : registering ? (
            <>{loadingIcon()}</>
          ) : !user ? (
            <>
              <Route exact path='/'>
                <LoginComponent
                  submitLogin={submitLogin}
                  inputUserName={inputUserName}
                  inputPassword={inputPassword}
                  registerUser={registerUser}
                  forgotPassword={forgotPassword}
                />
                {emailVerification ? (
                  <p style={{ color: 'red' }}>Email successfully sent</p>
                ) : null}
                {errorMessage ? (
                  <p style={{ color: 'red' }}>{errorMessage}</p>
                ) : null}
              </Route>
            </>
          ) : loggingOut ? (
            <>{loadingIcon()}</>
          ) : (
            <>
              <Route path='/messenger'>
                <div className='app-messenger-container'>
                  <Messenger
                    usersArray={usersArray}
                    userInfo={user}
                    messages={messages}
                    logout={logout}
                  />
                </div>
              </Route>
              <Route path='/profile'>
                <Mprofile
                  logout={logout}
                  userInfo={user}
                  usersArray={usersArray}
                  messages={messages}
                />
              </Route>
            </>
          )}
        </div>
      </>
    </Switch>
  );
}

export default App;
