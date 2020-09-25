import React from 'react';
import './LeftNav.css';
import Channel from './Channel';

export default function LeftNavigation({
  channels,
  changeChannel,
  addChannel,
  inputNewChannel,
}) {
  return (
    <div className='leftNavContainer'>
      <h1>Chat Messenger</h1>
      <div className='channel__div'>
        <Channel
          channels={channels}
          changeChannel={changeChannel}
          addChannel={addChannel}
          inputNewChannel={inputNewChannel}
        />
      </div>
      <div className='directMessage__div'>
        <h1>Direct Message</h1>
      </div>
    </div>
  );
}
