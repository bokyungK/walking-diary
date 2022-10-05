import React from 'react';
import styles from './Buttons.module.css';
import { Link } from 'react-router-dom';

function Buttons ({ buttonName, cancelLink }) {
    return (
        <div className={styles.Buttons}>
            <Link to={cancelLink.path}>
                <button className={styles.button}>
                    <img src='button.png'/>
                    <div>{buttonName.cancel}</div>
                </button>
            </Link>
            <button className={styles.button} type='submit' >
                <img src='button.png'/>
                <div>{buttonName.submit}</div>
            </button>
        </div>
    )
}

export default Buttons;