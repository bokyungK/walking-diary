import React, { useState, useEffect, useMemo } from 'react';
import styles from './Banner.module.css';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import { useQuery } from '@tanstack/react-query';
import { getDiaries } from "../../api/firebase.js";
import Loading from '../../component/Loading/Loading';

const DAY_LIST = ['일', '월', '화', '수', '목', '금', '토'];

function Banner() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const { user } =  useUserContext();
  const [writedList, setWritedList] = useState();
  const { data } = useQuery({
    queryKey: ['diaries', user && user.uid],
    queryFn: () => getDiaries(user.uid),
    enabled: Boolean(user && user.uid),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  })

  const getCalendar = useMemo(() => {
    const curtDay = new Date();
    const curMonth = curtDay.getMonth();
    const curYear = curtDay.getFullYear();
    const curDate = curtDay.getDate();
    const lastDate = new Date(curYear, curMonth + 1, 0).getDate();
    const calendarLen = (Math.floor(lastDate / 7) + (lastDate % 7 > 0 ? 1 : 0)) * 7;
    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const calendarList = []

    for (let i = 0; i < calendarLen; i++) {
      if (i < firstDay && i === 0) {
        curtDay.setDate(curtDay.getDate() - curDate - firstDay + 1);
      } else {
        curtDay.setDate(curtDay.getDate() + 1);
      }

      const fullDateObj = {
        curMonth: curtDay.getMonth() + 1,
        curDate: curtDay.getDate()
      }

      if (i % 7 === 0) {
        calendarList.push([fullDateObj])
      } else {
        const listIdx = Math.floor(i / 7);
        calendarList[listIdx].push(fullDateObj);
      }
    }
  
    return calendarList;
  }, [])

  useEffect(() => {
    if (data) {
      setWritedList(data.map((item) => {
        const { time } = item;
        const month = parseInt(time.slice(5, 7));
        const date = parseInt(time.slice(8, 10));
        return `${month}/${date}`;
      }))
    }
  }, [data])

  return (
      <section className={`${styles.section} column`}>
        {
          user &&
          <div>
            <h2>{ `${year}년 ${month + 1}월 출석` }</h2>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  { 
                    DAY_LIST.map((day) => {
                        return <th className={styles.th} key={`day-${day}`}>{day}</th>;
                    })
                  }
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {
                  getCalendar.map((arr, idx) => {
                  return <tr className={styles.rows} key={`week-${idx + 1}`}>
                    {
                      arr.map((item) => {
                        const { curMonth, curDate } = item;
                        const fullDate = `${curMonth}/${curDate}`;
                        const todayClass = curDate === date && styles.today;
                        const otherMonthClass = ((idx === 0 && curDate > 7) || (idx === getCalendar.length - 1 && curDate < 7)) && styles.otherMonth;
                      
                        return <td className={`${styles.td} ${otherMonthClass} ${todayClass}`} key={fullDate}>
                          <span>{curDate}</span>
                          { writedList && writedList.includes(fullDate) && 
                            <img className={styles.attendance} src='/icons/footprint.png' alt={curDate} />
                          }
                        </td>
                      })
                    }
                  </tr>;
                  })
                }
              </tbody>
            </table>
          </div>
        }
        {
          user === null   &&
          <>
            <p className={styles.intro}>
              매일 매일<br />
              <span className={styles.dog}>반려견</span>과 함께<br />
              찍어나가는 <span className={styles.footprint}>발자국</span>
            </p>
            <Link to='/login' className={styles.use}>이용하러가기</Link>
          </>
        }
        {
          user === undefined && <Loading isInSection />  
        }
      </section>
    )
  }
  
  export default Banner;
