import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Join.module.css';
import Button from '../../component/Button/Button';
import Notice from '../../component/Notice.jsx';
import { join, saveUser } from '../../api/firebase.js';
import { useUserContext } from '../../context/userContext.jsx';

const INITIAL_FORM = {
  email: '',
  pw: '',
  dogName: '',
}

export default function Join() {
  const [form, setForm] = useState(INITIAL_FORM);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { id, value } = e.target;
    setForm({...form, [id]: value});
  }

  const handleJoin = (e) => {
    e.preventDefault();
    
    join(form, setUser)
    .then((uid) => {
      saveUser(uid, form.dogName)
      .then(() => navigate('/'))
    });
  }

  // 아이디가 이메일이 아닌 경우
  // 이미 존재하는 아이디인 경우
  // 비밀번호가 규칙에 어긋나는 경우
  
  return (
    <section className='column'>
      <h2>회원가입</h2>
      <Notice />
      <form className={styles.form} onSubmit={handleJoin}>
        <div className={styles.inputWrap}>
          <div>
            <label className={styles.label} htmlFor='email'>이메일</label>
            <input className={styles.input} id='email' type='text'
              onChange={handleInput} value={form.email} placeholder='이메일' required />
          </div>
          <div>                       
            <label className={styles.label} htmlFor='pw'>비밀번호</label>
            <input className={styles.input} id='pw' type='password' autoComplete="off"
              maxLength='15' onChange={handleInput} value={form.pw} placeholder='비밀번호'
              required />
          </div>
          <div>
            <label className={styles.label} htmlFor='dogName'>반려견</label>
            <input className={styles.input} id='dogName' type='text' maxLength='10'
              onChange={handleInput} value={form.dogName} placeholder='반려견 이름' required />
          </div>
        </div>
        <div className='buttonWrap'>
          <Button destination='/login' name='취소' />
          <Button isButton name='가입' />
        </div>
      </form>
    </section>
  )
}
