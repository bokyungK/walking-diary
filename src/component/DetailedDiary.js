import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import Buttons from './Buttons';
import CheckMessage from './CheckMessage.js';
import Notice from './Notice.js';
import styled, { css } from 'styled-components';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { apiUrlState, locationState, messageState, messageOptionState, opacityState } from '../recoil/Atom';
var store = require('store');

function DetailedDiary({ changeNotice, checkLogin, checkCookie } ) {

    const apiUrl = useRecoilValue(apiUrlState);
    const [checkLocation, setCheckLocation] = useRecoilState(locationState);
    const setCheckMessage = useSetRecoilState(messageState);
    const setOption = useSetRecoilState(messageOptionState);
    const setBackgroundOpacity = useSetRecoilState(opacityState);

    const history = useHistory();
    const sunny = useRef();
    const cloudy = useRef();
    const rainy = useRef();
    const snowy = useRef();
    const selectedDog = useRef();
    const [diaryInfo, setDiaryInfo] = useState('');
    const imageAttach = useRef();
    const [imageSrc, setImageSrc] = React.useState('');
    const [img, setImg] = React.useState('');
    const title = useRef();
    const content = useRef();

    // read
    useEffect(() => {
        if (checkLogin()) {
            return;
        }
        const currentDiary = store.get('imageName');
        const fetchData = async () => {
            try {
                const res = await axios.get(apiUrl + 'get-diary', { withCredentials: true, params: { imageName: currentDiary }})
                const data = await res.data;

                if (checkCookie(data, '/login')) {
                    return;
                }

                setDiaryInfo({...data,
                    date: String(data.date).substring(0, 10),
                    imageSrc: apiUrl + `${data.id}/${data.image_name}`,
                    imageName: data.image_name,
                });
    
                const currentWeather = data.weather;
                const weathers = [sunny, cloudy, rainy, snowy];
                weathers.forEach((item) => {
                    if (item.current.value === currentWeather) {
                        item.current.checked = true;
                    }
                })

                if (checkLocation) {
                    setImageSrc(diaryInfo.imageSrc);
                    const res = await axios.get(apiUrl + 'get-dogs', { withCredentials: true })
                    const data = await res.data;
                    const dogNames = [data.dog_name_1, data.dog_name_2, data.dog_name_3];
                    
                    dogNames.forEach((dogName, idx) => {
                        if (dogName === '') {
                            selectedDog.current[idx].innerText = ''
                        } else {
                            selectedDog.current[idx].innerText = dogName;
                        }
                    })
                    selectedDog.current.value = diaryInfo.dog_name;
                }

                title.current.value = data.title;
                content.current.value = data.content
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, [checkLocation, apiUrl, checkCookie, checkLogin, diaryInfo.dog_name, diaryInfo.imageSrc])

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

    function handleDiaryUpdate() {
        setCheckLocation(true);
    }

    async function handleFormSubmit() {
        if (checkLogin()) {
            return;
        }

        try {
            const weathers = [sunny, cloudy, rainy, snowy];
            const weather = weathers.filter((item) => item.current.checked === true);
            const newDiaryInfo = {
                weather: weather[0].current.value,
                dogName: selectedDog.current.value,
                title: title.current.value,
                content: content.current.value,
                imageName: diaryInfo.imageName,
            }
            const postData = [];
    
            if (newDiaryInfo.dogName === '') {
                changeNotice('마이페이지에서 강아지를 추가 후 이름을 선택해주세요', 'warning.png', 'flex', 0);
                return; 
            }
    
            if (newDiaryInfo.title === '') {
                changeNotice('제목을 입력해주세요', 'warning.png', 'flex', 0);
                return; 
            }
    
            if (newDiaryInfo.content === '') {
                changeNotice('일기 내용을 입력해주세요', 'warning.png', 'flex', 0);
                return; 
            }
    
            if (img === '') {
                postData.push(newDiaryInfo);
            } else {
                const formData = new FormData();
                formData.append('img', img);
                formData.append('info', JSON.stringify(newDiaryInfo));
                postData.push(formData);
            }

            const res = await axios.put(apiUrl + 'update-diary', postData[0], { withCredentials: true })
            const data = await res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            store.set('imageName', data);
            changeNotice('변경되었습니다', 'correct.png', 'flex', 1);
            setCheckLocation(false);
            setBackgroundOpacity(0);

        } catch (e) {
            console.error(e);
        }
    }

    // delete
    async function handleDiaryDelete() {
        if (checkLogin()) {
            return;
        }

        try {
            const res = await axios.delete(apiUrl + 'delete-diary', { withCredentials: true, data: diaryInfo });
            const data = await res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            if (data === 'Success') {
                changeNotice('삭제되었습니다', 'correct.png', 'flex', '/mydiary');
                setCheckMessage({ display: 'none' });
            }
        } catch (err) {
            console.error(err);
        }
    }

    // control star state
    async function handleStarImage() {
        if (checkLogin()) {
            return;
        }
        
        const starred = [];
        const reverseState = diaryInfo.starred !== 1 ? 1 : 0;
        const imageName = store.get('imageName');

        setDiaryInfo({...diaryInfo, starred: reverseState});
        starred.push(reverseState);

        try {
            const res = await axios.patch(apiUrl + 'starred', { starred: starred[0], imageName: imageName }, { withCredentials: true });
            const data = await res.data;
            
            if (checkCookie(data, '/login')) {
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
    <section>
        <Inner>
            <Notice />
            <Icons>
                <Icon onClick={handleStarImage}>
                    <IconImg imgSrc={diaryInfo.starred ? 'filled_star.png':'empty_star.png'} imgAlt='즐겨찾기 버튼'/>
                </Icon>
                <Icon onClick={handleDiaryUpdate}>
                    <IconImg imgSrc='edit.png' imgAlt='수정 버튼' />
                </Icon>
                <Icon onClick={() => 
                    {
                        setCheckMessage({ display: 'block' });
                        setOption({ cancel: '취소', submit: '삭제' });
                        setCheckMessage({ display: 'block' });
                    }}><IconImg imgSrc='delete.png' imgAlt='삭제 버튼' />
                </Icon>
                <Icon onClick={() => history.push("/mydiary")}>
                    <IconImg imgSrc='cancel.png' imgAlt='뒤로가기 버튼' />
                </Icon>
            </Icons>
            {
                checkLocation ? 
                <>
                    <AttachmentLabel htmlFor='image-attach'>
                        <p>
                            영역을 눌러 사진을 첨부하세요! <br />
                            (사진을 변경하거나 추가하지 않으면,<br />
                            기존 사진이 유지됩니다)
                        </p>
                        {
                            imageSrc && <>
                                <PreviewImage src={imageSrc} alt='첨부 이미지 미리보기' />,
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    imageAttach.current.value = '';
                                    setImageSrc('');
                                    setImg('');
                                }} type='button'><img src='cancel.png' alt='첨부 이미지 삭제 버튼' /></button>
                            </>
                        }
                    </AttachmentLabel>
                    <AttachmentInput ref={imageAttach} onChange={(e) => {
                        handleImagePreview(e.target.files[0]);
                        setImg(e.target.files[0]);
                        }} id='image-attach' type='file' accept='image/*' />
                    <DiaryInfo>
                        <DiaryDate>{diaryInfo.date}</DiaryDate>
                        <WeatherRadio>
                            <WeatherInput ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny'/>
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
                        </WeatherRadio>
                        <DogSelect ref={selectedDog}>
                            <option></option>
                            <option></option>
                            <option></option>
                        </DogSelect>
                    </DiaryInfo>
                    <Title ref={title} type='text' placeholder='제목을 입력하세요' maxLength='30' />
                    <Content ref={content} placeholder='일기를 입력하세요' maxLength='500'></Content>
                    <Buttons buttonName={{cancel: '취소' ,submit: '변경'}} cancelLink='/detail-diary' handleFormSubmit={handleFormSubmit}
                    setCheckLocation={setCheckLocation} setBackgroundOpacity={setBackgroundOpacity} />
                </>
                :
                <>
                    <DiaryPhoto src={diaryInfo.imageSrc} alt='일기 사진' />
                    <DiaryInfo>
                        <DiaryDate>{diaryInfo.date}</DiaryDate>
                        <WeatherRadio>
                            <WeatherInput ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' disabled/>
                                <WeatherLabel htmlFor='sunny'>
                                    <img src='sunny.svg' alt='맑은 날 아이콘'></img>
                                </WeatherLabel>
                                <WeatherInput ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy'disabled />
                                <WeatherLabel htmlFor='cloudy'>
                                    <img src='cloudy.svg' alt='흐린 날 아이콘'></img>
                                </WeatherLabel>
                                <WeatherInput ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' disabled />
                                <WeatherLabel htmlFor='rainy'>
                                    <img src='rainy.svg' alt='비오는 날 아이콘'></img>
                                </WeatherLabel>
                                <WeatherInput ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' disabled />
                                <WeatherLabel htmlFor='snowy'>
                                    <img src='snowy.svg' alt='눈 오는 날 아이콘'></img>
                                </WeatherLabel>
                        </WeatherRadio>
                        <DogNameBox>{diaryInfo.dog_name}</DogNameBox>
                    </DiaryInfo>
                    <Title ref={title} type='text' placeholder='제목을 입력하세요' maxLength='30' disabled />
                    <Content ref={content} placeholder='일기를 입력하세요' maxLength='500' disabled></Content>
                </>
            }
            <CheckMessage handleShowMessage={handleDiaryDelete} />
        </Inner>
    </section>
    )
}

export default DetailedDiary;


// styled component
const Inner = styled.div`
    width: 700px;
    margin: 0 auto;
    margin-top: 90px;
    @media only screen and (max-width: 450px) {
        width: 98%;
    }
    @media only screen and (min-width: 451px) and (max-width: 700px) {
        width: 440px;
    }
`

const Icons = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
`

const Icon = styled.div`
    background-color: rgba(255, 255, 255, 0);
    border: none;

    &:not(:last-child) {
        margin-right: 1rem;
    }

    &:hover {
        cursor: pointer;
    }
`
const IconImg = styled.img.attrs((props) => ({
    src: props.imgSrc,
    alt: props.imgAlt,
}))`
    width: 30px;
    height: 30px;
    @media only screen and (hover: hover) and (pointer: coarse) and (max-width: 700px) {
        width: 25px;
        height: 25px;
    }
    @media only screen and (hover: none) and (pointer: coarse) and (max-width: 700px) {
        width: 25px;
        height: 25px;
    }
`

const AttachmentLabel = styled.label`
    background-color: skyblue;
    position: relative;
    display: flex;
    width: 100%;
    height: 500px;
    border: darkgray 3px solid;
    margin-bottom: 1rem;
    color: #fff;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    border: none;
    overflow: hidden;
    border: none;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
   @media only screen and (max-width: 700px) {
        height: 300px;
        line-height: 300px;
   }

    > p {
        text-align: center;
        @media only screen and (max-width: 700px) {
            line-height: 100%;
       }
    }

    > button {
        position: absolute;
        border: none;
        top: 10px;
        right: 10px;
        z-index: 1;
        box-shadow: unset;

        img {
            width: 30px;
            height: 30px;
        }
    }
`
const PreviewImage = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
    z-index: 1;
`

const AttachmentInput = styled.input`
    display: none;
`

const DiaryPhoto = styled.img`
    width: 100%;
    height: 500px;
    object-fit: cover;
    margin-bottom: 1rem;
    border-radius: 30px;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
    background-color: skyblue;
    @media only screen and (max-width: 700px) {
        height: 300px;
   }
`

const DiaryInfo = styled.div`
    display: flex;
    flex-wrap: norwap;
    height: 2.3rem;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-weight: normal;
    font-size: 1rem;
`

const DiaryInfoItemsCss = css`
    flex-basis: 30%;
    heightL 2.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid #997000;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
    @media only screen and (max-width: 700px) {
        font-size: 0.8rem;
        flex-basis: 33%;
    }
`

const DiaryDate = styled.div`
    ${DiaryInfoItemsCss}
`

const WeatherRadio = styled.fieldset`
    ${DiaryInfoItemsCss}
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

const DogSelect = styled.select`
    ${DiaryInfoItemsCss}
    text-overflow: ellipsis;
    white-space: nowrap;

    > option {
        color: #fff;
        border-radius: 10px;
    }
`

const DogNameBox = styled.div`
    ${DiaryInfoItemsCss}
    text-overflow: ellipsis;
    white-space: nowrap;
`

const WritingBox = css`
    width: 100%;
    background-color: white;
    margin-bottom: 1rem;
    line-height: 2rem;
    font-size: 1.3rem;
    border: 3px solid #997000;
    border-radius: 10px;
    font-weight: normal;
    padding: 0 1rem;
    outline: none;
    box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.2);
`

const Title = styled.input`
    ${WritingBox}
    @media only screen and (max-width: 700px) {
        font-size: 1rem;
    }
`

const Content = styled.textarea`
    ${WritingBox}
    height: 200px;
    word-break: break-word;
    background: repeating-linear-gradient(white, white 30px, #997000 30px, #997000 33px);
    font-size: 1.2rem;
    border-bottom: 3px solid #997000;
    margin-bottom: 3rem;
    @media only screen and (max-width: 700px) {
        font-size: 1rem;
    }
`
