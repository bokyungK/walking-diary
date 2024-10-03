import React from 'react';
import styles from './Alert.module.css'
import { TfiClose } from "react-icons/tfi";

export default function Alert ({ message, handleAlert, isAlert }) {
  const isString = typeof message === 'string' ? true : false;

  return (
    <div onClick={handleAlert} className={styles.background}>
      <div className={`${styles.postIt} ${isAlert && styles.alert} ${isString ? '' : styles.notString}`}>
        <div></div>
        <div></div>
        {
          isString ?
            <>
              <div></div>
              <div>{message}</div>
              <div></div>
            </>
          : 
            <>
              <div>{message.title}</div>
              <div>ID: {message.id}</div>
              <div>PW: {message.pw}</div>
            </>
        }
        <div></div>
        <div></div>
        { 
          isString && <button onClick={handleAlert} className={styles.closeButton}>
            <TfiClose />
          </button>
        }
      </div>
    </div>
  )
}
