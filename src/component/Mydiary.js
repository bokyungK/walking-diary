import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import styles from './MyDiary.module.css';
import Notice from './Notice';

function MyDiary({ notice, noticeIcon, display, changeNotice }) {
    const history = useHistory();
    const favoriteSlider = useRef();
    const sliderSection = useRef();
    const [dogNames, setDogNames] = useState([]);
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

    function handleOpenDiary(imageName) {
        localStorage.setItem('imageName', imageName);
        history.push('/detail-diary');
    }

    useEffect(() => {
        const loginState = localStorage.getItem('loginState');
        if (!loginState) {
            changeNotice('로그인 후 사용하세요', 'warning.png', 'flex', "/login");
            return;
        }

        const getOrder = localStorage.getItem('order');
        axios.post("http://localhost:3001/diaries", { order: getOrder }, { withCredentials: true })
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
                        dogName: item.dog_name,               
                        title: item.title,
                        imageName: item.image_name,
                        imageSrc: `http://localhost:3001/${item.id}/${item.image_name}`,
                }})
                setFavoriteCards(starredData);
            }

            if (data[1].length > 0) {
                const diaryData = data[1].map((item) => {
                return {
                    date: item.date.slice(0, 10),
                    dogName: item.dog_name,
                    title: item.title,
                    imageName: item.image_name,
                    imageSrc: `http://localhost:3001/${item.id}/${item.image_name}`,
                }})
                setCards(diaryData);
            }
        })

        axios.get('http://localhost:3001/get-dogs', { withCredentials: true })
        .then(res => {
            const data = res.data;
            const clearData = Object.values(data).filter((name) => name !== '');
            setDogNames(clearData);
        })
    }, []);

    // control order

    // useEffect(() => {
    //     const getOrder = localStorage.getItem('order');
    //     if (getOrder) {
    //     }
    // }, [])
    
    const target = useRef();
    function handleOrderSelect(e) {
        const order = e.target.value;
        localStorage.setItem('order', order);

        if (order === '정렬 방식') {
            return;
        }

        axios.post('http://localhost:3001/order', {order: order}, { withCredentials: true })
        .then(res => {
            const data = res.data;
            const dataArr = data.map((item) => {
                return {
                    date: item.date.slice(0, 10),
                    title: item.title,
                    dogName: item.dog_name,
                    imageName: item.image_name,
                    imageSrc: `http://localhost:3001/${item.id}/${item.image_name}`,
                }
            })
            setCards(dataArr);
        })
    }

    // favorite slider
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);

    function startSlider(e) {
        setStartX(e.clientX);
    }

    function moveSlider(e) {
        if (e.screenX === 0) {
            return;
        }
        const previousMoveDist = parseInt(favoriteSlider.current.attributes.movedist.value);
        setCurrentX(previousMoveDist + (e.clientX - startX));
        favoriteSlider.current.style.transform = `translateX(${currentX}px)`;
    }

    function endSlider(e) {
        if (currentX > 0) {
            favoriteSlider.current.style.transform = `translateX(0)`;
            favoriteSlider.current.attributes.movedist.value = 0;
            return
        }
        const sliderSectionWidth = sliderSection.current.clientWidth;
        const favoriteSliderWidth = favoriteSlider.current.clientWidth;
        const subWidth = -(favoriteSliderWidth - sliderSectionWidth);
        if (sliderSectionWidth > favoriteSliderWidth + currentX) {
            favoriteSlider.current.style.transform = `translateX(${subWidth}px)`;
            favoriteSlider.current.attributes.movedist.value = subWidth;
            return;
        }
        favoriteSlider.current.attributes.movedist.value = currentX;
    }

    return (
        <div className={styles.MyDiary}>
            <Notice notice={notice} noticeIcon={noticeIcon} display={display} />
            <section ref={sliderSection} className={`${styles.mydiarySection} ${styles.favoriteSection}`}>
                <h2 className={styles.sectionTitle}>즐겨찾기</h2>
                <ul ref={favoriteSlider} onDragStart={startSlider} onDrag={moveSlider} onDragEnd={endSlider} className={styles.favorites} movedist='0'>
                    {
                        favoriteCards[0].title !== '' ? favoriteCards.map((item) => {
                        return (
                        <li onClick={() => handleOpenDiary(item.imageName)} className={styles.favoriteItem} key={item.imageName}>
                            <img src={item.imageSrc} alt='산책 사진'/>
                            <div>
                                <div>🦴제목🦴 {item.title}</div>
                                <div>🦴날짜🦴 {item.date}</div>
                                <div>with {item.dogName}</div>
                            </div>
                        </li>)}) : <span>즐겨찾기에 등록된 일기가 없습니다!</span>
                    }
                </ul>
            </section>
            <section className={`${styles.mydiarySection} ${styles.diarySection}`}>
                <h2 className={styles.sectionTitle}>일기 보관함</h2>
                <select ref={target} onChange={handleOrderSelect} className={styles.diarySort} name='sort'>
                    <option className={styles.sortOption}>정렬 방식</option>
                    <option className={styles.sortOption}>최신 순서</option>
                    <option className={styles.sortOption}>오래된 순서</option>
                    {
                        dogNames.length > 0 ?
                            dogNames.map(name => {
                                    return <option className={styles.sortOption} key={name}>{name}</option>
                            })
                        :
                            ''
                    }
                </select>
                <div className={styles.diaryContainer}>
                    <ul className={styles.diaries}>
                        {
                            cards[0].title !== '' ? cards.map((item) => {
                            return (
                            <li onClick={() => handleOpenDiary(item.imageName)} className={styles.diary} key={item.imageName}>
                                <img src={item.imageSrc} alt='산책 사진'/>
                                <div>
                                    <div>🦴제목🦴 {item.title}</div>
                                    <div>🦴날짜🦴 {item.date}</div>
                                    <div>with {item.dogName}</div>
                                </div>
                            </li>) }) : <span>작성된 일기가 없습니다!</span>
                        }
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default MyDiary;