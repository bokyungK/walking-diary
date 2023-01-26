import React, { useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import Notice from './Notice.js';

function Login({ notice, noticeIcon, display, changeNotice }) {
    const userId = useRef();
    const userPw = useRef();

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value
        }
        const condition = userInfo.userId === '' || userInfo.userPw === '';

        if (condition) {
            changeNotice('모든 정보를 입력하세요', 'warning.png', 'flex', 0);
        } else {
            axios.post('https://api.walking-diary-server.site/login', userInfo, { withCredentials: true })
            .then(res => {
                if (res.data === 'Success') {
                    localStorage.setItem('loginState', true);
                    changeNotice('로그인 성공', 'correct.png', 'flex', "/")
                    return;
                }
                if (res.data === 'Fail_id') {
                    changeNotice('ID가 존재하지 않습니다', 'warning.png', 'flex', 0)
                }
                if (res.data === 'Fail_pw') {
                    changeNotice('PW가 틀렸습니다', 'warning.png', 'flex', 0)
                }
            })
        }
    }
    return (
        <div className={styles.Login}>
            <Notice message={notice} icon={noticeIcon} display={display} />
            <form className={styles.loginForm} method='post'>
                <div className={styles.inputContainer}>
                    <div className={styles.inputBoxes}>
                        <label className={styles.label} htmlFor='userId'>ID</label>
                        <input ref={userId} className={styles.input} id='userId' type='text' />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor='userPw'>PW</label>
                        <input ref={userPw} className={styles.input} id='userPw' type='password' autoComplete="off" />
                    </div>
                </div>
                <button onClick={handleFormSubmit} className={styles.loginButton} type="button">LOGIN</button>
            </form>
            <button className={styles.joinButton} type='button'><Link to="/join">회원가입 하러가기</Link></button>
        </div>
    )
}

export default Login;