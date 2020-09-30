import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from './firebase';
import firebase from 'firebase/app';
import AddIcon from '@material-ui/icons/Add';
import './PopupModal.css';
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
export default function PopUpModal({ toggleDropdownDM, openDm }) {
  const [showModal, setShowModal] = useState(true);
  const [usersOnline, setUsersOnline] = useState([]);
  const [, dispatch] = useStateValue();

  useEffect(() => {
    db.collection('users').onSnapshot((res) => {
      setUsersOnline(res.docs.map((doc) => doc.data()));
    });
  }, []);

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
    db.collection('directMessages').doc(email).set({
      timestamp: firebase.firestore.Timestamp.now(),
      user: email,
    });
    dispatch({
      type: 'SELECT_CHANNEL',
      user: { user: email, channel: 'directMessages' },
    });
  };
  const renderUsers = () => {
    return usersOnline?.map((i, _) => {
      return (
        <ul key={_}>
          <button onClick={() => selectedUser(i.email)}>
            <li>{i.email}</li>
          </button>
        </ul>
      );
    });
  };

  return (
    <div className='channel'>
      <div className='channel__title__div'>
        <ArrowRightIcon
          className={openDm ? 'addIcon' : 'closeIcon'}
          onClick={toggleDropdownDM}
        />
        <h2 onClick={toggleDropdownDM}>Direct Message</h2>
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
