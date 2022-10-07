import React from 'react';
import styles from './Buttons.module.css';
import { Link } from 'react-router-dom';

function Buttons ({ buttonName, cancelLink, handleFormSubmit }) {
    return (
        <div className={styles.Buttons}>
            <Link to={cancelLink.path}>
                <button className={styles.button}>
                    <img src='button.png' alt='강아지 발자국 모양 버튼'/>
                    <div>{buttonName.cancel}</div>
                </button>
            </Link>
            <button onClick={handleFormSubmit} className={styles.button} type='button'>
                <img src='button.png' alt='강아지 발자국 모양 버튼' />
                <div>{buttonName.submit}</div>
            </button>
        </div>
    )
}

export default Buttons;