import React, { useState } from 'react';
import Modal from 'react-modal';
import { db } from '../../utils/firebase';
import firebase from 'firebase/app';
import AddIcon from '@material-ui/icons/Add';
import './PopupModal.css';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useStateValue } from '../../utils/StateProvider';

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
  },
};

Modal.setAppElement('body');
export default function PopUpModal({ toggleDropdownChannel, open }) {
  const [showModal, setShowModal] = useState(false);
  const [inputNameChannel, setInputNameForChannel] = useState('');
  const [, dispatch] = useStateValue();

  const inputNewChannel = (e) => {
    setInputNameForChannel(e.target.value);
  };
  const createNewChannel = (e) => {
    e.preventDefault();
    db.collection('channels').doc(inputNameChannel).set({
      timestamp: firebase.firestore.Timestamp.now(),
      channelName: inputNameChannel,
      channel: true,
    });
    dispatch({
      type: 'NEW_CREATED_CHANNEL',
      nameOfChannel: inputNameChannel,
    });
    dispatch({
      type: 'SELECT_CHANNEL',
      user: inputNameChannel,
    });
    handleCloseModal();
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className='channel'>
      <div className='channel__title__div'>
        <ArrowRightIcon
          className={open ? 'addIcon' : 'closeIcon'}
          onClick={toggleDropdownChannel}
        />
        <h3 onClick={toggleDropdownChannel}>Channels</h3>
      </div>
      <button className='add-button' onClick={handleOpenModal}>
        <AddIcon />
      </button>
      <Modal
        style={customStyles}
        isOpen={showModal}
        onRequestClose={handleCloseModal}
      >
        <p className='modal__font'>Input Channel</p>

        <form>
          <input onChange={inputNewChannel}></input>
          <button
            disabled={
              inputNameChannel && inputNameChannel.length >= 3 ? false : true
            }
            onClick={createNewChannel}
          >
            Add
          </button>
        </form>
      </Modal>
    </div>
  );
}
