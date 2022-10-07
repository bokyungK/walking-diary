import React, { useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const userId = useRef();
    const userPw = useRef();
    const [display, setDisplay] = React.useState('none');

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value
        }

        const condition = userInfo.userId !== '' && userInfo.userPw !== '';
        if (condition) {
            axios.post('http://localhost:3001/login', userInfo)
            .then(res => {
                console.log(res);
            })
        } else {
            setDisplay('flex');
            return;
        }
    }

    return (
        <div className={styles.Login}>
            <div className={styles.notice} style={{ display: `${display}` }}>
                <img src='warning.png' alt='경고 느낌표'></img>
                <p>모든 정보를 입력하세요</p>
            </div>
            <form className={styles.loginForm} method='post'>
                <div className={styles.inputContainer}>
                    <div className={styles.inputBoxes}>
                        <label className={styles.label} htmlFor='userId'>ID</label>
                        <input ref={userId} className={styles.input} id='userId' type='text' />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor='userPw'>PW</label>
                        <input ref={userPw} className={styles.input} id='userPw' type='password' autocomplete="off" />
                    </div>
                </div>
                <button onClick={handleFormSubmit} className={styles.loginButton} type="button">LOGIN</button>
            </form>
            <button className={styles.joinButton} type='button'><Link to="/join">회원가입 하러가기</Link></button>
        </div>
    )
}

export default Login;