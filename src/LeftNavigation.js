import React, { useState, useEffect } from 'react';
import './LeftNav.css';
import { db } from './firebase';
import ChannelModal from './ChannelModal';
import DMModal from './DirectMsgModal';
import { CSSTransition } from 'react-transition-group';

export default function LeftNavigation({ channels, changeChannel }) {
  const [open, setOpen] = useState(false);
  const [openDm, setOpenDm] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);

  useEffect(() => {
    db.collection('directMessages').onSnapshot((res) =>
      setDirectMessages(res.docs.map((doc) => doc.data()))
    );
  }, []);

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
  const renderDms = () => {
    return directMessages?.map((i, _) => {
      return (
        <ul>
          <li>{i.user}</li>
        </ul>
      );
    });
  };
  const toggleDropdownDM = (e) => {
    setOpenDm(!openDm);
  };
  return (
    <div className='leftNavContainer'>
      <h1>Chat Messenger</h1>
      <ChannelModal open={open} toggleDropdownChannel={toggleDropdownChannel} />
      <CSSTransition
        in={open}
        unmountOnExit
        timeout={500}
        classNames='channel__div__transition'
      >
        <div className='channel__div'>{open && renderChannels()}</div>
      </CSSTransition>
      <DMModal openDm={openDm} toggleDropdownDM={toggleDropdownDM} />
      <CSSTransition
        in={openDm}
        unmountOnExit
        timeout={500}
        classNames='channel__div__transition'
      >
        <div className='channel__div'>{openDm && renderDms()}</div>
      </CSSTransition>
    </div>
  );
}
