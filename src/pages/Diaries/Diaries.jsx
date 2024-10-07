import React, { useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../../context/userContext.jsx';
import { getDiaries } from "../../api/firebase.js";
import styles from './Diaries.module.css';
import Loading from '../../component/Loading/Loading';

export default function Diaries() {
  const { user } = useUserContext();
  const [order, setOrder] = useState('최신 순서');
  const handleOrder = (e) => setOrder(e.target.value)
  const { data, isLoading } = useQuery({
    queryKey: ['diaries', user && user.uid],
    queryFn: () => getDiaries(user.uid),
    enabled: Boolean(user && user.uid),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  })

  const sortedData = useMemo(() => {
    if (!data) return;

    if (order === '최신 순서') {
      return [...data].sort((a, b) => b.timestamp - a.timestamp);
    } else if (order === '오래된 순서') {
      return [...data].sort((a, b) => a.timestamp - b.timestamp);
    } else if (order === '책갈피') {
      return [...data].filter((item) => item.mark === true);
    }
  }, [data, order])

  if (isLoading) return <Loading isInSection />
  return (
    <section className={`${styles.section} column`}>
      {
        data && <>
          <h2>일기 보관함</h2>
          <div className={styles.diaryWrap}>
            <div className={styles.orderBox}>
              <select className={styles.orderSelect} onChange={handleOrder} name='sort' value={order}>
                <option>최신 순서</option>
                <option>오래된 순서</option>
                <option>책갈피</option>
              </select>
            </div>
            <ul className={styles.diaryList}>
              {
                sortedData.map((item) => {
                  const { id, title, dogName, imageUrl } = item;
                  return <Link className={styles.diaryLink} to={`/diary/${id}`} state={item} key={id}>
                    <li className={styles.diaryCard} key={id}>
                      <img className={styles.diaryImage} src={imageUrl} alt='산책 사진'/>
                      <div className={styles.diaryTitleWrap}>
                        <p>{title} with {dogName}</p>
                      </div>
                    </li>
                  </Link>
                })
              }
            </ul>
          </div>
          {
            sortedData.length === 0 && <div className={styles.noFliter}>
              <p>필터링된 일기가 없어요!</p>
            </div>
          }
        </>
        }
        {
          data === null && <>
            <h2 className={styles.h2}>일기 보관함</h2>
            <div className={styles.noDiary}>
              <p>작성된 일기가 없어요!</p>
              <Link to='/diary/new'>일기 쓰러가기</Link>
            </div>
          </>
        }
    </section>
  )
}
