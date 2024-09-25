import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import { useSubmitContext } from '../../context/submitContext.jsx';
import Alert from "../../component/Alert/Alert";
import styles from './Login.module.css';
import { login } from '../../api/firebase.js';

const INITIAL_FORM = {
  email: '',
  pw: '',
}

export default function Login() {
  const { setUser } = useUserContext();
  const [form, setForm] = useState(INITIAL_FORM);
  const [alert, setAlert] = useState('');
  const {isSubmitting, handleSubmitTrue, handleSubmitFalse} = useSubmitContext();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { id, value } = e.target;
    setForm({...form, [id]: value});
  }

  const handleLogin = (e) => {
    e.preventDefault();
    handleSubmitTrue();

    login(form, setUser)
    .then((isSuccess) => {
      if (isSuccess) {
        navigate('/');
      } else {
        setAlert('이메일 또는 비밀번호가 달라요!')
      }
      handleSubmitFalse();
    })
  }

  const handleAlert = () => {
    setAlert('');
  }
  
  return (
    <section className='column'>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputWrap}>
          <div>
            <label className={styles.label} htmlFor='email'>ID</label>
            <input className={styles.input} id='email' type='text' onChange={handleInput}
             value={form.email} placeholder='이메일' required />
          </div>
          <div>
            <label className={styles.label} htmlFor='pw'>PW</label>
            <input className={styles.input} id='pw' type='password' autoComplete="off"
             onChange={handleInput} value={form.pw} placeholder='비밀번호' required />
          </div>
        </div>
        <button className={styles.login} disabled={isSubmitting}>LOGIN{isSubmitting ? '...' : ''}</button>
      </form>
      <div className={styles.joinWrap}>
        <Link className={styles.join} to="/join">회원가입 하러가기</Link>
      </div>
      {
        alert && <Alert handleAlert={handleAlert} message={alert} />
      }
    </section>
  )
}