import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styles from './DetailedDiary.module.css';
import Buttons from './Buttons';
import CheckMessage from './CheckMessage.js';
import Notice from './Notice.js';

function DetailedDiary({ notice, noticeIcon, display, changeNotice, checkLogin, checkCookie,
    checkLocation, setCheckLocation, checkMessage, setCheckMessage, setBackgroundOpacity } ) {
        
    const history = useHistory();
    const sunny = useRef();
    const cloudy = useRef();
    const rainy = useRef();
    const snowy = useRef();
    const selectedDog = useRef();
    const [diaryInfo, setDiaryInfo] = useState('');

    // read
    useEffect(() => {
        if (checkLogin()) {
            return;
        }
        const currentDiary = localStorage.getItem('imageName');

        axios.post('http://localhost:3001/get-diary', { imageName: currentDiary }, { withCredentials: true })
        .then((res) => {
            if (checkCookie(res.data, '/login')) {
                return;
            }
            const data = res.data;

            setDiaryInfo({
                date: String(data.date).substring(0, 10),
                weather: data.weather,
                dogName: data.dog_name,
                title: data.title,
                content: data.content,
                imageName: data.image_name,
                imageSrc: `http://localhost:3001/${data.id}/${data.image_name}`,
                starred: data.starred,
            })

            const currentWeather = data.weather;
            const weathers = [sunny, cloudy, rainy, snowy];
            weathers.forEach((item) => {
                if (item.current.value === currentWeather) {
                    item.current.checked = true;
                }
            })
        })
    }, [checkLocation])

    // update
    useEffect(() => {
        if (checkLocation) {
            setImageSrc(diaryInfo.imageSrc);

            axios.get('http://localhost:3001/get-dogs', { withCredentials: true })
            .then(res => {
                const data = res.data;

                if (checkCookie(data, '/login')) {
                    return;
                }

                const dogNames = [data.dog_name_1, data.dog_name_2, data.dog_name_3];
                dogNames.forEach((dogName, idx) => {
                    if (dogName === '') {
                        selectedDog.current[idx].innerText = ''
                    } else {
                        selectedDog.current[idx].innerText = dogName;
                    }
                })
                selectedDog.current.value = diaryInfo.dogName;
            })
        }
    }, [checkLocation])

    
    const imageAttach = useRef();
    const [imageSrc, setImageSrc] = React.useState('');
    const [img, setImg] = React.useState('');

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

    const title = useRef();
    const content = useRef();

    function handleFormSubmit() {
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

        if (img === '') {
            postData.push(newDiaryInfo);
        } else {
            const formData = new FormData();
            formData.append('img', img);
            formData.append('info', JSON.stringify(newDiaryInfo));
            postData.push(formData);
        }

        axios.post('http://localhost:3001/update-diary', postData[0], { withCredentials: true })
        .then((res) => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            localStorage.setItem('imageName', data);
            changeNotice('?????????????????????', 'correct.png', 'flex', 1);
            setCheckLocation(false);
            setBackgroundOpacity(0);
        })
    }

    // delete
    function handleDiaryDelete() {
        axios.post('http://localhost:3001/delete-diary', diaryInfo, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            if (data === 'Success') {
                changeNotice('?????????????????????', 'correct.png', 'flex', '/mydiary');
                setCheckMessage({ display: 'none' });
            }
        })
    }

    // control star state
    function handleStarImage() {
        const starred = [];
        const reverseState = diaryInfo.starred !== 1 ? 1 : 0;
        const imageName = localStorage.getItem('imageName');

        setDiaryInfo({...diaryInfo, starred: reverseState});
        starred.push(reverseState);

        axios.post('http://localhost:3001/starred', {starred: starred[0], imageName: imageName}, { withCredentials: true })
        
        .then((res) => {
            const data = res.data;
            
            if (checkCookie(data, '/login')) {
                return;
            }
        })
    }

    return (
    <section className={styles.DetailedDiary}>
        <div className={styles.inner}>
            <Notice message={notice} icon={noticeIcon} display={display} />
            <div className={styles.crudIcon}>
                <button onClick={handleStarImage} className={styles.icons}><img className={styles.iconImages} src={diaryInfo.starred ? 'filled_star.png':'empty_star.png'} alt='???????????? ??????'/></button>
                <button onClick={handleDiaryUpdate} className={styles.icons}><img className={styles.iconImages} src='edit.png' alt='?????? ??????' /></button>
                <button onClick={() => {
                    setCheckMessage({ display: 'block' });
                }} className={styles.icons}><img className={styles.iconImages} src='delete.png' alt='?????? ??????' /></button>
                <button onClick={() => history.push("/mydiary")} className={styles.icons}><img className={styles.iconImages} src='cancel.png' alt='???????????? ??????'/></button>
            </div>
            {
                checkLocation ? 
                <>
                    <label className={styles.attachmentLabel} htmlFor='image-attach'>
                        <p>
                            ????????? ?????? ????????? ???????????????! <br />
                            (????????? ??????????????? ???????????? ?????????,<br />
                            ?????? ????????? ???????????????)
                        </p>
                        {
                            imageSrc && <>
                                <img className={styles.previewImage} src={imageSrc} alt='?????? ????????? ????????????' />,
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    imageAttach.current.value = '';
                                    setImageSrc('');
                                    setImg('');
                                }} type='button'><img src='cancel.png' alt='?????? ????????? ?????? ??????' /></button>
                            </>
                        }
                    </label>
                    <input ref={imageAttach} onChange={(e) => {
                        handleImagePreview(e.target.files[0]);
                        setImg(e.target.files[0]);
                        }} className={styles.attachmentInput} id='image-attach' type='file' accept='image/*' />
                    <div className={styles.diaryInfo}>
                        <div className={styles.diaryInfoItems}>{diaryInfo.date}</div>
                        <fieldset className={`${styles.diaryInfoItems} ${styles.weatherRadio}`}>
                            <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' />
                            <label htmlFor='sunny'>???</label>
                            <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                            <label htmlFor='cloudy'>???</label>
                            <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' />
                            <label htmlFor='rainy'>???</label>
                            <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' />
                            <label htmlFor='snowy'>???</label>
                        </fieldset>
                        <select ref={selectedDog} className={styles.infoItem}>
                            <option></option>
                            <option></option>
                            <option></option>
                        </select>
                    </div>
                    <input ref={title} className={`${styles.writingInfo} ${styles.titleInfo}`} type='text' placeholder='????????? ???????????????' maxLength='30' defaultValue={diaryInfo.title} />
                    <textarea ref={content} className={`${styles.writingInfo} ${styles.contentInfo}`} placeholder='????????? ???????????????' maxLength='500' defaultValue={diaryInfo.content}></textarea>

                    <Buttons buttonName={{cancel: '??????' ,submit: '??????'}} cancelLink='/detail-diary' handleFormSubmit={handleFormSubmit}
                    setCheckLocation={setCheckLocation} setBackgroundOpacity={setBackgroundOpacity} />
                </>
                :
                <>
                    <img className={styles.diaryPictures} src={diaryInfo.imageSrc} alt='?????? ??????' />
                    <div className={styles.diaryInfo}>
                        <div className={styles.diaryInfoItems}>{diaryInfo.date}</div>
                        <fieldset className={`${styles.diaryInfoItems} ${styles.weatherRadio}`}>
                            <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' disabled />
                            <label htmlFor='sunny'>???</label>
                            <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' disabled />
                            <label htmlFor='cloudy'>???</label>
                            <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' disabled />
                            <label htmlFor='rainy'>???</label>
                            <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' disabled />
                            <label htmlFor='snowy'>???</label>
                        </fieldset>
                        <div className={styles.diaryInfoItems}>{diaryInfo.dogName}</div>
                    </div>
                    <h3 className={styles.diaryTitle}>{diaryInfo.title}</h3>
                    <p className={styles.diaryContent}>{diaryInfo.content}</p>
                </>
            }
            <CheckMessage checkMessage={checkMessage} setCheckMessage={setCheckMessage} handleShowMessage={handleDiaryDelete}
            option={{ cancel: '??????', submit: '??????' }} />
        </div>
    </section>
    )
}

export default DetailedDiary;