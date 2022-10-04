import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    return (
        <div className={styles.Login}>
            <form className={styles.loginForm} method='post'>
                <div className={styles.inputContainer}>
                    <div className={styles.inputBoxes}>
                        <label className={styles.label} for="login-id">ID</label>
                        <input className={styles.input} type='text' id='login-id'/>
                    </div>
                    <div>
                        <label className={styles.label} for="login-pw">PW</label>
                        <input className={styles.input} type='text' id="login-pw" />
                    </div>
                </div>
                <button className={styles.loginButton} type="submit">LOGIN</button>
            </form>
            <button className={styles.joinButton} type='button'><Link to="/join">회원가입 하러가기</Link></button>
        </div>
    )
}

export default Login;