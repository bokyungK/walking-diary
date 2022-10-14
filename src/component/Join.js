import React, { useRef } from 'react';
import axios from 'axios';
import Buttons from './Buttons.js';
import styles from './Join.module.css';
import Notice from "./Notice";

function Join({ history }) {
    const [notice, setNotice] = React.useState('');
    const [noticeIcon, setNoticeIcon] = React.useState('warning.png');
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
    const userArr = [userId, userPw, userName];
    const regExp = {
        userId: [/^[a-z]+[a-z0-9]{4,}$/, 'ID 작성 : 영문과 숫자 조합(5~15자)'], 
        userPw: [/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/,
                'PW 작성 : 영문과 숫자, 특수문자 최소 한가지 조합(8~15자)'],
        userName: [/^[가-힣]{1,}$/, '이름 작성 : 한글 사용(1~10자)'],
    }

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

    function handleInfoRules(e) {
        const getInputId = e.target.id;
        const keys = Object.keys(regExp);
        const keyIndex = keys.indexOf(getInputId);
        const isRegExp = regExp[keys[keyIndex]][0].test(e.target.value);

        if (isRegExp) {
            e.target.setAttribute('regExp', true);
            changeNotice('', '', 'none', false);
        } else {
            e.target.setAttribute('regExp', false);
            setNotice(regExp[keys[keyIndex]][1]);
            changeNotice(regExp[keys[keyIndex]][1], 'warning.png', 'flex', false);
        }
    }

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value,
            userName: userName.current.value,
        }
        const condition = userInfo.userId === '' || userInfo.userPw === '' || userInfo.userName === '';
        if(condition) {
            changeNotice('모든 정보를 입력하세요', 'warning.png', 'flex', false);
            return;
        }
        const regExpBooleanArr = userArr.map((item) => {
            return item.current.attributes.regExp.value;
        })

        if (regExpBooleanArr.includes("false")) {
            changeNotice('정보를 규칙에 맞게 입력해주세요', 'warning.png', 'flex', false);
        } else {
            axios.post('http://localhost:3001/join', userInfo)
            .then(res => {
                if (res.data === 'Success') {
                    changeNotice('가입 성공', 'correct.png', 'flex', "/login");
                    return
                }
                if (res.data === 'Fail') {
                    changeNotice('이미 존재하는 ID 입니다', 'warning.png', 'flex', false);
                }
            })
        }
    }
    return (
        <div className={styles.Join}>
            <h2 className={styles.infoTitle}>회원가입</h2>
            <Notice notice={notice} noticeIcon={noticeIcon} display={display} />
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userId'>ID</label>
                        <input onChange={handleInfoRules} ref={userId} className={styles.itemInput} id='userId' type='text' maxLength='15'/>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel} htmlFor='userPw'>PW</label>
                        <input onChange={handleInfoRules} ref={userPw} className={styles.itemInput} id='userPw' type='password' autoComplete="off" maxLength='15'/>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userName'>이름</label>
                        <input onChange={handleInfoRules} ref={userName} className={styles.itemInput} id='userName' type='text' maxLength='10'/>
                    </div>
                </div>
                <Buttons buttonName={buttonName} cancelLink={cancelLink} handleFormSubmit={handleFormSubmit} disabled />
            </form>
        </div>
    )
}

export default Join;