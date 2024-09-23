import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../../context/userContext.jsx';
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
  const [order] = useState();
  const handleOrder = () => {};

  useEffect(() => {
    if (user) {
      getDiaries(user.uid);
    }
  }, [user])

  return (
    <section className={`${styles.section} column`}>
      <h2>일기 보관함</h2>
      <div className={styles.orderBox}>
        <select className={styles.orderSelect} onChange={handleOrder} name='sort' value={order}>
          <option>최신 순서</option>
          <option>오래된 순서</option>
          <option>책갈피</option>
        </select>
      </div>
      <ul className={styles.diaryList}>
        {
          diaries && diaries.map((item) => {
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
      {
        !diaries && <span>작성된 일기가 없습니다!</span>
      }
    </section>
  )
}
