import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Buttons.module.css';
import { useSetRecoilState } from 'recoil';
import { locationState, opacityState } from '../../recoil/Atom';

export default function Buttons ({ buttonName, cancelLink, handleFormSubmit }) {
  const setCheckLocation = useSetRecoilState(locationState);
  const setBackgroundOpacity = useSetRecoilState(opacityState);

  return (
    <div className={styles.buttonWrap}>
      {/* cancel */}
      {
        cancelLink === '/detail-diary' ?
          <button className={styles.button} onClick={() => cancelLink === '/detail-diary' ?
              (
                  setCheckLocation(false),
                  setBackgroundOpacity(0)
              )
              : 
              ''}>
              <span>{buttonName.cancel}</span>
          </button>
          :
          <Link to={cancelLink.path}>
              <button className={styles.button} >
                  <span>{buttonName.cancel}</span>
              </button>
          </Link>
      }
      {/* submit */}
      <button className={styles.button} onClick={() => {
          window.scrollTo(0, 0);
          handleFormSubmit();
      }} type='button'>
          <span>{buttonName.submit}</span>
      </button>
    </div>
  )
}
