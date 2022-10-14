import React, { useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import Notice from "./Notice";

function Login({ history }) {
    const userId = useRef();
    const userPw = useRef();
    const [notice, setNotice] = React.useState('');
    const [noticeIcon, setNoticeIcon] = React.useState('warning.png');
    const [display, setDisplay] = React.useState('none');

    function changeNotice(notice, icon, display, path) {
        setNotice(notice);
        setNoticeIcon(icon);
        setDisplay(display);
        
        if (path) {
            setTimeout(() => {
                history.push(path);
            }, 1000);
            return;
        }

        if (path === 0) {
            setTimeout(() => {
                history.go(path);
            }, 1000);
        }
    }

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value
        }
        const condition = userInfo.userId === '' || userInfo.userPw === '';

        if (condition) {
            setNotice('모든 정보를 입력하세요');
            setDisplay('flex');
        } else {
            axios.post('http://localhost:3001/login', userInfo, { withCredentials: true })
            .then(res => {
                if (res.data === 'Success') {
                    localStorage.setItem('loginState', true);
                    changeNotice('로그인 성공', 'correct.png', 'flex', "/")
                    return;
                }
                if (res.data === 'Fail_id') {
                    changeNotice('ID가 존재하지 않습니다', 'warning.png', 'flex', false)
                }
                if (res.data === 'Fail_pw') {
                    changeNotice('PW가 틀렸습니다', 'warning.png', 'flex', false)
                }
            })
        }
    }
    return (
        <div className={styles.Login}>
            <Notice notice={notice} noticeIcon={noticeIcon} display={display} />
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