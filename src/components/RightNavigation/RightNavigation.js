import React from 'react';
import './LeftNav.css';
import { useHistory } from 'react-router-dom';

export default function RightNavigation() {
  const history = useHistory();
  const goToProfile = () => {
    history.push('/profile');
  };
  return (
    <div className='leftNavContainer'>
      <h1>Right Nav</h1>
      <button onClick={goToProfile}>Profile</button>
    </div>
  );
}
