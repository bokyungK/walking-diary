import React, { useState, useEffect } from 'react';
import styles from './Banner.module.css';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import { useQuery } from '@tanstack/react-query';
import { getDiaries } from "../../api/firebase.js";
import Loading from '../../component/Loading/Loading';

const DAY_LIST = ['일', '월', '화', '수', '목', '금', '토'];
const TODAY = new Date();
const YEAR = TODAY.getFullYear();
const MONTH = TODAY.getMonth();
const DATE = TODAY.getDate();

function Banner() {
  const { user } =  useUserContext();
  const [calendar, setCalendar] = useState([]);
  const [writedList, setWritedList] = useState();
  const { data } = useQuery({
    queryKey: ['diaries', user && user.uid],
    queryFn: () => getDiaries(user.uid),
    enabled: Boolean(user && user.uid),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    const lastDate = new Date(YEAR, MONTH + 1, 0).getDate();
    const calendarLen = (Math.floor(lastDate / 7) + (lastDate % 7 > 0 ? 1 : 0)) * 7;
    const firstDay = new Date(YEAR, MONTH, 1).getDay();
    const calendarList = []

    for (let i = 0; i < calendarLen; i++) {
      if (i < firstDay && i === 0) {
        TODAY.setDate(TODAY.getDate() - DATE - firstDay + 1);
      } else {
        TODAY.setDate(TODAY.getDate() + 1);
      }

      const fullDateObj = {
        month: TODAY.getMonth() + 1,
        date: TODAY.getDate()
      }

      if (i % 7 === 0) {
        calendarList.push([fullDateObj])
      } else {
        const listIdx = Math.floor(i / 7);
        calendarList[listIdx].push(fullDateObj);
      }
    }

    setCalendar(calendarList);
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
            <h2>{ `${YEAR}년 ${MONTH + 1}월 출석` }</h2>
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
                  calendar.map((arr, idx) => {
                  return <tr className={styles.rows} key={`week-${idx + 1}`}>
                    {
                      arr.map((item) => {
                        const { month, date } = item;
                        const todayClass = date === DATE && styles.today;
                        const otherMonthClass = ((idx === 0 && date > 7) || (idx === calendar.length - 1 && date < 7)) && styles.otherMonth;
                      
                        return <td className={`${styles.td} ${otherMonthClass} ${todayClass}`} key={`current-${date}`}>
                          <span>{date}</span>
                          { writedList && writedList.includes(`${month}/${date}`) && 
                            <img className={styles.attendance} src='/icons/footprint.png' alt={date} />
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
