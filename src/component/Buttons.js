import React from 'react';
import styles from './Buttons.module.css';

function Buttons ({ buttonName }) {
    return (
        <div className={styles.Buttons}>
            <button className={styles.button}>
                <img src='button.png'/>
                <div>{buttonName.cancel}</div>
            </button>
            <button className={styles.button} type='submit' >
                <img src='button.png'/>
                <div>{buttonName.submit}</div>
            </button>
        </div>
    )
}

export default Buttons;