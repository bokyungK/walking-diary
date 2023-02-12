import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Buttons from "./Buttons.js"
import CheckMessage from './CheckMessage.js';
import Notice from './Notice.js';
import styled from "styled-components";
import { useRecoilValue , useSetRecoilState } from 'recoil';
import { apiUrlState, messageState, messageOptionState } from '../recoil/Atom';
var store = require('store');

function Mypage({ changeNotice, checkLogin, checkCookie }) {
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
        if (checkLogin()) {
            return;
        }

        axios.get(apiUrl + 'info', { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            setUserName(data.name);
            setUserId(data.id);
            const getDogNames = [data.dog_name_1 === undefined ? '' : data.dog_name_1,
                                 data.dog_name_2 === undefined ? '' : data.dog_name_2,
                                 data.dog_name_3 === undefined ? '' : data.dog_name_3];
            const getFilteredDogNames = getDogNames.filter((dogName, idx) => {
                return dogName !== '' || idx === 0;
            })
            setDogNames([...getFilteredDogNames]);
        })
    }, [apiUrl, checkCookie, checkLogin])

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
            userDogName1: inputDogName1.current === undefined || inputDogName1.current === null ? '' : inputDogName1.current.value,
            userDogName2: inputDogName2.current === undefined || inputDogName2.current === null ? '' : inputDogName2.current.value,
            userDogName3: inputDogName3.current === undefined || inputDogName3.current === null ? '' : inputDogName3.current.value,
        }

        // 비밀 번호를 입력하지 않은 경우
        if (userInfo.userPw === '') {
            changeNotice('정보 변경을 위해 비밀번호를 입력하세요', 'warning.png', 'flex', 0); 
            return;
        }

        // 새 비밀번호를 입력한 경우
            // 1. 비밀번호가 규칙에 맞지 않음
        if (userInfo.userNewPw !== '' && userNewPw.current.attributes.regExp.value === 'false') {
            changeNotice('새 비밀번호가 규칙에 어긋납니다', 'warning.png', 'flex', 0);
            return;
        }

            // 2. 비밀번호가 규칙에 맞거나 반려견 이름 변경
        axios.post(apiUrl + 'info', userInfo, { withCredentials: true })
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

        axios.post(apiUrl + 'withdrawal', { userPw: userPw.current.value }, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }
            if (data === 'Fail') {
                changeNotice('비밀번호가 틀렸습니다', 'warning.png', 'flex', 0);
            }
            store.remove('loginState');
            store.remove('imageName');
            changeNotice('탈퇴 완료', 'goodbye.png', 'flex', "/");
            setCheckMessage({ display: 'none' });
        });
    }

    function handleLogout() {
        axios.get(apiUrl + 'logout', { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }
            store.remove('loginState');
            store.remove('imageName');
            window.scrollTo(0, 0);
            changeNotice('로그아웃 완료', 'goodbye.png', 'flex', "/");
        });
    }

    return (
        <Inner>
            <Title>마이페이지</Title>
            <Notice />
            <Form>
                <FormSection>
                    <FormItem>
                        <ItemLabel>이름</ItemLabel>
                        <ItemInput type='text' disabled defaultValue={userName}/>
                    </FormItem>
                    <FormItem>                       
                        <ItemLabel>아이디</ItemLabel>
                        <ItemInput type='text' disabled defaultValue={userId}/>
                    </FormItem>
                    <FormItem>
                        <ItemLabel>비밀번호</ItemLabel>
                        <ItemInput ref={userPw} type='password' autoComplete="off" maxLength='15' />
                    </FormItem>
                    <FormItem>
                        <ItemLabel>새 비밀번호</ItemLabel>
                        <ItemInput ref={userNewPw} onChange={handleInputValue} type='password' autoComplete="off" maxLength='15' />
                    </FormItem>
                    {
                        dogNames.map((name, idx) => {
                            return  <FormItem key={name + idx}>
                                        <ItemLabel>반려견 이름 {idx + 1}</ItemLabel>
                                        <ItemInput ref={inputDogNames[idx]} type='text' defaultValue={name} maxLength='10' />
                                        {
                                            idx === 0 ? <AddBoxButton onClick={handleAddPetName} type='button'>추가</AddBoxButton>
                                            :
                                            idx === dogNames.length - 1 ?
                                                <RemovePetButton onClick={() => {handleRemovePetName(idx)}} type='button'>삭제</RemovePetButton>
                                                :
                                                ''
                                        }
                                    </FormItem>
                        })
                    }
                    <AdditionalTab>
                        <button onClick={() => {
                            setCheckMessage({ display: 'block' });
                            setOption({ cancel: '취소', submit: '탈퇴' });
                        }} type='button'>회원탈퇴</button>
                        <button onClick={handleLogout} type='button'>로그아웃</button>
                    </AdditionalTab>
                </FormSection>
                <CheckMessage handleShowMessage={handleWithdrawal} />
                <Buttons handleFormSubmit={handleFormSubmit} buttonName={{cancel: '취소', submit: '저장'}} cancelLink={{path: '/'}} />
            </Form>
        </Inner>
    )
}

export default Mypage;


// styled component
const Inner = styled.div`
    height: calc(100vh - 80px);
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    @media only screen and (hover: hover) and (pointer: coarse) and (max-width: 450px) {
        height: 100%;
        margin-top: 80px;
    }
    @media only screen and (hover: none) and (pointer: coarse) and (max-width: 450px) {
        height: 100%;
        margin-top: 80px;
    }
`

const Title = styled.h2`
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    @media only screen and (max-width: 450px) {
        font-size: 1.5rem;
    }
`
  
const Form = styled.form`
    text-align: center;
`
  
const FormSection = styled.div`
    width: max-content;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 1rem;
    padding-right: 7rem;
    @media only screen and (max-width: 450px) {
        padding-right: 0;
        width: min-content;
    }
`

const FormItem = styled.div`
    margin-bottom: 1rem;
    position: relative;
`

const ItemLabel = styled.label`
    margin-right: 1rem;
    font-size: 1.1rem;
    @media only screen and (max-width: 450px) {
        margin-right: 0;
    }
`

const ItemInput = styled.input`
    width: 200px;
    height: 40px;
    background-color: skyblue;
    color: #fff;
    font-size: 1.1rem;
    text-align: center;
    border: none;
    @media only screen and (max-width: 450px) {
        margin-top: 0.3rem;
    }

    &:focus {
        border: none;
    }
`

const AddBoxButton = styled.button`
    border: #997000 solid 3px;
    font-weight: bold;
    background-color: rgba(255, 255, 240, 1);
    border-radius: 10px;
    position: absolute;
    width: 50px;
    height: 100%;
    right: -60px;

    @media only screen and (max-width: 450px) {
        width: 50px;
        height: 50px;
        right: -60px;
    }
`

const RemovePetButton = styled(AddBoxButton)`
`

const AdditionalTab = styled.div`
    width: 200px;
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    margin-bottom: 1rem;

    > button {
        border: 3px solid #997000;
        font-weight: bold;
        border-radius: 10px;
        width: max-content;
        padding: 0.3rem;
        background-color: rgba(255, 255, 240, 1);
    }
`
