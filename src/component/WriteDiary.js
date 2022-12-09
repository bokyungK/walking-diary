import axios from "axios";
import React, { useRef, useEffect } from "react";
import Buttons from "./Buttons";
import Notice from './Notice.js';
import styles from "./WriteDiary.module.css";

function WriteDiary({ notice, noticeIcon, display, changeNotice, checkLogin, checkCookie }) {
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

        axios.get('http://localhost:3001/get-dogs', { withCredentials: true })
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

        axios.post('http://localhost:3001/write-diary', formData, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }
            localStorage.setItem('imageName', data);
            changeNotice('저장 성공', 'correct.png', 'flex', "/detail-diary");
        })
    }

    return (
        <section className={styles.WriteDiary}>    
            <Notice message={notice} icon={noticeIcon} display={display} />
            <div className={styles.inner}>
                <form encType='multipart/form-data'>
                    <label className={styles.attachmentLabel} htmlFor='image-attach'>
                        <span>영역을 눌러 사진을 첨부하세요!</span>
                    {
                        imageSrc && <>
                            <img className={styles.previewImage} src={imageSrc} alt='첨부 이미지 미리보기' />,
                            <button onClick={(e) => {
                                e.preventDefault();
                                imageAttach.current.value = '';
                                setImageSrc('');
                            }} type='button'><img src='cancel.png' alt='첨부 이미지 삭제 버튼' /></button>
                        </>
                    }
                    </label>
                    <input ref={imageAttach} onChange={(e) => {
                        handleImagePreview(e.target.files[0]);
                        setImg(e.target.files[0]);
                        }} className={styles.attachmentInput} id='image-attach' type='file' accept='image/*' />
                    <div className={styles.diaryInfo}>
                        <input ref={date} className={styles.infoItem} type='date' value={date.value} disabled />
                        <fieldset className={`${styles.infoItem} ${styles.weatherRadio}`}>
                                <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' defaultChecked />
                                <label htmlFor='sunny'>☀</label>
                                <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                                <label htmlFor='cloudy'>☁</label>
                                <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' />
                                <label htmlFor='rainy'>☂</label>
                                <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' />
                                <label htmlFor='snowy'>☃</label>
                        </fieldset>
                        <select ref={selectedDog} className={styles.infoItem}>
                            <option></option>
                            <option></option>
                            <option></option>
                        </select>
                    </div>
                    <input ref={title} className={`${styles.writingInfo} ${styles.titleInfo}`} type='text' placeholder='제목을 입력하세요' maxLength='30' />
                    <textarea ref={content} className={`${styles.writingInfo} ${styles.contentInfo}`} placeholder='일기를 입력하세요' maxLength='500' ></textarea>
                    <Buttons buttonName={{ cancel: '취소', submit: '저장' }} cancelLink={{ path: '/MyDiary' }} handleFormSubmit={handleFormSubmit} />
                </form>
            </div>
        </section>
    )
}

export default WriteDiary;