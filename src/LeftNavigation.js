import React, { useState, useEffect } from 'react';
import './LeftNav.css';
import { db } from './firebase';
import ChannelModal from './ChannelModal';
import DMModal from './DirectMsgModal';
import { CSSTransition } from 'react-transition-group';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { useStateValue } from './StateProvider';

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
  const [, dispatch] = useStateValue();

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
        key={ind}
        className={
          i.channelName === selectedChannel ? 'channel__div__container_' : null
        }
      >
        <ul className='channel__list__ul'>
          <button onClick={() => changeChannel(ind, true, i.sentBy)}>
            <li>#{i.channelName}</li>
          </button>
          {i.sentBy === userInfo.email ? null : selectedChannel !==
              i.channelName && i.recieverHasRead === false ? (
            <NotificationsNoneIcon
              onClick={() => changeChannel(ind, true, i.sentBy)}
              className='notification__bell'
            />
          ) : null}
        </ul>
      </div>
    ));
  };
  const toggleDropdownChannel = (e) => {
    setOpen(!open);
  };

  const deleteDM = (dmRecipient, messages, user) => {
    dispatch({
      type: 'DIRECT_MESSAGE_SELECT',
      email: '',
    });
    dispatch({
      type: 'NEW_CREATED_CHANNEL',
      nameOfChannel: '',
      deleted: true,
    });

    deleteNoInputUser(dmRecipient, messages, user);

    db.collection(userInfo.email)
      .doc(dmRecipient)
      .delete()
      .then(() => {
        console.log('SUCCESFULLY DELETED');
      })
      .catch((error) => {
        console.log('ERROR WITH DELETING Direct Message');
      });
  };

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
            <div className='dmList_icons_div'>
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
                      <NotificationsNoneIcon
                        onClick={() => selectedSpecificDM(i.dmRecipient, true)}
                        className='notification__bell'
                      />
                    ) : null
                  ) : null
                ) : null
              ) : null}
            </div>
            <button
              className='dm_delete_btn'
              onClick={() => deleteDM(i.dmRecipient, i.messages, i.user)}
            >
              x
            </button>
          </ul>
        </div>
      );
    });
  };
  const deleteNoInputUser = (recipient, array, user) => {
    if (array.length <= 0) {
      db.collection(recipient)
        .doc(user)
        .delete()
        .then(() => console.log('deleted'))
        .catch((error) => console.log(error));
    }
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
      <div className='channelsList__container'>
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
          <div className='directMsg__div'>{openDm && renderDms()} </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default LeftNavigation;
