import React, { useState, useEffect } from 'react';
import './LeftNav.css';
import { db } from './firebase';
import ChannelModal from './ChannelModal';
import DMModal from './DirectMsgModal';
import { CSSTransition } from 'react-transition-group';

export default function LeftNavigation({
  userInfo,
  channels,
  changeChannel,
  selectDM,
}) {
  const [open, setOpen] = useState(false);
  const [openDm, setOpenDm] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);

  useEffect(() => {
    db.collection(userInfo.email).onSnapshot((res) =>
      setDirectMessages(res.docs.map((i) => i.data()))
    );
  }, []);

  const renderChannels = () => {
    const sortedChannels = channels?.sort((a, b) => a.timestamp - b.timestamp);
    return sortedChannels?.map((i, ind) => (
      <ul key={ind}>
        <button onClick={() => changeChannel(ind)}>
          <li>#{i.channelName}</li>
        </button>
      </ul>
    ));
  };
  const toggleDropdownChannel = (e) => {
    setOpen(!open);
  };

  const deleteDM = () => {
    console.log('fire');
  };

  const renderDms = () => {
    return directMessages?.map((i, _) => {
      return (
        <div className='dmList__div'>
          <ul key={_}>
            <button onClick={() => selectDM(i.dmRecipient)}>
              <li>{i.dmRecipient}</li>
            </button>
          </ul>
          <button onClick={deleteDM}>x</button>
        </div>
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
      <DMModal
        userInfo={userInfo}
        openDm={openDm}
        toggleDropdownDM={toggleDropdownDM}
      />
      <CSSTransition
        in={openDm}
        unmountOnExit
        timeout={500}
        classNames='directMsg__div__transition'
      >
        <div className='directMsg__div'>{openDm && renderDms()}</div>
      </CSSTransition>
    </div>
  );
}
