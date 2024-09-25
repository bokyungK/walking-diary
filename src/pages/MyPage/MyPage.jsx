import React, { useEffect, useState } from "react";
import Button from "../../component/Button/Button"
import styles from './MyPage.module.css';
import Alert from "../../component/Alert/Alert";
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../../context/userContext';
import { deleteUserAndDiaries, getDogName, reAuthUser, saveUser, updateUserPw, withdrawalUser } from "../../api/firebase.js";
import { useNavigate } from "react-router-dom";

const INITIAL_MYPAGE = {
  dogName: '',
  pw: '',
  newPw: '',
}

export default function Mypage() {
    const { user, setUser } = useUserContext();
    const [mypage, setMypage] = useState(INITIAL_MYPAGE);
    const [isError, setIsError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState();
    const [isAlert, setIsAlert] = useState('');
    const navigate = useNavigate();
    const { data: dogName, isSuccess } = useQuery({
      queryKey: ['dogName', user && user.uid],
      queryFn: () => getDogName(user.uid),
      enabled: Boolean(user && user.uid),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
    })

    useEffect(() => {
      if (isSuccess) {
        setMypage((prev) => {
          return {...prev, dogName: dogName}
        })
      }
    }, [dogName, isSuccess])

    const handleInput = (e) => {
      const { name, value} = e.target;

      setMypage((prev) => {
        return {...prev, [name]: value}
      })
    }

    const handleWithdrawal = () => {
      withdrawalUser(mypage.pw)
      .then((code) => {
        if (code === 400) {
          setIsError('비밀번호가 틀려요!');
        }
        
        if (code === 200) {
          deleteUserAndDiaries(user.uid)
          .then(() => {
            setUser(null);
            navigate('/login');
          })
        }
      })
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      const { id } = e.nativeEvent.submitter;

      // withdrawal
      if (id === 'withdrawal') {
        handleWithdrawal();
        return;
      }

      // save 
      if (mypage.newPw !== '') {
        // change password
        updateUserPw(mypage.pw, mypage.newPw)
        .then((res) => {
          if (res) setIsAlert('비밀번호를 바꿨어요!');
          else if (res === 401) setIsError('비밀번호가 틀려요!');
          else setIsError('비밀번호는 6글자 이상!');
        })
      }
      
      if (mypage.dogName !== dogName) {
        // change dog name
        reAuthUser(mypage.pw)
        .then((res) => {
          if (res) {
            saveUser(user.uid, mypage.dogName)
            .then(() => setIsAlert('반려견 이름을 바꿨어요!'))
          } else {
            setIsError('비밀번호가 틀려요!');
          }
        })
      }

      if (id === 'withdrawal' && mypage.dogName !== dogName) {
        setIsError('변경할 정보를 입력해요!');
      }
    }

    const handleAlert = () => {
      setIsError('');
      setIsAlert('');
    }

  return (
    <section className={`${styles.section} column`}>
      <h2>마이페이지</h2>
      {
        user && 
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <div>                       
              <label className={styles.label}>아이디</label>
              <textarea className={styles.input} type='text' disabled defaultValue={user.email}></textarea>
            </div>
            <div>
              <label className={styles.label} htmlFor='pw'>비밀번호</label>
              <input className={styles.input} type='password' name='pw' autoComplete="off" maxLength='15'
               placeholder='현재 비밀번호' value={mypage.pw} onChange={handleInput} required />
            </div>
            <div>
              <label className={styles.label} htmlFor='newPw'>새 비밀번호</label>
              <input className={styles.input} type='password' name='newPw' autoComplete="off" maxLength='15'
               placeholder='바꿀 비밀번호' value={mypage.newPw} onChange={handleInput} />
            </div>
            <div>
              <label className={styles.label} htmlFor='dogName'>반려견</label>
              <input className={styles.input} type='text' name='dogName' onChange={handleInput}
                value={mypage.dogName} />
            </div>
            <div className={styles.withdrawalWrap}>
              <button id='withdrawal'>회원탈퇴</button>
            </div>
          </div>
          <div className='buttonWrap'>
            <Button destination='/' name='취소' />
            <Button isButton name='저장' />
          </div>
        </form>
      }
      {
        (isError || isAlert) && <Alert handleAlert={handleAlert} message={isError || isAlert} isAlert={isAlert} />
      }
    </section>
  )
}
