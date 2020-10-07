import React, { useState, useEffect } from 'react';
import './LeftNav.css';
import { db } from './firebase';
import ChannelModal from './ChannelModal';
import DMModal from './DirectMsgModal';
import { CSSTransition } from 'react-transition-group';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
export const LeftNavigation = ({
  userInfo,
  channels,
  changeChannel,
  selectDM,
  selectedChannel,
}) => {
  const [open, setOpen] = useState(true);
  const [openDm, setOpenDm] = useState(true);
  const [directMessages, setDirectMessages] = useState([]);
  const [directMessageStatus, setDirectMessageStatus] = useState(false);
  const fromUserWhoSentMsg =
    directMessages.messages === undefined
      ? directMessages.messages
      : directMessages[0]?.messages[directMessages[0]?.messages?.length - 1]
          .email;

  useEffect(() => {
    db.collection(userInfo.email).onSnapshot((res) =>
      setDirectMessages(res.docs.map((i) => (i.data() ? i.data() : [])))
    );
    db.collection(userInfo.email)
      .where('user', '==', userInfo.email)
      .onSnapshot((res) =>
        res.docs.map((doc) => {
          const data = doc.data();
          setDirectMessageStatus(
            selectedChannel === fromUserWhoSentMsg ? true : false
          );
        })
      );
  }, [
    userInfo.email,
    setDirectMessageStatus,
    fromUserWhoSentMsg,
    selectedChannel,
  ]);
  const renderChannels = () => {
    const sortedChannels = channels?.sort((a, b) => a.timestamp - b.timestamp);
    return sortedChannels?.map((i, ind) => (
      <div
        className={
          i.channelName === selectedChannel ? 'channel__div__container_' : null
        }
      >
        <ul className='channel__list__ul' key={ind}>
          <button onClick={() => changeChannel(ind, true, i.sentBy)}>
            <li>#{i.channelName}</li>
          </button>
          {i.sentBy === userInfo.email ? null : selectedChannel !==
              i.channelName && i.recieverHasRead === false ? (
            <NotificationsNoneIcon className='notification__bell' />
          ) : null}
        </ul>
      </div>
    ));
  };
  const toggleDropdownChannel = (e) => {
    setOpen(!open);
  };

  // const deleteDM = (user) => {
  //   db.collection(userInfo.email)
  //     .doc(user)
  //     .delete()
  //     .then(() => {
  //       console.log('SUCCESFULLY DELETED');
  //     })
  //     .catch((error) => {
  //       console.log('ERROR WITH DELETING Direct Message');
  //     });

  //   console.log('firee', user);
  // };

  console.log(directMessages);
  const renderDms = () => {
    const fromUserWhoSentMsg =
      directMessages[0]?.messages.length <= 0
        ? directMessages[0]
        : directMessages[0]?.messages[directMessages[0].messages.length - 1]
            .email;
    return directMessages?.map((i, _) => {
      return (
        <div
          key={_}
          className={
            i.dmRecipient === selectedChannel ? 'dmList__container_' : null
          }
        >
          <ul className='dmList__ul'>
            {i.createdBy === userInfo.email ? (
              <button onClick={() => selectedSpecificDM(i.dmRecipient, true)}>
                <li>{i.dmRecipient}</li>
              </button>
            ) : i.list === true ? (
              <button onClick={() => selectedSpecificDM(i.dmRecipient, true)}>
                <li>{i.dmRecipient}</li>
              </button>
            ) : null}
            {i.list === true ? (
              userInfo.email !== fromUserWhoSentMsg ? (
                !directMessageStatus ? (
                  !i.recieverHasRead ? (
                    <NotificationsNoneIcon className='notification__bell' />
                  ) : null
                ) : null
              ) : null
            ) : null}
          </ul>
          {/* <button onClick={() => deleteDM(i.dmRecipient)}>x</button> */}
        </div>
      );
    });
  };

  const selectedSpecificDM = (dmRecipient, boolean) => {
    selectDM(dmRecipient);
    setDirectMessageStatus(boolean);
    db.collection(userInfo.email).doc(dmRecipient).update({
      recieverHasRead: boolean,
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
        <div className='directMsg__div'>{openDm && renderDms()} </div>
      </CSSTransition>
    </div>
  );
};

export default LeftNavigation;
