import React, { useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Notice from './Notice.js';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { apiUrlState } from '../recoil/Atom';
var store = require('store');

function Login({ changeNotice }) {
    const apiUrl = useRecoilValue(apiUrlState);
    const userId = useRef();
    const userPw = useRef();

    function handleFormSubmit() {
        const userInfo = {
            userId: userId.current.value,
            userPw: userPw.current.value
        }
        const condition = userInfo.userId === '' || userInfo.userPw === '';

        if (condition) {
            changeNotice('모든 정보를 입력하세요', 'warning.png', 'flex', 0);
        } else {
            axios.post(apiUrl + 'login', userInfo, { withCredentials: true })
            .then(res => {
                if (res.data === 'Success') {
                    store.set('loginState', 'true');
                    changeNotice('로그인 성공', 'correct.png', 'flex', "/")
                    return;
                }
                if (res.data === 'Fail_id') {
                    changeNotice('ID가 존재하지 않습니다', 'warning.png', 'flex', 0)
                }
                if (res.data === 'Fail_pw') {
                    changeNotice('PW가 틀렸습니다', 'warning.png', 'flex', 0)
                }
            })
        }
    }
    return (
        <Inner>
            <Notice />
            <Form method='post'>
                <div>
                    <div>
                        <Label htmlFor='userId'>ID</Label>
                        <Input ref={userId} id='userId' type='text' />
                    </div>
                    <div>
                        <Label htmlFor='userPw'>PW</Label>
                        <Input ref={userPw} id='userPw' type='password' autoComplete="off" />
                    </div>
                </div>
                <LoginButton onClick={handleFormSubmit} type="button">LOGIN</LoginButton>
            </Form>
            <JoinButton type='button'><Link to="/join">회원가입 하러가기</Link></JoinButton>
        </Inner>
    )
}

export default Login;


// styled component
const Inner = styled.div`
    width: max-content;
    margin: 0 auto;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Form = styled.form`
    display: flex;
    height: 150px;
    margin-bottom: 1rem;

    > div {
        display: flex;
        flex-direction: column;
        text-align: end;
        margin-right: 1.5rem;

        > div:first-child {
            margin-bottom: 1.5rem;
        }
    }
`

const Label = styled.label`
    margin-right: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #212121;
    @media only screen and (max-width: 450px) {
        font-size: 1.2rem;
    }
`

const Input = styled.input`
    background-color: skyblue;
    color: #fff;
    width: 12rem;
    height: 4rem;
    font-size: 1.5rem;
    text-align: center;
    border: none;
    @media only screen and (max-width: 450px) {
        width: 10rem;
    }

    &:focus {
        border: none;
    }
`

const LoginButton = styled.button`
    width: 100px;
    height: inherit;
    padding: 0 0.5rem;
    text-align: center;
    color: #997000;
    border: #997000 solid 3px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    font-size: 1.3rem;
    font-weight: bold;
    @media only screen and (max-width: 450px) {
        width: 90px;
        font-size: 1.1rem;
    }
`

const JoinButton = styled.button`
    width: max-content;
    display: block;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0);
    border: none;
    color: darkgray;
    font-weight: bold;
    font-size: 1rem;
    box-shadow: unset;
    -webkit-box-shadow: unset;
    @media only screen and (max-width: 450px) {
        font-size: 1rem;
    }

    &:hover {
        box-shadow: unset;
        -webkit-box-shadow: unset;
    }
`