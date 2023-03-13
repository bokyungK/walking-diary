import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { opacityState } from '../recoil/Atom';
var store = require('store');

function Header() {
    const backgroundOpacity = useRecoilValue(opacityState);
    const loginState = store.get('loginState');

    return (
        <Inner opacity={backgroundOpacity}>
            <Title><Link to="/">산책 일기</Link></Title>
            <Menu opacity={backgroundOpacity}>
                <ul>
                    <li><Link to="/mydiary">내 일기장</Link></li>
                    <li><Link to="/write-diary">일기 쓰기</Link></li>
                    <li>
                        <Link to={loginState === 'true' ? "/mypage" : "/login"}>{loginState === 'true' ? '마이페이지' : '로그인'}</Link>
                        </li>
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
    background-color: rgba(255, 255, 255, ${props => props.opacity});
`
  
const Title = styled.h1`
    text-align: center;
    font-size: 2.2rem;
    line-height: 80px;
    @media only screen and (max-width: 700px) {
        font-size: 2rem;
    }
`

const Menu = styled.nav`
    width: 530px;
    border-radius: 10px;
    margin: 0 auto;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, ${props => props.opacity}); 
    @media only screen and (max-width: 600px) {
        width: 90%;
    }

    &:last-child {
        line-height: 80px;
    }

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
        @media only screen and (max-width: 450px) {
            font-size: 1.1rem;
        }
        @media only screen and (min-width: 450px) and (max-width: 650px) {
            font-size: 1.3rem;
        }

        > li:not(:last-child) {
            margin-right: 3rem;
            @media only screen and (max-width: 450px) {
                margin-right: 1.3rem;
            }
            @media only screen and (min-width: 450px) and (max-width: 650px) {
                margin-right: 1.5rem;
            }
        }
    }
`