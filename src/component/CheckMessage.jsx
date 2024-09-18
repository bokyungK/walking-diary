import React from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { messageState, messageOptionState } from '../recoil/Atom';


function CheckMessage ({ handleShowMessage }) {
    const [checkMessage, setCheckMessage] = useRecoilState(messageState);
    const option = useRecoilValue(messageOptionState);
    
    return (
        <Inner style={checkMessage}>
            <div>
                <p>정말 {option.submit}하시겠습니까?</p>
                <div>
                    <button onClick={() => {
                        setCheckMessage({ display: 'none' });
                    }} type='button'>{option.cancel}</button>
                    <button onClick={() => {
                        window.scrollTo(0, 0);
                        handleShowMessage();
                    }} type='button'>{option.submit}</button>
                </div>
            </div>
        </Inner>
    )
}

export default CheckMessage;


// styled component
const Inner = styled.div`
    width: 300px;
    height: 200px;
    position: fixed;
    top : 50%;
    left: 50%;
    background-color: #fff;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.3);
    z-index: 1;
    @media only screen and (max-width: 450px) {
        width: 250px;
        height: 150px;
    }

    > div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: max-content;
        height: max-content;

        > div {
            text-align: center;
        }
    }

    p {
        margin-bottom: 1rem;
    }

    button {
        width: 50px;
        height: 30px;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        color: #fff;
    }

    button:first-child {
        margin-right: 1rem;
        background-color: #F0CA61;
    }

    button:nth-child(2) {
        background-color: #997000;
    }
`
