import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import Notice from './Notice.js';
import styled, { css } from "styled-components";
import { useRecoilValue } from 'recoil';
import { apiUrlState } from '../recoil/Atom';
var store = require('store');


function MyDiary({ checkLogin, checkCookie }) {
    const apiUrl = useRecoilValue(apiUrlState);

    const history = useHistory();
    const favoriteSlider = useRef();
    const sliderSection = useRef();
    const getOrder = store.get('order');
    
    const [order, setOrder] = useState(getOrder);
    const [dogNames, setDogNames] = useState([]);
    const [cards, setCards] = useState([]);
    const [favoriteCards, setFavoriteCards] = useState([]);

    function handleOpenDiary(imageName) {
        store.set('imageName', imageName);
        history.push('/detail-diary');
    }

    useEffect(() => {
        if (checkLogin()) {
            return;
        }

        axios.post(apiUrl + "diaries", { order: getOrder }, { withCredentials: true })
        .then(res => {
            const data = res.data;

            if (checkCookie(data, '/login')) {
                return;
            }

            if (data[0] !== 'Nothing') {
                // favorite cards
                const starredData = [];
                data[0].forEach((item) => {
                    if (item.starred === 1) {
                        starredData.push({
                            date: item.date.slice(0, 10),
                            dogName: item.dog_name,               
                            title: item.title,
                            imageName: item.image_name,
                            imageSrc: apiUrl + `${item.id}/${item.image_name}`
                        })
                    }
                })
                setFavoriteCards(starredData);
            }

            if (data[1] !== 'Nothing') {
                // cards
                const diaryData = data[1].map((item) => {
                    return {
                        date: item.date.slice(0, 10),
                        dogName: item.dog_name,
                        title: item.title,
                        imageName: item.image_name,
                        imageSrc: apiUrl + `${item.id}/${item.image_name}`,
                    }})
                setCards(diaryData);
            }
        })

        axios.get(apiUrl + 'get-dogs', { withCredentials: true })
        .then(res => {
            const data = res.data;
            const clearData = Object.values(data).filter((name) => name !== '');
            setDogNames(clearData);
        })
    }, []);

    // control order
    function handleOrderSelect(e) {
        const order = e.target.value;
        setOrder(order);

        if (order === '정렬 방식') {
            return;
        }

        store.set('order', order);

        axios.post(apiUrl + 'order', { order: order }, { withCredentials: true })
        .then(res => {
            const data = res.data;
            
            if (checkCookie(data, '/login')) {
                return;
            }

            if (data === 'Nothing') {
                setCards([]);
            } else {
                const dataArr = data.map((item) => {
                    return {
                        date: item.date.slice(0, 10),
                        title: item.title,
                        dogName: item.dog_name,
                        imageName: item.image_name,
                        imageSrc: apiUrl + `${item.id}/${item.image_name}`,
                    }
                })
                setCards(dataArr);
            }
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
        const previousMoveDist = parseInt(favoriteSlider.current.attributes[0].value);
        setCurrentX(previousMoveDist + (e.clientX - startX));
        favoriteSlider.current.style.transform = `translateX(${currentX}px)`;
    }

    function endSlider(e) {
        const sliderSectionWidth = sliderSection.current.clientWidth;
        const favoriteSliderWidth = favoriteSlider.current.clientWidth;
        if (currentX > 0) {
            favoriteSlider.current.style.transform = `translateX(0)`;
            favoriteSlider.current.attributes[0].value = 0;
            return
        }

        const subWidth = -(favoriteSliderWidth - sliderSectionWidth);
        if (sliderSectionWidth > favoriteSliderWidth + currentX) {
            if (sliderSectionWidth >= favoriteSliderWidth) {
                favoriteSlider.current.style.transform = `translateX(0)`;
                favoriteSlider.current.attributes[0].value = 0;
                return
            }
            favoriteSlider.current.style.transform = `translateX(${subWidth}px)`;
            favoriteSlider.current.attributes[0].value = subWidth;
        }
        favoriteSlider.current.attributes[0].value = currentX;
    }

    // show more data when scrolling
    useEffect(() => {
        const showMoreData = (e) => {
          const browserHeight = e.target.scrollingElement.clientHeight;
          const documentHeight = e.target.scrollingElement.scrollHeight;
          const scrollHeight = documentHeight - browserHeight;
          const scrollPosition = e.target.scrollingElement.scrollTop;
            
          if (scrollHeight === scrollPosition) {
            const length = cards.length;
            const share = length / 9; // 몫

            if (length % 9 === 0) {
                axios.post(apiUrl + 'more-diaries', { share: share, order: getOrder }, { withCredentials: true })
                .then(res => {
                    const data = res.data;

                    if (checkCookie(data, '/login')) {
                        return;
                    }
                    
                    if (data === 'Nothing') {
                        return;
                    }

                    const diaryData = data.map((item) => {
                        return {
                            date: item.date.slice(0, 10),
                            dogName: item.dog_name,
                            title: item.title,
                            imageName: item.image_name,
                            imageSrc: apiUrl + `${item.id}/${item.image_name}`,
                        }})
                    setCards([...cards].concat(diaryData));
                })
            }
          }
        }
        
        window.addEventListener('scroll', showMoreData);
    
        return () => {
        window.removeEventListener('scroll', showMoreData);
        };
      }, [cards]);

    return (
        <Inner>
            <Notice />
            <FavoriteSection ref={sliderSection}>
                <SectionTitle>즐겨찾기</SectionTitle>
                <FavoriteList
                 ref={favoriteSlider} onDragStart={startSlider} onDrag={moveSlider} onDragEnd={endSlider} data-movedist='0'>
                    {
                        favoriteCards.length > 0 ? favoriteCards.map((item) => {
                        return (
                        <FavoriteCard onClick={() => handleOpenDiary(item.imageName)} key={item.imageName}>
                            <img src={item.imageSrc} alt='산책 사진' />
                            <div>
                                <div>🦴제목🦴 {item.title}</div>
                                <div>🦴날짜🦴 {item.date}</div>
                                <div>with {item.dogName}</div>
                            </div>
                        </FavoriteCard>)}) : <span>즐겨찾기에 등록된 일기가 없습니다!</span>
                    }
                </FavoriteList>
            </FavoriteSection>
            <DiarySection>
                <SectionTitle>일기 보관함</SectionTitle>
                <Sort onChange={handleOrderSelect} name='sort' value={order}>
                    <option>정렬 방식</option>
                    <option>최신 순서</option>
                    <option>오래된 순서</option>
                    {
                        dogNames.length > 0 ?
                            dogNames.map(name => {
                                    return <option key={name}>{name}</option>
                            })
                        :
                            ''
                    }
                </Sort>
                <DiaryContainer>
                    <DiaryList>
                        {
                            cards.length > 0 ? cards.map((item) => {
                            return (
                            <DiaryCard onClick={() => handleOpenDiary(item.imageName)} key={item.imageName}>
                                <img src={item.imageSrc} alt='산책 사진'/>
                                <div>
                                    <div>🦴제목🦴 {item.title}</div>
                                    <div>🦴날짜🦴 {item.date}</div>
                                    <div>with {item.dogName}</div>
                                </div>
                            </DiaryCard>) }) : <span>작성된 일기가 없습니다!</span>
                        }
                    </DiaryList>
                </DiaryContainer>
            </DiarySection>
        </Inner>
    )
}

export default MyDiary;


// styled component
const Inner = styled.div`
    width: 100%;
    overflow: hidden;
    padding: 0 1rem;
    @media only screen and (hover: none) and (pointer: coarse) {
        margin-top: 80px;
    }
`

const MydiarySection = css`
    width: 932px;
    margin: 0 auto;
    overflow: hidden;
    @media only screen and (max-width: 631px) {
        max-width: 300px;
    }
    @media only screen and (min-width: 632px) and (max-width: 932px) {
        max-width: 632px;
    }
`

const FavoriteSection = styled.section`
    ${MydiarySection}
    margin-bottom: 3rem;
`

const SectionTitle = styled.h2`
    margin-bottom: 1rem;
    @media only screen and (hover: none) and (pointer: coarse) and (max-width: 631px) {
        font-size: 1.3rem;
    }
`

const FavoriteList = styled.ul`
    display: flex;
    list-style: none;
`

const CardInfo = css`
    width: 207px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
    border: #997000 solid 3px;
    border-radius: 10px;
    margin-bottom: 1rem;
    overflow: hidden;
    padding: 0 1rem;
    z-index: 1;
`

const FavoriteCard = styled.li`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-basis: 300px;
    min-width: 300px;
    height: 300px;
    background-color: skyblue;
    border-radius: 30px;
    margin-bottom: 1rem;
    margin-right: 1rem;
    overflow: hidden;

    &:hover {
        cursor: pointer;
    }

    &:not(:nth-child(3n)) {
        margin-right: 1rem;
    }

    > img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    > div {
        ${CardInfo}

        div {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        > div:nth-child(3) {
            text-align: center;
        }
    }
`

const DiarySection = styled.section`
    ${MydiarySection}
    margin-bottom: 3rem;
`

const Sort = styled.select`
    width: max-content;
    height: 30px;
    margin-bottom: 1rem;
    font-weight: bold;
    color: rgb(103, 103, 103);
    border: rgb(103, 103, 103) solid 3px;
    outline: none;

    > option {
        font-weight: bold;        
    }
`

const DiaryContainer = styled.div`
    display: flex;
    position: relative;
`

const DiaryList = styled.ul`
    display: flex;
    list-style: none;
    flex-wrap: wrap;
    align-items: flex-end;
`

const DiaryCard = styled.li`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-width: 300px;
    height: 300px;
    background-color: skyblue;
    border-radius: 30px;
    margin-bottom: 1rem;
    overflow: hidden;

    &:hover {
        cursor: pointer;       
    }

    &:not(:nth-child(3n)) {
        margin-right: 1rem;
    }


    @media only screen and (max-width: 930px) {
        margin-right: 1rem;
    }
    

    > img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    > div {
        ${CardInfo}

        > div {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        > div:nth-child(3) {
            text-align: center;           
        }
    }
`
