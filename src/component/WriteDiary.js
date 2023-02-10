import axios from "axios";
import React, { useRef, useEffect } from "react";
import Buttons from "./Buttons";
import Notice from './Notice.js';
import styled, { css } from "styled-components";
var store = require('store');


function WriteDiary({ notice, noticeIcon, display, changeNotice, checkLogin, checkCookie,
    apiUrl }) {

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
    }, [])

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
            <Notice message={notice} icon={noticeIcon} display={display} />
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
                        <DateBox ref={date} type='date' value={date.value} disabled />
                        <WeatherBox>
                                <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' defaultChecked />
                                <label htmlFor='sunny'>☀</label>
                                <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                                <label htmlFor='cloudy'>☁</label>
                                <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' />
                                <label htmlFor='rainy'>☂</label>
                                <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' />
                                <label htmlFor='snowy'>☃</label>
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
    @media only screen and (hover: none) and (pointer: coarse) {
        margin-top: 80px;
    }
`

const Inner = styled.div`
    width: 700px;
    margin: 0 auto;
    @media only screen and (max-width: 450px) {
        width: 98%;
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
    overflow: hidden;
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
    justify-content: space-between;
    margin-bottom: 1rem;
`

const InfoItem = css`
    flex-basis: 30%;
    border: 3px solid #997000;
    border-radius: 10px;
    line-height: 2rem;
    text-align: center;
    @media only screen and (max-width: 700px) {
        flex-basis: 33%
    }
`

const DateBox = styled.input`
    ${InfoItem};
`

const WeatherBox = styled.fieldset`
    ${InfoItem};
    display: flex;
    justify-content: center;
    flex-wrap: norwap;

    input[type=radio] {
        display: none;
    }

    input[type=radio] + label {
        font-size: 1.5rem;
        color: darkgray;
        @media only screen and (max-width: 700px) {
            font-size: 1.2rem;
        }
    }

    input[type=radio] + label:not(:last-child) {
        margin-right: 1rem;
        @media only screen and (max-width: 700px) {
            margin-right: 0.8rem;
        }
    }

    input[type=radio]:checked + label {
        color: black;
    }
`

const DogBox = styled.select`
    ${InfoItem}
    color: rgba(0, 0, 0, 1);

    > option {
        background-color: #997000;
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
