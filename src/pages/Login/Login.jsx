import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Notice from '../../component/Notice.jsx';
import { useRecoilValue } from 'recoil';
import { apiUrlState } from '../../recoil/Atom.js';
import { login } from '../../api/firebase.js';
var store = require('store');

const INITIAL_FORM = {
  email: '',
  pw: '',
}

export default function Login({ changeNotice }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useState();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { id, value } = e.target;
    setForm({...form, [id]: value});
  }

  const handleLogin = () => {
    setIsLoading(true);

    login(form, setUser)
    .then((isSuccess) => {
      setIsLoading(false);

      if (isSuccess) return navigate('/');
      // 실패한 경우 알림 띄우기
    })
  }

    // const apiUrl = useRecoilValue(apiUrlState);
    // const userId = useRef();
    // const userPw = useRef();

    // async function handleFormSubmit() {
    //     const userInfo = {
    //         userId: userId.current.value,
    //         userPw: userPw.current.value
    //     }
    //     const condition = userInfo.userId === '' || userInfo.userPw === '';

    //     if (condition) {
    //         changeNotice('모든 정보를 입력하세요', 'warning.png', 'flex', 0);
    //         return;
    //     }

    //     try {
    //         const res = await axios.post(apiUrl + 'login', userInfo, { withCredentials: true });
    //         const data = await res.data;

    //         if (data === 'Success') {
    //             store.set('loginState', 'true');
    //             changeNotice('로그인 성공', 'correct.png', 'flex', "/");
    //             return;
    //         }

    //         if (data === 'Fail_id') {
    //             changeNotice('ID가 존재하지 않습니다', 'warning.png', 'flex', 0);
    //             return;
    //         }

    //         if (data === 'Fail_pw') {
    //             changeNotice('PW가 틀렸습니다', 'warning.png', 'flex', 0);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
  return (
    // <section className='column'>
    //     <Notice />
    //     <form className={styles.form} method='post'>
    //       <div>
    //         <div>
    //           <label className={styles.label} htmlFor='userId'>ID</label>
    //           <input  ref={userId} id='userId' type='text' />
    //         </div>
    //         <div>
    //           <label className={styles.label} htmlFor='userPw'>PW</label>
    //           <input ref={userPw} id='userPw' type='password' autoComplete="off" />
    //         </div>
    //       </div>
    //       <button className={styles.login} onClick={handleFormSubmit} type="submit">LOGIN</button>
    //     </form>
    //     <div className={styles.joinWrap}>
    //       <Link className={styles.join} to="/join">회원가입 하러가기</Link>
    //     </div>
    // </section>
  <section className='column'>
    <Notice />
    <form className={styles.form}>
      <div>
        <div>
          <label className={styles.label} htmlFor='email'>ID</label>
          <input id='email' type='text' onChange={handleInput} value={form.email} />
        </div>
        <div>
          <label className={styles.label} htmlFor='pw'>PW</label>
          <input id='pw' type='password' autoComplete="off" onChange={handleInput} value={form.pw}  />
        </div>
      </div>
      <button className={styles.login} onClick={handleLogin} type="submit" disabled={isLoading}>LOGIN</button>
    </form>
    <div className={styles.joinWrap}>
      <Link className={styles.join} to="/join">회원가입 하러가기</Link>
    </div>
  </section>
  )
}