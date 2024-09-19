import React, { useRef } from 'react';
import styles from './Join.module.css';
import axios from 'axios';
import Buttons from '../../component/Buttons/Buttons.jsx';
import Notice from '../../component/Notice.jsx';
import { useRecoilValue } from 'recoil';
import { apiUrlState } from '../../recoil/Atom.js';

export default function Join({ changeNotice }) {
    const apiUrl = useRecoilValue(apiUrlState);
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
    const userArr = [userId, userPw, userName];
    const regExp = {
        userId: [/^[a-z]+[a-z0-9]{4,}$/, 'ID 작성 : 영문, 숫자만 사용 가능(5~15자)'], 
        userPw: [/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/,
                'PW 작성 : 영문과 숫자, 특수문자 최소 한가지 조합(8~15자)'],
        userName: [/^[가-힣]{1,}$/, '이름 작성 : 한글 사용(1~10자)'],
    }

    function handleInfoRules(e) {
        const getinputId = e.target.id;
        const keys = Object.keys(regExp);
        const keyIndex = keys.indexOf(getinputId);
        const isRegExp = regExp[keys[keyIndex]][0].test(e.target.value);

        if (isRegExp) {
            e.target.setAttribute('regExp', true);
            changeNotice('', '', 'none', 0);
        } else {
            e.target.setAttribute('regExp', false);
            changeNotice(regExp[keys[keyIndex]][1], 'warning.png', 'flex', 0);
        }
    }

    async function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value,
            userName: userName.current.value,
        }
        const condition = userInfo.userId === '' || userInfo.userPw === '' || userInfo.userName === '';

        if(condition) {
            changeNotice('모든 정보를 입력하세요', 'warning.png', 'flex', 0);
            return;
        }

        const regExpBooleanArr = userArr.map((item) => {
            return item.current.attributes.regExp.value;
        })

        if (regExpBooleanArr.includes("false")) {
            changeNotice('정보를 규칙에 맞게 입력해주세요', 'warning.png', 'flex', 0);
            return;
        }

        try {
            const res = await axios.post(apiUrl + 'join', userInfo);
            const data = await res.data;

            if (data === 'Success') {
                changeNotice('가입 성공', 'correct.png', 'flex', "/login");
                return
            }
            if (data === 'Fail') {
                changeNotice('이미 존재하는 ID 입니다', 'warning.png', 'flex', 0);
            }
        } catch (err) {
            console.error(err);
        }
    }
    return (
      <section className='column'>
        <h2>회원가입</h2>
        <Notice />
        <form className={styles.form}>
          <div>
            <div>
              <label className={styles.label} htmlFor='userId'>ID</label>
              <input onChange={handleInfoRules} ref={userId} id='userId' type='text' maxLength='15'/>
            </div>
            <div>                       
              <label className={styles.label} htmlFor='userPw'>PW</label>
              <input onChange={handleInfoRules} ref={userPw} id='userPw' type='password' autoComplete="off" maxLength='15'/>
            </div>
            <div>
              <label className={styles.label} htmlFor='userName'>이름</label>
              <input onChange={handleInfoRules} ref={userName} id='userName' type='text' maxLength='10'/>
            </div>
          </div>
        </form>
        <Buttons buttonName={buttonName} cancelLink={cancelLink} handleFormSubmit={handleFormSubmit} disabled />
      </section>
    )
}
