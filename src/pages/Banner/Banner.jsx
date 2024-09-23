import React, { useState, useEffect } from 'react';
import styles from './Banner.module.css';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import Loading from '../../component/Loading/Loading';

function Banner() {
  const { user } =  useUserContext();
  const [calendar, setCalendar] = useState([]);
  const [writedDate] = useState('');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // useEffect(() => {
  //   if (loginState === 'true') {
  //     const fetchCalendar = async () => {
  //       try {
  //         // const res = await axios.get(apiUrl + 'calendar', { withCredentials: true })
  //         const data = await res.data;

  //         if (checkCookie(data, false)) {
  //             return;
  //         }

  //         if (data === 'Nothing') {
  //             return;
  //         }

  //         const writedArr = [];

  //         data.forEach((item) => {
  //             const year = parseInt(item.date.slice(0, 4));
  //             const month = parseInt(item.date.slice(5, 7));
  //             const date = parseInt(item.date.slice(8, 10));

  //             if (currentYear === year && (currentMonth + 1) === month) {
  //                 writedArr.push(date);
  //             }
  //             setWritedDate(writedArr);
  //         })
  //       } catch (err) {
  //           console.error(err);
  //       }
  //     }
      
  //     fetchCalendar();
  //   }
  // }, [apiUrl, checkCookie, currentMonth, currentYear, loginState]);

  useEffect(() => {
      const previousLastDate = new Date(currentYear, currentMonth, 0).getDate();
      const currentFirstDay = new Date(currentYear, currentMonth, 1).getDay();
      const currentLastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

      const calendarLength = currentFirstDay === 0 ?
                              // 1일이 일요일부터 시작할 때
                              currentLastDate % 7 === 0 ? 
                                  currentLastDate
                                  :
                                  currentLastDate + (7 - currentLastDate % 7) 
                              :
                              // 1일이 일요일부터 시작하지 않을 때
                              (currentFirstDay + currentLastDate) % 7 === 0 ?
                                  currentFirstDay + currentLastDate
                                  :
                                  currentFirstDay + currentLastDate + (7 - ((currentFirstDay + currentLastDate) % 7))
      const dateArr = new Array(calendarLength);
  
      for (let i = 0; i < calendarLength; i++) {
          const index = Math.floor(i / 7);
          const date = (i + 1) - currentFirstDay;
          const previousDate = previousLastDate - currentFirstDay + (i + 1);
          const num = i < currentFirstDay ? 
            currentMonth === 0 ? `12/${previousDate}` : `${currentMonth}/${previousDate}` 
            :
            date > currentLastDate ?
                currentMonth === 11 ? `1/${date - currentLastDate}` : `${currentMonth + 2}/${date - currentLastDate}`
                :
                date;

          if (dateArr[index] === undefined) {
              dateArr[index] = [num, ]
          } else {
              dateArr[index].push(num)
          }
      }
      setCalendar(dateArr);
  }, [currentMonth, currentYear])

  return (
      <section className={`${styles.section} column`}>
        {
          user &&
              <div>
                  <h2>{ `${currentYear}년 ${currentMonth + 1}월 출석` }</h2>
                  <table className={styles.table}>
                      <thead className={styles.days}>
                          <tr>
                              {
                                  days.map((day) => {
                                      return <th className={styles.th} key={`day-${day}`}>{day}</th>;
                                  })
                              }
                          </tr>
                      </thead>
                      <tbody className={styles.days}>
                          {
                              calendar.map((arr, idx) => {
                                  return <tr className={styles.rows} key={`week-${idx + 1}`}>
                                      {
                                          arr.map((num) => {
                                            const today = new Date();
                                            const todayDate = today.getDate();
                                            const todayClassName = num === todayDate && styles.today;
                                            
                                            return typeof num === 'string' ? 
                                            <td className={`${styles.td} ${styles.otherMonth} ${todayClassName}`} key={`current-${num}`}>&nbsp;{num}</td>
                                            :
                                            <td className={`${styles.td} ${todayClassName}`}  key={`current-${num}`}>{ writedDate.includes(num) ?
                                                <>&nbsp;{num}<img src='/attendance.png' alt={num} /></>
                                                :
                                                <>&nbsp;{num}</>
                                            }</td>
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

