import React, { useRef } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import styles from "./Mypage.module.css";
import Buttons from "./Buttons.js"
import PetNameBox from "./PetNameBox.js";

function Mypage({ loginState, setLoginState }) {
    const defaultBox = true;
    const history = useHistory();
    const userPw = useRef();
    const userNewPw = useRef();
    // const userPetName = useRef();
    const buttonName = {
        cancel: '취소',
        submit: '변경'
    }
    const cancelLink = {
        path: '/',
    }

    const [appendPetNameBox, setAppendPetNameBox] = React.useState([]);
    function handleAddPetName() {
        if (appendPetNameBox.length === 2) {
            return;
        }
        setAppendPetNameBox([...appendPetNameBox, <PetNameBox key={`pet-${appendPetNameBox.length + 1}`} />]);
    }
    function handleRemovePetName() {
        setAppendPetNameBox([...appendPetNameBox].filter((item, idx) => idx !== [...appendPetNameBox].length - 1));
    }

    const [userName, setUserName] = React.useState();
    const [userId, setUserId] = React.useState();
    const [userPetName1, setUserPetName1] = React.useState();
    // const [userPetName2, setUserPetName2] = React.useState();
    // const [userPetName3, setUserPetName3] = React.useState();
    if (loginState) {
        axios.get('http://localhost:3001/info', { withCredentials: true })
        .then(res => {
            const data = res.data[0];
            setUserName(data.name);
            setUserId(data.id);
            setUserPetName1(data.dog_name_1);
        });
    }
    const [notice, setNotice] = React.useState('');
    const [noticeIcon, setNoticeIcon] = React.useState('warning.png');
    const [display, setDisplay] = React.useState('none');
    function handleFormSubmit() {
        const userInfo = {
            userPw: userPw.current.value,
            userNewPw: userNewPw.current.value,
            // userPetName: userPetName.current.value,
        }
        if (userInfo.userPw === '' || userInfo.userNewPw === '') {
            setNotice('변경할 정보를 입력하세요');
            setDisplay('flex');
            return;
        }
        axios.post('http://localhost:3001/info', userInfo, { withCredentials: true })
        .then(res => {
            if (res.data === 'Success') {
                setNotice('비밀번호가 변경되었습니다');
                setNoticeIcon('correct.png');
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
            setLoginState(false);
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
            setLoginState(false);
            history.push("/");
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
                        <input className={styles.itemInput} type='text' disabled value={userName}/>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel}>아이디</label>
                        <input className={styles.itemInput} type='text' disabled value={userId}/>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>비밀번호</label>
                        <input ref={userPw} className={styles.itemInput} type='password' />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>변경 비밀번호</label>
                        <input ref={userNewPw} className={styles.itemInput} type='password' />
                    </div>
                    <PetNameBox defaultBox={defaultBox} handleAddPetName={handleAddPetName} handleRemovePetName={handleRemovePetName} appendPetNameBox={appendPetNameBox} userPetName1={userPetName1} setUserPetName1= {setUserPetName1} />
                    {   appendPetNameBox.length > 0 ? appendPetNameBox.map((item) => { return item }) : ''  }
                    <div className={styles.additionalTab}>
                        <button onClick={handleWithdrawal} className={`button ${styles.withdrawal}`} type='button'>회원탈퇴</button>
                        <button onClick={handleLogout} className={`button ${styles.logout}`} type='button'>로그아웃</button>
                    </div>
                </div>
                <Buttons handleFormSubmit={handleFormSubmit} buttonName={buttonName} cancelLink={cancelLink} />
            </form>
        </div>
    )
}

export default Mypage;