import React, { useState, useEffect } from 'react';
import './Channel.css';
import firebase from 'firebase/app';
import { db } from './firebase';

export default function Channel({
  channels,
  changeChannel,
  addChannel,
  inputNewChannel,
}) {
  const [channelInput, setChannelInput] = useState(null);

  const renderChannels = () => {
    return channels?.map((i, ind) => (
      <ul key={ind}>
        <button onClick={() => changeChannel(ind)}>
          <li>{i.channel}</li>
        </button>
      </ul>
    ));
  };
  return (
    <div className='channel'>
      <h1>Channel</h1>
      {renderChannels()}
      <input onChange={inputNewChannel}></input>
      <button onClick={addChannel}>Add Channell</button>
    </div>
  );
}
