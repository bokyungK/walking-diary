import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../../context/userContext.jsx';
import Notice from '../../component/Notice.jsx';
import styles from './Diaries.module.css';
import { getDiaries } from "../../api/firebase.js";

export default function Diaries() {
  const { user } = useUserContext();
  const { data: diaries } = useQuery({
    queryKey: ['diaries', user && user.uid],
    queryFn: () => getDiaries(user.uid),
    enabled: Boolean(user && user.uid),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  })

  // 여기 작업 필요
  const [order, setOrder] = useState();
  const handleOrder = () => {};

  useEffect(() => {
    // tanstack query로 교체
    if (user) {
      console.log('데이터 가져오기')
      getDiaries(user.uid);
    }
  }, [user])

  return (
    <section className={`${styles.diary} column`}>
      <Notice />
      {/* <section className={`${styles.bookmark} column`} ref={sliderSection}>
        <h2>책갈피</h2>
        <ul className={styles.bookmarkList}
          ref={favoriteSlider} onDragStart={startSlider} onDrag={moveSlider} onDragEnd={endSlider} data-movedist='0'
            onTouchStart={startTouchSlider} onTouchMove={moveTouchSlider} onTouchEnd={endSlider}>
            {
              favoriteCards.length > 0 && favoriteCards.map((item) => {
              return (
              <li className={styles.bookmarkCard} onClick={() => handleOpenDiary(item.imageName)} key={item.imageName}>
                <Link>
                  <img src={item.imageSrc} alt='산책 사진' />
                  <div>
                      <div>🦴제목🦴 {item.title}</div>
                      <div>🦴날짜🦴 {item.date}</div>
                      <div>with {item.dogName}</div>
                  </div>
                </Link>
              </li>)})
            }
        </ul>
        {
          favoriteCards.length <= 0 && <span>책갈피가 꽂혀있는 일기가 없어요!</span>
        }
      </section> */}
      <section className={`${styles.diaryBox} column`}>
        <h2>일기 보관함</h2>
        <div className={styles.orderBox}>
          <select className={styles.orderSelect} onChange={handleOrder} name='sort' value={order}>
            <option>최신 순서</option>
            <option>오래된 순서</option>
            <option>책갈피</option>
            {/* {
              dogNames.length > 0 && dogNames.map(name => {
                return <option key={name}>{name}</option>
              })
            } */}
          </select>
        </div>
        <ul className={styles.diaryList}>
          {
            diaries && diaries.map((item) => {
              const { id, title, dog, imageUrl } = item;

              return <Link className={styles.diaryLink} to={`/diary/${id}`} state={item}>
                <li className={styles.diaryCard} key={id}>
                  <img className={styles.diaryImage} src={imageUrl} alt='산책 사진'/>
                  <div className={styles.diaryTitleWrap}>
                    <p>{title} with {dog}</p>
                  </div>
                </li>
              </Link>
            })
          }
          {
            !diaries && <span>작성된 일기가 없습니다!</span>
          }
        </ul>
      </section>
    </section>
  )
}
