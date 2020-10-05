import React, { useState, useEffect } from 'react';
import './LeftNav.css';
import { db } from './firebase';
import ChannelModal from './ChannelModal';
import DMModal from './DirectMsgModal';
import { CSSTransition } from 'react-transition-group';

export const LeftNavigation = React.memo(
  ({
    userInfo,
    channels,
    changeChannel,
    selectDM,
    selectedChannel,
    messages,
  }) => {
    const [open, setOpen] = useState(true);
    const [openDm, setOpenDm] = useState(true);
    const [directMessages, setDirectMessages] = useState([]);
    const [directMessageStatus, setDirectMessageStatus] = useState(false);
    const fromUserWhoSentMsg = directMessages[0]?.messages
      ? directMessages[0]?.messages[directMessages[0].messages.length - 1].email
      : directMessages[0];
    useEffect(() => {
      db.collection(userInfo.email).onSnapshot((res) =>
        setDirectMessages(res.docs.map((i) => i.data()))
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
    }, [userInfo.email, setDirectMessageStatus, fromUserWhoSentMsg]);
    const renderChannels = () => {
      const sortedChannels = channels?.sort(
        (a, b) => a.timestamp - b.timestamp
      );
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

    const deleteDM = (user) => {
      db.collection(userInfo.email)
        .doc(user)
        .delete()
        .then(() => {
          console.log('SUCCESFULLY DELETED');
        })
        .catch((error) => {
          console.log('ERROR WITH DELETING Direct Message');
        });

      console.log('firee', user);
    };

    const renderDms = () => {
      const fromUserWhoSentMsg = directMessages[0]?.messages
        ? directMessages[0]?.messages[directMessages[0].messages.length - 1]
            .email
        : directMessages[0];
      return directMessages?.map((i, _) => {
        return (
          <div key={_} className='dmList__div'>
            <ul>
              {directMessages[0]?.messages ? (
                userInfo.email !== fromUserWhoSentMsg ? (
                  !directMessageStatus ? (
                    !i.recieverHasRead ? (
                      <li>hey</li>
                    ) : null
                  ) : null
                ) : null
              ) : null}
              <button onClick={() => selectedSpecificDM(i.dmRecipient, true)}>
                <li>{i.dmRecipient}</li>
              </button>
            </ul>
            <button onClick={() => deleteDM(i.dmRecipient)}>x</button>
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

    const checkMsgNotificaiton = () => {
      const fromUserWhoSentMsg = directMessages[0]?.messages
        ? directMessages[0]?.messages[directMessages[0].messages.length - 1]
            .email
        : directMessages[0];
      if (selectedChannel !== fromUserWhoSentMsg) {
        setDirectMessageStatus(true);
      }
    };

    return (
      <div className='leftNavContainer'>
        <h1>Chat Messenger</h1>
        <ChannelModal
          open={open}
          toggleDropdownChannel={toggleDropdownChannel}
        />
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
  // (prevProps, nextProps) => {
  //   console.log('prevProps', prevProps);
  //   console.log('NEXT props', nextProps);
  //   if (
  //     nextProps?.selectedChannel ===
  //     nextProps?.messages[nextProps.messages.length - 1].channelName
  //   ) {
  //     setDirectMessageStatus(true);
  //   }
  // }
);

export default LeftNavigation;
