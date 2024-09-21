import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Buttons.module.css';
import { useSetRecoilState } from 'recoil';
import { locationState, opacityState } from '../../recoil/Atom';

export default function Buttons ({ buttonName, cancelLink, handleJoin, handleAdd }) {
  const setCheckLocation = useSetRecoilState(locationState);
  const setBackgroundOpacity = useSetRecoilState(opacityState);
  const handleFormSubmit = (e, id) => {
    if (handleJoin) {
      window.scrollTo(0, 0);
      handleJoin();
    } else if (handleAdd) {
      e.preventDefault();
      handleAdd(id);
    }
  }

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
          <button className={styles.button}>
            <Link to={cancelLink.path}>{buttonName.cancel}</Link>
          </button>
      }
      {/* submit */}
      <button className={styles.button} onClick={handleFormSubmit} type='submit'>{buttonName.submit}</button>
    </div>
  )
}
