import React, { useRef } from 'react';
import axios from 'axios';
import Buttons from './Buttons.js';
import Notice from './Notice.js';
import styled from 'styled-components';

function Join({ notice, noticeIcon, display, changeNotice, apiUrl }) {
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

    function handleInfoRules(e) {
        const getInputId = e.target.id;
        const keys = Object.keys(regExp);
        const keyIndex = keys.indexOf(getInputId);
        const isRegExp = regExp[keys[keyIndex]][0].test(e.target.value);

        if (isRegExp) {
            e.target.setAttribute('regExp', true);
            changeNotice('', '', 'none', 0);
        } else {
            e.target.setAttribute('regExp', false);
            changeNotice(regExp[keys[keyIndex]][1], 'warning.png', 'flex', 0);
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
            changeNotice('모든 정보를 입력하세요', 'warning.png', 'flex', 0);
            return;
        }
        const regExpBooleanArr = userArr.map((item) => {
            return item.current.attributes.regExp.value;
        })

        if (regExpBooleanArr.includes("false")) {
            changeNotice('정보를 규칙에 맞게 입력해주세요', 'warning.png', 'flex', 0);
        } else {
            axios.post(apiUrl + 'join', userInfo)
            .then(res => {
                if (res.data === 'Success') {
                    changeNotice('가입 성공', 'correct.png', 'flex', "/login");
                    return
                }
                if (res.data === 'Fail') {
                    changeNotice('이미 존재하는 ID 입니다', 'warning.png', 'flex', 0);
                }
            })
        }
    }
    return (
        <Inner>
            <Title>회원가입</Title>
            <Notice message={notice} icon={noticeIcon} display={display} />
            <Form>
                <div>
                    <FormItem>
                        <Label htmlFor='userId'>ID</Label>
                        <Input onChange={handleInfoRules} ref={userId} id='userId' type='text' maxLength='15'/>
                    </FormItem>
                    <FormItem>                       
                        <Label htmlFor='userPw'>PW</Label>
                        <Input onChange={handleInfoRules} ref={userPw} id='userPw' type='password' autoComplete="off" maxLength='15'/>
                    </FormItem>
                    <FormItem>
                        <Label htmlFor='userName'>이름</Label>
                        <Input onChange={handleInfoRules} ref={userName} id='userName' type='text' maxLength='10'/>
                    </FormItem>
                </div>
            </Form>
            <Buttons buttonName={buttonName} cancelLink={cancelLink} handleFormSubmit={handleFormSubmit} disabled />
        </Inner>
    )
}

export default Join;


// styled component
const Inner = styled.div`
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
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

    > div {
        width: max-content;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-bottom: 1rem;
        padding-right: 3rem;
    }
`

const FormItem = styled.div`
    margin-bottom: 1rem;
`

const Label = styled.label`
    margin-right: 1rem;
    font-size: 1.1rem;
`

const Input = styled.input`
    width: 12rem;
    height: 40px;
    background-color: skyblue;
    color: #fff;
    font-size: 1.1rem;
    text-align: center;
    @media only screen and (max-width: 450px) {
        width: 10rem;
    }
`
