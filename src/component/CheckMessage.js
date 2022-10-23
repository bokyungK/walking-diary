import React from 'react';
import styles from './CheckMessage.module.css';

function CheckMessage ({ checkMessage, setCheckMessage, handleShowMessage, option }) {
    return (
        <div className={styles.CheckMessage} style={checkMessage}>
            <div>
                <p>정말 {option.submit}하시겠습니까?</p>
                <div>
                    <button onClick={() => {
                        setCheckMessage({ display: 'none' });
                    }} type='button'>{option.cancel}</button>
                    <button onClick={handleShowMessage} type='button'>{option.submit}</button>
                </div>
            </div>
        </div>
    )
}

export default CheckMessage;