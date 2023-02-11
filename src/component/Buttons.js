import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import { locationState, opacityState } from '../recoil/Atom';

function Buttons ({ buttonName, cancelLink, handleFormSubmit }) {
    const setCheckLocation = useSetRecoilState(locationState);
    const setBackgroundOpacity = useSetRecoilState(opacityState);
    return (
        <Inner>
            {/* cancel */}
            {
                cancelLink === '/detail-diary' ?
                    <Button onClick={() => cancelLink === '/detail-diary' ?
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
            {/* submit */}
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
    top: 53%;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
`