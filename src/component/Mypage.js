import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./Mypage.module.css";
import Buttons from "./Buttons.js"
import CheckMessage from './CheckMessage.js';
import Notice from './Notice.js';

function Mypage({ notice, noticeIcon, display, changeNotice, checkLogin, checkMessage,
     setCheckMessage, checkCookie }) {

    const userPw = useRef();
    const userNewPw = useRef();
    const inputDogName1 = useRef();
    const inputDogName2 = useRef();
    const inputDogName3 = useRef();
    const inputDogNames = [inputDogName1, inputDogName2, inputDogName3];
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [dogNames, setDogNames] = useState([]);

    function handleAddPetName() {
        const nameLength = dogNames.length;
        if (nameLength > 2) {
            return;
        }
        setDogNames([...dogNames, '']);
    }
    
    function handleRemovePetName(idx) {
        const newDogNames = dogNames;
        newDogNames.splice(idx, 1);
        setDogNames([...newDogNames]);

        const userInfo = {
            idx: idx,
        }

        axios.post('https://api.walking-diary-server.site/delete-dog', userInfo, { withCredentials: true })
        .then(res => {
            const data = res.data;
            
            if (checkCookie(data, '/login')) {
                return;
            }

            if (data === 'Success') {
                changeNotice('반려견 이름이 삭제되었습니다', 'correct.png', 'flex', 1);
            }
        });
    }

    useEffect(() => {
        if (checkLogin()) {
            return;
        }

        axios.get('https://api.walking-diary-server.site/info', { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            setUserName(data.name);
            setUserId(data.id);

            const getDogNames = [data.dog_name_1, data.dog_name_2, data.dog_name_3];
            const getFilteredDogNames = getDogNames.filter((dogName) => {
                return dogName !== '';
            })
            setDogNames([...getFilteredDogNames]);
        })
    }, [])

    function handleInputValue(e) {
        const isRegExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/.test(e.target.value);
        if (!isRegExp) {
            e.target.setAttribute('regExp', false);
            changeNotice('PW 작성 : 영문과 숫자, 특수문자 최소 한가지 조합(8~15자)', 'warning.png', 'flex', 0);
            return;
        }
        e.target.setAttribute('regExp', true);
        changeNotice('', '', 'none', 0);
    }

    function handleFormSubmit() {
        const userInfo = {
            userPw: userPw.current.value,
            userNewPw: userNewPw.current.value,
            userDogName1: [inputDogName1.current.value, inputDogName1.current !== null && inputDogName1.current.defaultValue === inputDogName1.current.value ? true : false],
            userDogName2: [inputDogName2.current.value, inputDogName2.current !== null && inputDogName2.current.defaultValue === inputDogName2.current.value ? true : false],
            userDogName3: [inputDogName3.current.value, inputDogName3.current !== null && inputDogName3.current.defaultValue === inputDogName3.current.value ? true : false],
        }

        // 비밀 번호를 입력하지 않은 경우
        if (userInfo.userPw === '') {
            changeNotice('정보 변경을 위해, 비밀번호를 입력하세요', 'warning.png', 'flex', 0); 
            return;
        }

        // 새 비밀번호를 입력한 경우
            // 1. 비밀번호가 규칙에 맞지 않음
        if (userInfo.userNewPw !== '' && userNewPw.current.attributes.regExp.value === 'false') {
            changeNotice('새 비밀번호가 규칙에 어긋납니다', 'warning.png', 'flex', 0);
            return;
        }

            // 2. 비밀번호가 규칙에 맞거나 반려견 이름 변경
        axios.post('https://api.walking-diary-server.site/info', userInfo, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            if (data === 'Success') {
                changeNotice('저장되었습니다', 'correct.png', 'flex', 1);
                return;
            }
            changeNotice('비밀번호가 틀렸습니다', 'warning.png', 'flex', 0);
        });
    }

    function handleWithdrawal() {
        if (userPw.current.value === '') {
            changeNotice('비밀번호를 입력해주세요', 'goodbye.png', 'flex', 0);
            setCheckMessage({ display: 'none' });
            return;
        }

        axios.post('https://api.walking-diary-server.site/withdrawal', { userPw: userPw.current.value }, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }
            if (data === 'Fail') {
                changeNotice('비밀번호가 틀렸습니다', 'warning.png', 'flex', 0);
            }
            localStorage.removeItem('loginState');
            changeNotice('탈퇴 완료', 'goodbye.png', 'flex', "/");
            setCheckMessage({ display: 'none' });
        });
    }

    function handleLogout() {
        axios.get('https://api.walking-diary-server.site/logout', { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }
            changeNotice('로그아웃 완료', 'goodbye.png', 'flex', "/");
            setTimeout(() => {
                localStorage.removeItem('loginState');
            }, 1000)
        });
    }

    return (
        <div className={styles.Mypage}>
            <h2 className={styles.infoTitle}>마이페이지</h2>
            <Notice message={notice} icon={noticeIcon} display={display} />
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
                    {
                        dogNames.map((name, idx) => {
                            return  <div className={styles.formItem} key={name + idx}>
                                        <label className={styles.itemLabel}>반려견 이름</label>
                                        <input ref={inputDogNames[idx]} className={styles.itemInput} type='text' defaultValue={name} maxLength='10' />
                                        {
                                            idx === 0 ? <button className={styles.addPetButton} onClick={handleAddPetName} type='button'>추가</button>
                                            :
                                            idx === dogNames.length - 1 ?
                                                <button className={styles.addPetButton} onClick={() => {handleRemovePetName(idx)}} type='button'>삭제</button>
                                                :
                                                ''
                                        }
                                    </div>
                        })
                    }
                    <div className={styles.additionalTab}>
                        <button onClick={() => {
                            setCheckMessage({ display: 'block' });
                        }} className={`button ${styles.withdrawal}`} type='button'>회원탈퇴</button>
                        <button onClick={handleLogout} className={`button ${styles.logout}`} type='button'>로그아웃</button>
                    </div>
                </div>
                <CheckMessage checkMessage={checkMessage} setCheckMessage={setCheckMessage} handleShowMessage={handleWithdrawal}
                 option={{ cancel: '취소', submit: '탈퇴' }} />
                <Buttons handleFormSubmit={handleFormSubmit} buttonName={{cancel: '취소', submit: '저장'}} cancelLink={{path: '/'}} />
            </form>
        </div>
    )
}

export default Mypage;