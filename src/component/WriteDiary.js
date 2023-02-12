import axios from "axios";
import React, { useRef, useEffect } from "react";
import Buttons from "./Buttons";
import Notice from './Notice.js';
import styled, { css } from "styled-components";
import { useRecoilValue } from 'recoil';
import { apiUrlState } from '../recoil/Atom';
var store = require('store');


function WriteDiary({ changeNotice, checkLogin, checkCookie }) {
    const apiUrl = useRecoilValue(apiUrlState);
    
    const imageAttach = useRef();;
    const date = useRef();
    date.value = `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`;
    const sunny = useRef();
    const cloudy = useRef();
    const rainy = useRef();
    const snowy = useRef();
    const weathers = [sunny, cloudy, rainy, snowy];
    const selectedDog = useRef();
    const title = useRef();
    const content = useRef();
    const [img, setImg] = React.useState('');
    const [imageSrc, setImageSrc] = React.useState('');

    useEffect(() => {
        if (checkLogin()) {
            return;
        }

        axios.get(apiUrl + 'get-dogs', { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            const dogNames = [data.dog_name_1, data.dog_name_2, data.dog_name_3];
            dogNames.forEach((dogName, idx) => {
                dogName === undefined ?
                selectedDog.current[idx].innerText = ''
                :
                selectedDog.current[idx].innerText = dogName;
            })
        })
    }, [apiUrl, checkCookie, checkLogin])

    function handleImagePreview(fileBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve) => {
          reader.onload = () => {
            setImageSrc(reader.result);
            resolve();
          };
        });
    }

    function getTime() {
        const today = new Date();   
        const hours = ('0' + today.getHours()).slice(-2); 
        const minutes = ('0' + today.getMinutes()).slice(-2);
        const seconds = ('0' + today.getSeconds()).slice(-2); 
        const timeString = hours + ':' + minutes  + ':' + seconds;
        return timeString;
    }

    function handleFormSubmit() {
        const weather = weathers.filter((item) => {
            return item.current.checked === true;
        })
        const userInfo = {
            date: [date.value, getTime()],
            weather: weather[0].current.value,
            selectedDog: selectedDog.current.value,
            title: title.current.value,
            content: content.current.value,
        };

        if (img === '' || userInfo.selectedDog === ''  || userInfo.title === '' || userInfo.content === '') {
            changeNotice('모든 항목을 입력해주세요', 'warning.png', 'flex', 0);
            return;
        }

        const formData = new FormData();
        formData.append('img', img);
        formData.append('info', JSON.stringify(userInfo));

        axios.post(apiUrl + 'write-diary', formData, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }
            store.set('imageName', data);
            changeNotice('저장 성공', 'correct.png', 'flex', "/detail-diary");
        })
    }

    return (
        <WritingSection>    
            <Notice />
            <Inner>
                <form encType='multipart/form-data'>
                    <AttachmentLabel htmlFor='image-attach'>
                        <span>영역을 눌러 사진을 첨부하세요!</span>
                    {
                        imageSrc && <>
                            <PreviewImage src={imageSrc} alt='첨부 이미지 미리보기' />,
                            <button onClick={(e) => {
                                e.preventDefault();
                                imageAttach.current.value = '';
                                setImageSrc('');
                            }} type='button'><img src='cancel.png' alt='첨부 이미지 삭제 버튼' /></button>
                        </>
                    }
                    </AttachmentLabel>
                    <AttachmentInput ref={imageAttach} onChange={(e) => {
                        handleImagePreview(e.target.files[0]);
                        setImg(e.target.files[0]);
                        }} id='image-attach' type='file' accept='image/*' />
                    <DiaryInfo>
                        <DateBox ref={date}>{date.value}</DateBox>
                        <WeatherBox>
                                <WeatherInput ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' defaultChecked />
                                <WeatherLabel htmlFor='sunny'>
                                    <img src='sunny.svg' alt='맑은 날 아이콘'></img>
                                </WeatherLabel>
                                <WeatherInput ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                                <WeatherLabel htmlFor='cloudy'>
                                    <img src='cloudy.svg' alt='흐린 날 아이콘'></img>
                                </WeatherLabel>
                                <WeatherInput ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' />
                                <WeatherLabel htmlFor='rainy'>
                                    <img src='rainy.svg' alt='비오는 날 아이콘'></img>
                                </WeatherLabel>
                                <WeatherInput ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' />
                                <WeatherLabel htmlFor='snowy'>
                                    <img src='snowy.svg' alt='눈 오는 날 아이콘'></img>
                                </WeatherLabel>
                        </WeatherBox>
                        <DogBox ref={selectedDog}>
                            <option></option>
                            <option></option>
                            <option></option>
                        </DogBox>
                    </DiaryInfo>
                    <TitleInfo ref={title} type='text' placeholder='제목을 입력하세요' maxLength='30' />
                    <ContentInfo ref={content} placeholder='일기를 입력하세요' maxLength='500' ></ContentInfo>
                    <Buttons buttonName={{ cancel: '취소', submit: '저장' }} cancelLink={{ path: '/MyDiary' }} handleFormSubmit={handleFormSubmit} />
                </form>
            </Inner>
        </WritingSection>
    )
}

