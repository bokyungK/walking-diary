import React, { useRef } from 'react';
import axios from 'axios';
import Buttons from './Buttons.js';
import styles from './Join.module.css';

function Join({ history }) {
    const [display, setDisplay] = React.useState('none');
    const [notice, setNotice] = React.useState('');
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
    const userPetName = useRef();
    const userArr = [userId, userPw, userName, userPetName];
    const regExp = {
        userId: [/^[a-z]+[a-z0-9]{4,}$/, 'ID 작성 : 영문과 숫자 조합(5~15자)'], 
        userPw: [/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/,
                'PW 작성 : 영문과 숫자, 특수문자 최소 한가지 조합(8~15자)'],
        userName: [/^[가-힣]{1,}$/, '이름 작성 : 한글 사용(1~10자)'],
        userPetName: [/^[가-힣]{1,}$/, '반려견 이름 작성 : 한글 사용(1~10자)'],
    }

    function handleInfoRules(e) {
        const getInputId = e.target.id;
        const keys = Object.keys(regExp);
        const keyIndex = keys.indexOf(getInputId);
        const isRegExp = regExp[keys[keyIndex]][0].test(e.target.value);

        if (isRegExp) {
            e.target.setAttribute('regExp', true);
            setDisplay('none');
        } else {
            e.target.setAttribute('regExp', false);
            setNotice(regExp[keys[keyIndex]][1]);
            setDisplay('flex');
        }
    }

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value,
            userName: userName.current.value,
            userPetName: userPetName.current.value, 
        }
        const condition = userInfo.userId === '' || userInfo.userPw === '' || userInfo.userName === '' || userInfo.userPetName === '';
        if(condition) {
            setNotice('모든 정보를 입력하세요');
            setDisplay('flex');
            return;
        }
        const regExpBooleanArr = userArr.map((item) => {
            return item.current.attributes.regExp.value;
        })

        if (regExpBooleanArr.includes("false")) {
            setNotice('정보를 규칙에 맞게 입력해주세요');
            setDisplay('flex');
        } else {
            axios.post('http://localhost:3001/join', userInfo)
            .then(res => {
                if (res.data === 'Success') {
                    history.push("/");
                }
            })
        }
    }
    return (
        <div className={styles.Join}>
            <h2 className={styles.infoTitle}>회원가입</h2>
            <div className={styles.notice} style={{ display: `${display}` }}>
                <img src='warning.png' alt='경고 느낌표'></img>
                <p>{notice}</p>
            </div>
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userId'>ID</label>
                        <input onChange={handleInfoRules} ref={userId} className={styles.itemInput} id='userId' type='text' maxlength='15'/>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel} htmlFor='userPw'>PW</label>
                        <input onChange={handleInfoRules} ref={userPw} className={styles.itemInput} id='userPw' type='password' autocomplete="off" maxlength='15'/>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userName'>이름</label>
                        <input onChange={handleInfoRules} ref={userName} className={styles.itemInput} id='userName' type='text' maxlength='10'/>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel} htmlFor='userPetName'>반려견 이름</label>
                        <input onChange={handleInfoRules} ref={userPetName} className={styles.itemInput} id='userPetName' type='text' maxlength='10'/>
                    </div>
                </div>
                <Buttons buttonName={buttonName} cancelLink={cancelLink} handleFormSubmit={handleFormSubmit} disabled />
            </form>
        </div>
    )
}

export default Join;