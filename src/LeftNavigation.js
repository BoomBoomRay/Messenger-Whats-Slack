import React, { useState } from 'react';
import './LeftNav.css';
import Modal from './PopUpModal';
import { CSSTransition } from 'react-transition-group';

export default function LeftNavigation({ channels, changeChannel }) {
  const [open, setOpen] = useState(false);

  const renderChannels = () => {
    return channels?.map((i, ind) => (
      <ul key={ind}>
        <button onClick={() => changeChannel(ind)}>
          <li># {i.channelName}</li>
        </button>
      </ul>
    ));
  };
  const toggleDropdownChannel = (e) => {
    setOpen(!open);
  };
  return (
    <div className='leftNavContainer'>
      <h1>Chat Messenger</h1>
      <Modal open={open} toggleDropdownChannel={toggleDropdownChannel} />
      <CSSTransition
        in={open}
        unmountOnExit
        timeout={500}
        classNames='channel__div__transition'
      >
        <div className='channel__div'>{open && renderChannels()}</div>
      </CSSTransition>
      <div className='directMessage__div'>
        <h2>Direct Message</h2>
      </div>
    </div>
  );
}
