import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import styles from './MyDiary.module.css';
import Notice from './Notice';

function MyDiary({ notice, noticeIcon, display, changeNotice, setDiaryInfo, star, setStar }) {
    const history = useHistory();
    const [cards, setCards] = useState([{
        title: '',
        date: '',
        dogName: '',
    }]);
    const [favoriteCards, setFavoriteCards] = useState([{
        title: '',
        date: '',
        dogName: '',
    }]);

    function handleOpenDiary(diaryInfo) {
        if (diaryInfo.starred === 'true') {
            setStar({...star, src: 'filled_star.png', starred: 'true'});
        } else {
            setStar({...star, src: 'empty_star.png', starred: 'false'});
        }
        setDiaryInfo(diaryInfo);
        history.push('/detail-diary');
    }

useEffect(() => {
    const loginState = localStorage.getItem('loginState');
    if (!loginState) {
        changeNotice('로그인 후 사용하세요', 'warning.png', 'flex', "/login");
        return;
    }

    axios.get("http://localhost:3001/diary", { withCredentials: true })
    .then(res => {
        const data = res.data;
        if (data === 'There is no access_token' || data === 'This is not a valid token') {
            changeNotice('로그인이 만료되었습니다', 'warning.png', 'flex', "/login");
            return;
        }
        if (data[0] !== '') {
            const starredData = data[0].map((item) => {
                return { 
                    date: item.date.slice(0, 10),
                    weather: item.weather,
                    dogName: item.dog_name,               
                    title: item.title,
                    content: item.content,
                    imageName: item.image_name,
                    starred: item.starred,
                    imageSrc: `http://localhost:3001/${item.id}/${item.image_name}`,
            }})
            setFavoriteCards(starredData);
        }
        if (data[1].length > 0) {
            const diaryData = data[1].map((item) => {
                return { 
                    date: item.date.slice(0, 10),
                    weather: item.weather,
                    dogName: item.dog_name,               
                    title: item.title,
                    content: item.content,
                    imageName: item.image_name,
                    starred: item.starred,
                    imageSrc: `http://localhost:3001/${item.id}/${item.image_name}`,
            }})
            setCards(diaryData);
        }
    })
}, [changeNotice]);

    return (
        <div className={styles.MyDiary}>
            <Notice notice={notice} noticeIcon={noticeIcon} display={display} />
            <section className={`${styles.mydiarySection} ${styles.favoriteSection}`}>
                <h2 className={styles.sectionTitle}>즐겨찾기</h2>
                <ul className={styles.favorites}>
                    {
                        favoriteCards[0].title !== '' ? favoriteCards.map((item) => {
                        return (
                        <li onClick={() => {
                            handleOpenDiary({
                                date: item.date,
                                weather: item.weather,
                                dogName: item.dogName,
                                title: item.title,
                                content: item.content,
                                imageName: item.imageName,
                                starred: item.starred,
                                imageSrc: item.imageSrc,
                            })}} className={styles.favoriteItem}>
                            <img src={item.imageSrc} alt='산책 사진'/>
                            <div>
                                <div>🦴제목🦴 {item.title}</div>
                                <div>🦴날짜🦴 {item.date}</div>
                                <div>with {item.dogName}</div>
                            </div>
                        </li>) }) : <span>즐겨찾기에 등록된 일기가 없습니다!</span>
                    }
                </ul>
            </section>
            <section className={`${styles.mydiarySection} ${styles.diarySection}`}>
                <h2 className={styles.sectionTitle}>일기 보관함</h2>
                <select className={styles.diarySort} name='sort'>
                    <option className={styles.sortOption}>정렬 방식</option>
                    <option className={styles.sortOption}>최근순서</option>
                    <option className={styles.sortOption}>날짜순서</option>
                    <option className={styles.sortOption}>강아지</option>
                </select>
                <div className={styles.diaryContainer}>
                    <ul className={styles.diaries}>
                        {
                            cards[0].title !== '' ? cards.map((item) => {
                            return (
                            <li onClick={() => {
                                handleOpenDiary({
                                    date: item.date,
                                    weather: item.weather,
                                    dogName: item.dogName,
                                    title: item.title,
                                    content: item.content,
                                    imageName: item.imageName,
                                    starred: item.starred,
                                    imageSrc: item.imageSrc,
                                })}} className={styles.diary}>
                                <img src={item.imageSrc} alt='산책 사진'/>
                                <div>
                                    <div>🦴제목🦴 {item.title}</div>
                                    <div>🦴날짜🦴 {item.date}</div>
                                    <div>with {item.dogName}</div>
                                </div>
                            </li>) }) : <span>작성된 일기가 없습니다!</span>
                        }
                    </ul>
                    {/* <button className={`${styles.diaryButton} ${styles.leftButton}`} type='button'>
                        <img className={styles.buttonImage} src='images/previous.png' />
                    </button>
                    <button className={`${styles.diaryButton} ${styles.rightButton}`} type='button'>
                        <img className={styles.buttonImage} src='images/next.png' />
                    </button> */}
                </div>
            </section>
        </div>
    )
}

export default MyDiary;