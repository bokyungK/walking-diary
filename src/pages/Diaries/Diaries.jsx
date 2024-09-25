import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../../context/userContext.jsx';
import { getDiaries } from "../../api/firebase.js";
import styles from './Diaries.module.css';
import Loading from '../../component/Loading/Loading';

export default function Diaries() {
  const { user } = useUserContext();
  const { data, isLoading } = useQuery({
    queryKey: ['diaries', user && user.uid],
    queryFn: () => getDiaries(user.uid),
    enabled: Boolean(user && user.uid),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  })
  const [diaries, setDiaries] = useState();
  const [order, setOrder] = useState('최신 순서');
  const handleOrder = (e) => setOrder(e.target.value)

  useEffect(() => {
    if (data) {
      setDiaries(() => {
        if (order === '최신 순서') {
          return [...data].sort((a, b) => b.timestamp - a.timestamp);
        } else if (order === '오래된 순서') {
          return [...data].sort((a, b) => a.timestamp - b.timestamp);
        } else if (order === '책갈피') {
          return [...data].filter((item) => item.mark === true);
        } 
      })
    }
  }, [order, data])

  useEffect(() => {
    if (user) {
      getDiaries(user.uid);
    }
  }, [user])

  if (isLoading || diaries === undefined) return <Loading isInSection />
  return (
    <section className={`${styles.section} column`}>
      <h2>일기 보관함</h2>
      <div className={styles.diaryWrap}>
        {
          diaries && <>
            <div className={styles.orderBox}>
              <select className={styles.orderSelect} onChange={handleOrder} name='sort' value={order}>
                <option>최신 순서</option>
                <option>오래된 순서</option>
                <option>책갈피</option>
              </select>
            </div>
            <ul className={styles.diaryList}>
              {
                diaries.map((item) => {
                  const { id, title, dog, imageUrl } = item;
                  return <Link className={styles.diaryLink} to={`/diary/${id}`} state={item} key={id}>
                    <li className={styles.diaryCard} key={id}>
                      <img className={styles.diaryImage} src={imageUrl} alt='산책 사진'/>
                      <div className={styles.diaryTitleWrap}>
                        <p>{title} with {dog}</p>
                      </div>
                    </li>
                  </Link>
                })
              }
            </ul>
          </>
        }
      </div>
      {
        !diaries && <div className={styles.noDiary}>
          <p>작성된 일기가 없어요!</p>
          <Link to='/diary/new'>일기 쓰러가기</Link>
        </div>
      }
    </section>
  )
}
