import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styles from './DetailedDiary.module.css';
import Notice from './Notice';

function DetailedDiary({ notice, noticeIcon, display, diaryInfo, changeNotice, star, handleStarImage } ) {
    const history = useHistory();
    const sunny = useRef();
    const cloudy = useRef();
    const rainy = useRef();
    const snowy = useRef();

    useEffect(() => {
        if (star.starred === diaryInfo.starred) {
            return;
        }
        axios.post('http://localhost:3001/starred', {...star, imageName: diaryInfo.imageName}, { withCredentials: true })
    }, [star, diaryInfo.starred, diaryInfo.imageName]);

    function handleDiaryUpdate() {
        console.log('업데이트');
    }

    function handleDiaryDelete() {
        axios.post('http://localhost:3001/delete-diary', diaryInfo, { withCredentials: true })
        .then(res => {
            const data = res.data;
            if (data === 'Success') {
                changeNotice('삭제되었습니다', 'correct.png', 'flex', '/mydiary');
            }
        })
    }

    useEffect(() => {
        const weathers = [sunny, cloudy, rainy, snowy];
        weathers.forEach((item) => {
            if (item.current.value === diaryInfo.weather) {
                item.current.checked = true;
            } else {
            }
        })
    }, [diaryInfo.weather])

    return (
    <section className={styles.DetailedDiary}>
        <Notice notice={notice} noticeIcon={noticeIcon} display={display} />
        <div className={styles.crudIcon}>
            <button onClick={handleStarImage} className={styles.icons}><img className={styles.iconImages} src={star.src} alt='즐겨찾기 버튼'/></button>
            <button onClick={handleDiaryUpdate} className={styles.icons}><img className={styles.iconImages} src='edit.png' alt='수정 버튼' /></button>
            <button onClick={handleDiaryDelete} className={styles.icons}><img className={styles.iconImages} src='delete.png' alt='삭제 버튼' /></button>
            <button onClick={() => history.push("/mydiary")} className={styles.icons}><img className={styles.iconImages} src='cancel.png' alt='뒤로가기 버튼'/></button>        </div>
        <img className={styles.diaryPictures} src={diaryInfo.imageSrc} alt='일기 사진' />
        <div className={styles.diaryInfo}>
            <div className={styles.diaryInfoItems}>{diaryInfo.date}</div>
            <fieldset className={`${styles.diaryInfoItems} ${styles.weatherRadio}`}>
                <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' disabled />
                <label htmlFor='sunny'>☀</label>
                <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' disabled />
                <label htmlFor='cloudy'>☁</label>
                <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' disabled />
                <label htmlFor='rainy'>☂</label>
                <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' disabled />
                <label htmlFor='snowy'>☃</label>
            </fieldset>
            <div className={styles.diaryInfoItems}>{diaryInfo.dogName}</div>
        </div>
        <h3 className={styles.diaryTitle}>{diaryInfo.title}</h3>
        <p className={styles.diaryContent}>{diaryInfo.content}</p>
    </section>
    )
}

export default DetailedDiary;