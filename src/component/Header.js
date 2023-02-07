import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Header({ backgroundOpacity }) {
    const loginState = localStorage.getItem('loginState');
    const backgroundStyle = {
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
    }

    return (
        <Inner style={backgroundStyle}>
            <Title><Link to="/">산책 일기</Link></Title>
            <Menu>
                <ul>
                    <li><Link to="/mydiary">내 일기장</Link></li>
                    <li><Link to="/write-diary">일기 쓰기</Link></li>
                    <li><Link to={
                        Boolean(loginState) ? "/mypage" : "/login"
                    } >{Boolean(loginState) ? '마이페이지' : '로그인'}</Link></li>
                </ul>
            </Menu>
        </Inner>
    )
}

export default Header;


// styled component
const Inner = styled.header`
    width: 100%;
    height: 80px;
    position: fixed;
    top: 0;
    z-index: 3;

    &:hover {
        > nav {
            display: block;
            background-color: #fff;
        }
    }
`
  
const Title = styled.h1`
    text-align: center;
    font-size: 2.2rem;
    line-height: 80px;
`

const Menu = styled.nav`
    width: 500px;
    border-radius: 10px;
    display: none;
    margin: 0 auto;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);

    > ul {
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        font-size: 1.5rem;
        padding-left: 0;
        margin-left: 0;
        top: 70px;

        > li:not(:last-child) {
            margin-right: 3rem;
        }
    }
`