export default WriteDiary;


// styled component
const WritingSection = styled.section`
    width: 100%;
    height: 100%;
    margin-top: 80px;
`

const Inner = styled.div`
    width: 700px;
    margin: 0 auto;
    @media only screen and (max-width: 450px) {
        width: 90%;
    }
    @media only screen and (min-width: 451px) and (max-width: 700px) {
        width: 440px;
    }
`

const AttachmentLabel = styled.label`
    background-color: skyblue;
    position: relative;
    display: block;
    width: 100%;
    height: 500px;
    border: darkgray 3px solid;
    margin-bottom: 1rem;
    color: #fff;
    text-align: center;
    line-height: 500px;
    border-radius: 30px;
    border: none;
    overflow: hidden;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
    @media only screen and (max-width: 700px) {
        height: 300px;
        line-height: 300px;
    }

    > button {
        position: absolute;
        border: none;
        top: 10px;
        right: 10px;
        z-index: 1;
        box-shadow: unset;

        > img {
            width: 30px;
            height: 30px;
        }
    }
`

const PreviewImage = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
`

const AttachmentInput = styled.input`
    display: none;
    width: 100%;
`

const DiaryInfo = styled.div`
    display: flex;
    flex-wrap: norwap;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-weight: normal;
    font-size: 1rem;
`

const InfoItem = css`
    flex-basis: 30%;
    height: 2.3rem;
    border: 3px solid #997000;
    border-radius: 10px;
    background-color: #fff;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
    @media only screen and (max-width: 700px) {
        font-size: 0.8rem;
        flex-basis: 28%;
    }
`

const DateBox = styled.div`
    ${InfoItem};
`

const WeatherBox = styled.fieldset`
    ${InfoItem};
    overflow: hidden;
    @media only screen and (max-width: 700px) {
        label {
            width: 2rem;
            height: 2rem;
        }
    }

    label:nth-child(6) {
        width: 2.9rem;
        height: 2.9rem;
        @media only screen and (max-width: 700px) {
            width: 2.4rem;
            height: 2.4rem;
        }
    }

    label:nth-child(8) {
        width: 2.9rem;
        height: 2.9rem;
        @media only screen and (max-width: 700px) {
            width: 2.4rem;
            height: 2.4rem;
        }
    }
`

const WeatherInput = styled.input`
    &[type=radio] {
        display: none;
    }

    &[type=radio]:checked + label {
        opacity: 1;
    }
`

const WeatherLabel = styled.label`
    width: 2.5rem;
    height: 2.5rem;
    background-image: url(${props => props.url});
    background-size: cover;
    opacity: 0.3;
`


const DogBox = styled.select`
    ${InfoItem}

    > option {
        color: #fff;
        border-radius: 10px;
    }
`

const WritingInfo = css`
    width: 100%;
    margin-bottom: 1rem;
    line-height: 2rem;
    padding: 0 1rem;
    border: 3px solid #997000;
    border-radius: 10px;
    font-weight: normal;
    font-size: 1.3rem;
    outline: none;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
    @media only screen and (max-width: 700px) {
        font-size: 1rem;
    }
`

const TitleInfo = styled.input`
    ${WritingInfo};
`

const ContentInfo = styled.textarea`
    ${WritingInfo};

    resize: none;
    height: 200px;
    background: repeating-linear-gradient(white, white 30px, #997000 30px, #997000 33px);
    font-size: 1.2rem;
`