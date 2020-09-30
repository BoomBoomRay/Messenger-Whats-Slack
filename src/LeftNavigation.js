import React, { useState, useEffect } from 'react';
import './LeftNav.css';
import { db } from './firebase';
import ChannelModal from './ChannelModal';
import DMModal from './DirectMsgModal';
import { CSSTransition } from 'react-transition-group';
import { useStateValue } from './StateProvider';

export default function LeftNavigation({
  userInfo,
  channels,
  changeChannel,
  selectDM,
}) {
  const [open, setOpen] = useState(false);
  const [openDm, setOpenDm] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);
  const [, dispatch] = useStateValue();

  useEffect(() => {
    db.collection('channels')
      .where('directMessage', '==', true)
      .onSnapshot((res) =>
        setDirectMessages(res.docs.map((doc) => doc.data()))
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

  const renderDms = () => {
    const loggedInUserDm = directMessages.filter(
      (i) => i.user || i.dmRecipient === userInfo.email
    );
    return loggedInUserDm?.map((i, _) => {
      return (
        <ul key={_}>
          <button onClick={() => selectDM(i.user)}>
            <li>
              {userInfo.email === i.dmRecipient
                ? i.user
                : userInfo.email === i.user
                ? i.dmRecipient
                : i.user && i.dmRecipient !== userInfo.email
                ? null
                : null}
            </li>
          </button>
        </ul>
      );
    });
  };
  const toggleDropdownDM = (e) => {
    setOpenDm(!openDm);
  };
  console.log(userInfo);
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
