import React from 'react';
import styles from './Alert.module.css'
import { TfiClose } from "react-icons/tfi";
import { useAlertContext } from '../../context/alertContext';

export default function Alert () {
  const { alert, handleAlert } = useAlertContext();

  return (
    <div className={styles.background}>
      <div className={styles.postIt}>
        {
          typeof alert === 'string' ?
            <div>{alert}</div>
          : 
            <>
              <div className={styles.account}>{alert.title}</div>
              <div className={styles.account}>ID: {alert.id}</div>
              <div className={styles.account}>PW: {alert.pw}</div>
            </>
        }
        <button onClick={() => handleAlert('')} className={styles.closeButton}>
          <TfiClose />
        </button>
      </div>
    </div>
  )
}
