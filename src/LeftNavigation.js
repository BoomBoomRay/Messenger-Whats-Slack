import React from 'react';
import './LeftNav.css';
import Channel from './Channel';

export default function LeftNavigation({
  channels,
  changeChannel,
  addChannel,
  inputNewChannel,
  createNewChannel,
}) {
  const renderChannels = () => {
    return channels?.map((i, ind) => (
      <ul key={ind}>
        <button onClick={() => changeChannel(ind)}>
          <li>{i.channelName}</li>
        </button>
      </ul>
    ));
  };
  return (
    <div className='leftNavContainer'>
      <h1>Chat Messenger</h1>
      <div className='channel__div'>
        <div className='channel'>
          <h1>Channel</h1>
          {renderChannels()}
          <input onChange={inputNewChannel}></input>
          <button onClick={createNewChannel}>Add Channell</button>
        </div>
      </div>
      <div className='directMessage__div'>
        <h1>Direct Message</h1>
      </div>
    </div>
  );
}
