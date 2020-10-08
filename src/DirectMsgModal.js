import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from './firebase';
import firebase from 'firebase/app';
import AddIcon from '@material-ui/icons/Add';
import './DirectMsgModal.css';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useStateValue } from './StateProvider';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: '#3f51b5',
    height: '400px',
    width: '400px',
  },
};

Modal.setAppElement('body');
export default function PopUpModal({ userInfo, toggleDropdownDM, openDm }) {
  const [showModal, setShowModal] = useState(false);
  const [usersOnline, setUsersOnline] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [, dispatch] = useStateValue();

  useEffect(() => {
    db.collection('users').onSnapshot((res) => {
      setUsersOnline(res.docs.map((doc) => doc.data()));
    });
    db.collection(userInfo.email).onSnapshot((res) =>
      setDirectMessages(res.docs.map((i) => i.data()))
    );
  }, [userInfo.email]);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const selectedUser = (email) => {
    handleCloseModal();
    createNewDm(email);
  };
  const createNewDm = (email) => {
    db.collection(userInfo.email).doc(email).set({
      timestamp: firebase.firestore.Timestamp.now(),
      dmRecipient: email,
      user: userInfo.email,
      directMessage: true,
      recieverHasRead: false,
      createdBy: userInfo.email,
      list: false,
      messages: [],
    });
    db.collection(email).doc(userInfo.email).set({
      timestamp: firebase.firestore.Timestamp.now(),
      dmRecipient: userInfo.email,
      user: email,
      directMessage: true,
      recieverHasRead: false,
      createdBy: userInfo.email,
      list: false,
      messages: [],
    });
    dispatch({
      type: 'NEW_CREATED_CHANNEL',
      nameOfChannel: email,
    });
    dispatch({
      type: 'DIRECT_MESSAGE_SELECT',
      email: email,
    });
  };
  const renderUsers = () => {
    const filteredUsers = usersOnline
      .filter((i) => i.email !== userInfo.email)
      .map((i) => i.email);

    const existingDm = directMessages?.map((i) => i.dmRecipient);
    const nonExistingUsersinDm = filteredUsers.filter(
      (i) => !existingDm.includes(i)
    );
    return nonExistingUsersinDm?.map((i, _) => {
      return (
        <ul key={_}>
          <button onClick={() => selectedUser(i)}>
            <li>{i}</li>
          </button>
        </ul>
      );
    });
  };

  return (
    <div className='directMsg'>
      <div className='directMsg__title__div'>
        <ArrowRightIcon
          className={openDm ? 'addIcon' : 'closeIcon'}
          onClick={toggleDropdownDM}
        />
        <h3 onClick={toggleDropdownDM}>Direct Message</h3>
      </div>
      <button className='add-button' onClick={handleOpenModal}>
        <AddIcon />
      </button>
      <Modal
        style={customStyles}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
      >
        <p className='modal__font'>Select User :</p>
        {renderUsers()}
      </Modal>
    </div>
  );
}
