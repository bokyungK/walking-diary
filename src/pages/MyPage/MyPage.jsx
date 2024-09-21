import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Buttons from "../../component/Buttons/Buttons"
import CheckMessage from '../../component/CheckMessage';
import styles from './MyPage.module.css';
import Notice from '../../component/Notice.jsx';
import { useRecoilValue , useSetRecoilState } from 'recoil';
import { apiUrlState, messageState, messageOptionState } from '../../recoil/Atom.js';
import { useUserContext } from '../../context/userContext';
var store = require('store');

// function Mypage({ changeNotice, checkLogin, checkCookie }) {
export default function Mypage() {
    const { user } = useUserContext();
    const apiUrl = useRecoilValue(apiUrlState);
    const setCheckMessage = useSetRecoilState(messageState);
    const setOption = useSetRecoilState(messageOptionState);

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
    }

    useEffect(() => {
        // if (checkLogin()) {
        //     return;
        // }

        const fetchUserInfo = async () => {
            try {
                const res = await axios.get(apiUrl + 'info', { withCredentials: true });
                const data = await res.data;
        
                // if (checkCookie(data, '/login')) {
                //     return;
                // }
    
                setUserName(data.name);
                setUserId(data.id);

                const getDogNames = [data.dog_name_1 === undefined ? '' : data.dog_name_1,
                                        data.dog_name_2 === undefined ? '' : data.dog_name_2,
                                        data.dog_name_3 === undefined ? '' : data.dog_name_3];
                const getFilteredDogNames = getDogNames.filter((dogName, idx) => {
                    return dogName !== '' || idx === 0;
                })

                setDogNames([...getFilteredDogNames]);
            } catch (err) {
                console.error(err);
            }
        }

        fetchUserInfo();
    // }, [apiUrl, checkCookie, checkLogin])
    }, [apiUrl])

    function handleInputValue(e) {
        const isRegExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/.test(e.target.value);
        if (!isRegExp) {
            e.target.setAttribute('regExp', false);
            // changeNotice('PW 작성 : 영문과 숫자, 특수문자 최소 한가지 조합(8~15자)', 'warning.png', 'flex', 0);
            return;
        }
        e.target.setAttribute('regExp', true);
        // changeNotice('', '', 'none', 0);
    }

    async function handleFormSubmit() {
        const userInfo = {
            userPw: userPw.current.value,
            userNewPw: userNewPw.current.value,
            userDogName1: inputDogName1.current === undefined || inputDogName1.current === null ? '' : inputDogName1.current.value,
            userDogName2: inputDogName2.current === undefined || inputDogName2.current === null ? '' : inputDogName2.current.value,
            userDogName3: inputDogName3.current === undefined || inputDogName3.current === null ? '' : inputDogName3.current.value,
        }

        // 비밀 번호를 입력하지 않은 경우
        if (userInfo.userPw === '') {
            // changeNotice('정보 변경을 위해 비밀번호를 입력하세요', 'warning.png', 'flex', 0); 
            return;
        }

        // 새 비밀번호를 입력한 경우
            // 1. 비밀번호가 규칙에 맞지 않음
        if (userInfo.userNewPw !== '' && userNewPw.current.attributes.regExp.value === 'false') {
            // changeNotice('새 비밀번호가 규칙에 어긋납니다', 'warning.png', 'flex', 0);
            return;
        }

            // 2. 비밀번호가 규칙에 맞거나 반려견 이름 변경
        // try {
        //     const res = await axios.post(apiUrl + 'info', userInfo, { withCredentials: true });
        //     const data = await res.data;

        //     // if (checkCookie(data, '/login')) {
        //         return;
        //     }

        //     if (data === 'Success') {
        //         // changeNotice('저장되었습니다', 'correct.png', 'flex', 1);
        //         return;
        //     }

        //     // changeNotice('비밀번호가 틀렸습니다', 'warning.png', 'flex', 0);
        // } catch (err) {
        //     console.error(err);
        // }
    }

    async function handleWithdrawal() {
        if (userPw.current.value === '') {
            // changeNotice('비밀번호를 입력해주세요', 'goodbye.png', 'flex', 0);
            setCheckMessage({ display: 'none' });
            return;
        }

        try {
            const res = await axios.delete(apiUrl + 'withdrawal', { withCredentials: true, data: { userPw: userPw.current.value } });
            const data = res.data;
    
            // if (checkCookie(data, '/login')) {
            //     return;
            // }

            if (data === 'Fail') {
                // changeNotice('비밀번호가 틀렸습니다', 'warning.png', 'flex', 0);
            }

            store.remove('loginState');
            store.remove('imageName');
            store.remove('order');
            // changeNotice('탈퇴 완료', 'goodbye.png', 'flex', "/");
            setCheckMessage({ display: 'none' });
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLogout() {
            try {
                const res = await axios.get(apiUrl + 'logout', { withCredentials: true })
                const data = await res.data;
        
                // if (checkCookie(data, '/login')) {
                //     return;
                // }
                
                store.remove('loginState');
                store.remove('imageName');
                window.scrollTo(0, 0);
                // changeNotice('로그아웃 완료', 'goodbye.png', 'flex', "/");
            } catch (err) {
                console.error(err);
            }
    }

    return (
        <section className='column'>
            <h2>마이페이지</h2>
            <Notice />
            {
                user && 
                <form className={styles.form}>
                    <div>
                        <div>
                            <label>이름</label>
                            <input type='text' disabled defaultValue={userName}/>
                        </div>
                        <div>                       
                            <label>아이디</label>
                            <textarea type='text' disabled defaultValue={user.email}></textarea>
                        </div>
                        <div>
                            <label>비밀번호</label>
                            <input ref={userPw} type='password' autoComplete="off" maxLength='15' placeholder='현재 비밀번호' />
                        </div>
                        <div>
                            <label>새 비밀번호</label>
                            <input ref={userNewPw} onChange={handleInputValue} type='password' autoComplete="off" maxLength='15' placeholder='바꿀 비밀번호' />
                        </div>
                        {
                            dogNames.map((name, idx) => {
                                return  <div key={name + idx}>
                                            <label>반려견 이름 {idx + 1}</label>
                                            <input ref={inputDogNames[idx]} type='text' defaultValue={name} maxLength='10' placeholder='이름 작성 후 저장' />
                                            {
                                                idx === 0 ? <button className={styles.button} onClick={handleAddPetName} type='button'>Box<br />추가</button>
                                                :
                                                idx === dogNames.length - 1 ?
                                                    <button className={styles.button} onClick={() => {handleRemovePetName(idx)}} type='button'>Box<br />삭제</button>
                                                    :
                                                    ''
                                            }
                                        </div>
                            })
                        }
                        <div className={styles.additionalTab}>
                            <button onClick={() => {
                                setCheckMessage({ display: 'block' });
                                setOption({ cancel: '취소', submit: '탈퇴' });
                            }} type='button'>회원탈퇴</button>
                        </div>
                    </div>
                    <CheckMessage handleShowMessage={handleWithdrawal} />
                    <Buttons className={styles.buttonWrap} buttonName={{cancel: '취소', submit: '저장'}} cancelLink={{path: '/'}} />
                </form>
            }
        </section>
    )
}
