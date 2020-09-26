import React, { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('body');
export default function PopUpModal({ inputNewChannel, createNewChannel }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <button onClick={handleOpenModal}>Trigger Modal</button>
      <Modal
        isOpen={showModal}
        contentLabel='onRequestClose Example'
        onRequestClose={handleCloseModal}
      >
        <p>Modal text!</p>
        <input onChange={inputNewChannel}></input>
        <button onClick={createNewChannel}>Add Channel</button>
      </Modal>
    </div>
  );
}
