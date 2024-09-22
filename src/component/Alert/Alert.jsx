import React from 'react';
import styles from './Alert.module.css'
import { TfiClose } from "react-icons/tfi";

export default function Alert ({ message, handleAlert, isAlert }) {
  return (
    <div onClick={handleAlert} className={styles.background}>
      <div className={`${styles.postIt} ${isAlert && styles.alert}`}>
        <div></div>
        <div></div>
        <div></div>
        <div>{message}</div>
        <div></div>
        <div></div>
        <div></div>
        <button onClick={handleAlert} className={styles.closeButton}>
          <TfiClose />
        </button>
      </div>
    </div>
  )
}
