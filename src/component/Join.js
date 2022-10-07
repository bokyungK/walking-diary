import React, { useState, useRef } from 'react';
import axios from 'axios';
import Buttons from './Buttons.js';
import styles from './Join.module.css';

function Join() {
    const [display, setDisplay] = React.useState('none');
    const buttonName = {
        cancel: '취소',
        submit: '가입'
    }
    const cancelLink = {
        path: '/login',
    }
    const userId = useRef();
    const userPw = useRef();
    const userName = useRef();
    const userPetName = useRef();

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value,
            userName: userName.current.value,
            userPetName: userPetName.current.value, 
        }
        
        const condition = userInfo.userId !== '' && userInfo.userPw !== '' && userInfo.userName !== '' && userInfo.userPetName !== '';
        if (condition) {
            axios.post('http://localhost:3001/join', userInfo)
            .then(res => {
                console.log(res);
            })
        } else {
            setDisplay('flex');
            return;
        }
    }

    return (
        <div className={styles.Join}>
            <h2 className={styles.infoTitle}>회원가입</h2>
            <div className={styles.notice} style={{ display: `${display}` }}>
                <img src='warning.png' alt='경고 느낌표'></img>
                <p>모든 정보를 입력하세요</p>
            </div>
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userId'>ID</label>
                        <input ref={userId} className={styles.itemInput} id='userId' type='text' />
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel} htmlFor='userPw'>PW</label>
                        <input ref={userPw} className={styles.itemInput} id='userPw' type='password' autocomplete="off" />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userName'>이름</label>
                        <input ref={userName} className={styles.itemInput} id='userName' type='text' />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userPetName'>반려견 이름</label>
                        <input ref={userPetName} className={styles.itemInput} id='userPetName' type='text' />
                    </div>
                </div>
                <Buttons buttonName={buttonName} cancelLink={cancelLink} handleFormSubmit={handleFormSubmit} disabled />
            </form>
        </div>
    )
}

export default Join;