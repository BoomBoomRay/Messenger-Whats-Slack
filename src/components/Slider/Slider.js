import React from 'react';
import './Slider.css';

export default function Slider({ handleToggleDarkMode }) {
  return (
    <>
      <label className='switch'>
        <input onClick={handleToggleDarkMode} type='checkbox'></input>
        <span className='slider round'></span>
      </label>
    </>
  );
}
