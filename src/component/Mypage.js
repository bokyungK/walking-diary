import React, { useRef, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import styles from "./Mypage.module.css";
import Buttons from "./Buttons.js"

function Mypage() {
    const history = useHistory();
    const userPw = useRef();
    const userNewPw = useRef();
    const inputDogName1 = useRef();
    const inputDogName2 = useRef();
    const inputDogName3 = useRef();
    const [userName, setUserName] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [userDogName1, setUserDogName1] = React.useState('');
    const [userDogName2, setUserDogName2] = React.useState('');
    const [userDogName3, setUserDogName3] = React.useState('');
    const [buttonDisplay, setButtonDisplay] = React.useState(['none', 'none']);

    function handleAddPetName() {
        const countBlock = buttonDisplay.filter((item) => {
            return item === 'block';
        }).length;
        if (countBlock === 2) {
            return;
        }
        if (countBlock === 1 && buttonDisplay[1] === 'block') {
            const copyArr = [...buttonDisplay];
            copyArr[countBlock - 1] = 'block';
            setButtonDisplay(copyArr);
            return;
        }
        const copyArr = [...buttonDisplay];
        copyArr[countBlock] = 'block';
        setButtonDisplay(copyArr);
    }
    function handleRemovePetName(e) {
        const getButtonNum = parseInt(e.target.getAttribute('custom-attribute'));
        const copyArr = [...buttonDisplay];
        copyArr[getButtonNum - 2] = 'none';
        setButtonDisplay(copyArr);

        const userDogNames = [setUserDogName1, setUserDogName2, setUserDogName3];
        userDogNames[getButtonNum - 1]('');
    }

useEffect(() => {
    axios.get('http://localhost:3001/info', { withCredentials: true })
    .then(res => {
        const data = res.data;
            // 인증 받지 않은 유저
        if (data === 'There is no access_token') {
            localStorage.removeItem('loginState');
            history.push('/login');
            return;
        }
            // 인증 받은 유저
        if (Object.keys(data).length === 2) {
            setUserName(data.name);
            setUserId(data.id);
        } else {
            setUserName(data.name);
            setUserId(data.id);
            if (data.dog_name_1 !== '') {
                setUserDogName1(data.dog_name_1);
            } else {
                setUserDogName1('');
            }
            if (data.dog_name_2 !== '') {
                setUserDogName2(data.dog_name_2);
                const copyArr = [...buttonDisplay];
                copyArr[0] = 'block';
                setButtonDisplay(copyArr);
            }
            if (data.dog_name_3 !== '') {
                setUserDogName3(data.dog_name_3);
                const copyArr = [...buttonDisplay];
                copyArr[1] = 'block';
                setButtonDisplay(copyArr);
            }
        }
    })
}, [history, buttonDisplay])



    const [notice, setNotice] = React.useState('');
    const [noticeIcon, setNoticeIcon] = React.useState('warning.png');
    const [display, setDisplay] = React.useState('none');

    function handleInputValue(e) {
        const isRegExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/.test(e.target.value);
        if (!isRegExp) {
            e.target.setAttribute('regExp', false);
            setNotice('PW 작성 : 영문과 숫자, 특수문자 최소 한가지 조합(8~15자)');
            setNoticeIcon('warning.png');
            setDisplay('flex');
            return;
        }
        e.target.setAttribute('regExp', true);
        setDisplay('none');
    }

    function handleFormSubmit() {
        const userInfo = {
            userPw: userPw.current.value,
            userNewPw: userNewPw.current.value,
            userDogName1: inputDogName1.current.value,
            userDogName2: inputDogName2.current.value,
            userDogName3: inputDogName3.current.value,
        }
        
        if (userInfo.userPw === '') {
            setNotice('비밀번호를 입력하세요');
            setDisplay('flex');
            return;
        }
        if (userInfo.userNewPw !== '' && userNewPw.current.attributes.regExp.value === 'false') {
                setNotice('새 비밀번호가 규칙에 어긋납니다');
                setDisplay('flex');
                return;
        }
        if (userDogName2 === '') {
            
        }
        axios.post('http://localhost:3001/info', userInfo, { withCredentials: true })
        .then(res => {
            if (res.data === 'Success') {
                setNotice('저장되었습니다');
                setNoticeIcon('correct.png');
                setDisplay('flex');
                setTimeout(() => {
                    window.location.replace("/mypage")
                }, 1000);
                return;
            }
            if (res.data === 'Nothing') {
                setNotice('변경할 정보를 입력하세요');
                setNoticeIcon('warning.png');
                setDisplay('flex');
                return;
            }
            setNotice('비밀번호가 틀렸습니다');
            setNoticeIcon('warning.png');
            setDisplay('flex');
        });
    }

    function handleWithdrawal() {
        axios.get('http://localhost:3001/withdrawal', { withCredentials: true })
        .then(res => {
            localStorage.removeItem('loginState');
            setNotice('탈퇴 완료');
            setNoticeIcon('goodbye.png');
            setDisplay('flex');
            setTimeout(() => {
                history.push("/");
            }, 1000);
        });
    }

    function handleLogout() {
        axios.get('http://localhost:3001/logout', { withCredentials: true })
        .then(res => {
            localStorage.removeItem('loginState');
            setNotice('로그아웃 완료');
            setNoticeIcon('goodbye.png');
            setDisplay('flex');
            setTimeout(() => {
                history.push("/");
            }, 1000);
        });
    }

    return (
        <div className={styles.Mypage}>
            <h2 className={styles.infoTitle}>마이페이지</h2>
            <div className={styles.notice} style={{ display: `${display}` }}>
                <img src={noticeIcon} alt='경고 느낌표'></img>
                <p>{notice}</p>
            </div>
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>이름</label>
                        <input className={styles.itemInput} type='text' disabled defaultValue={userName}/>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel}>아이디</label>
                        <input className={styles.itemInput} type='text' disabled defaultValue={userId}/>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>비밀번호</label>
                        <input ref={userPw} className={styles.itemInput} type='password' autoComplete="off" maxLength='15' />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>새 비밀번호</label>
                        <input ref={userNewPw} onChange={handleInputValue} className={styles.itemInput} type='password' autoComplete="off" maxLength='15' />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>반려견 이름</label>
                        <input ref={inputDogName1} className={styles.itemInput} type='text' defaultValue={userDogName1} />
                        <button className={styles.addPetButton} onClick={handleAddPetName} custom-attribute='1' type='button'>추가</button>
                    </div>
                    <div className={styles.formItem} style={{display: `${buttonDisplay[0]}`}}>
                        <label className={styles.itemLabel}>반려견 이름</label>
                        <input ref={inputDogName2} className={styles.itemInput} type='text' defaultValue={userDogName2} />
                        <button className={styles.addPetButton} onClick={handleRemovePetName} custom-attribute='2' type='button'>삭제</button>
                    </div>
                    <div className={styles.formItem} style={{display: `${buttonDisplay[1]}`}}>
                        <label className={styles.itemLabel}>반려견 이름</label>
                        <input ref={inputDogName3} className={styles.itemInput} type='text' defaultValue={userDogName3} />
                        <button className={styles.addPetButton} onClick={handleRemovePetName} custom-attribute='3' type='button'>삭제</button>
                    </div>
                    <div className={styles.additionalTab}>
                        <button onClick={handleWithdrawal} className={`button ${styles.withdrawal}`} type='button'>회원탈퇴</button>
                        <button onClick={handleLogout} className={`button ${styles.logout}`} type='button'>로그아웃</button>
                    </div>
                </div>
                <Buttons handleFormSubmit={handleFormSubmit} buttonName={{cancel: '취소', submit: '저장'}} cancelLink={{path: '/'}} />
            </form>
        </div>
    )
}

export default Mypage;