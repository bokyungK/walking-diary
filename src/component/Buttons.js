import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Buttons ({ buttonName, cancelLink, handleFormSubmit, setCheckLocation, setBackgroundOpacity }) {
    return (
        <Inner>
            {
                cancelLink === '/detail-diary' ?
                <Button onClick={() =>
                cancelLink === '/detail-diary' ?
                (
                    setCheckLocation(false),
                    setBackgroundOpacity(0)
                )
                : 
                ''}>
                    <ButtonImg buttonAlt={buttonName.cancel} />
                    <ButtonName>{buttonName.cancel}</ButtonName>
                </Button>
                :
                <Link to={cancelLink.path}>
                    <Button>
                        <ButtonImg buttonAlt={buttonName.cancel} />
                        <ButtonName>{buttonName.cancel}</ButtonName>
                    </Button>
                </Link>
            }
            <Button onClick={handleFormSubmit} type='button'>
                <ButtonImg buttonAlt={buttonName.submit} />
                <ButtonName>{buttonName.submit}</ButtonName>
            </Button>
        </Inner>
    )
}

export default Buttons;


// styled component
const Inner = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;s
`

const Button = styled.button`
    position: relative;
    border: none;
    
    &:first-child {
        margin-right: 1.5rem;
    }
`

const ButtonImg = styled.img.attrs((props) => ({
    src: 'button.png',
    alt: props.buttonAlt + '버튼',
}))`
    width: 55px;
    height: 50px;
`

const ButtonName = styled.div`
    position: absolute;
    top: 55%;
    left: 15px;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
`