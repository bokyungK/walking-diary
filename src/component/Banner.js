import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from './Banner.module.css'

function Banner() {
    const loginState = localStorage.getItem('loginState');
    const [calender, setCalender] = useState([]);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const [writedDate, setWritedDate] = useState('');

    // get current year, month
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;


    useEffect(() => {
        if (loginState) {
            axios.get('http://localhost:3001/calender', { withCredentials: true })
            .then((res) => {
                // 아무 일기도 작성하지 않았을 경우 처리
                const data = res.data;
                const writedArr = [];

                data.forEach((item) => {
                    const year = parseInt(item.date.slice(0, 4));
                    const month = parseInt(item.date.slice(5, 7));
                    const date = parseInt(item.date.slice(8, 10));

                    if (currentYear === year && currentMonth === month) {
                        writedArr.push(date);
                    }
                    setWritedDate(writedArr);
                })
            })
        }
    }, [])

    useEffect(() => {

        // get last date from this month
        const previousLastDate = new Date(currentYear, currentMonth - 1, 0).getDate();
        const currentFirstDay = new Date(currentYear, currentMonth - 1, 0).getDay() + 1;
        const currentLastDate = new Date(currentYear, currentMonth, 0).getDate();
        const dateArr = [];

        for (let i = 0; i < currentLastDate + currentFirstDay; i++) {
            const index = Math.floor(i / 7);
            const date = (i + 1) - currentFirstDay;
            const previousDate = previousLastDate - currentFirstDay + (i + 1);
            const num = date > 0  ? date : previousDate;

            if (dateArr[index] === undefined) {
                dateArr[index] = [num, ]
            } else {
                dateArr[index].push(num)
            }
        }
        
        setCalender(dateArr);
    }, [])

    return (
        <div className={styles.Banner}>
            {
                loginState ?
                    <div>
                        <h2>{ `${currentYear}년 ${currentMonth}월달의 기록` }</h2>
                        <table>
                            <thead>
                                <tr>
                                    {
                                        days.map((day) => {
                                            return <th key={`day-${day}`}>{day}</th>;
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    calender.map((arr, idx) => {
                                        return <tr key={`week-${idx + 1}`}>
                                            {
                                                arr.map((num) => {
                                                    return <td key={`current-${num}`}>{
                                                        writedDate.includes(num) ?
                                                            <>{num}<img className={styles.attendance} src='attendance.png' alt='출석 도장'/></>
                                                        :
                                                            num
                                                        }</td>
                                                })
                                            }
                                        </tr>;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                :
                    <p className={styles.intro}>
                    반려견과 함께<br />
                    하루 하루를 기록하는<br />
                    '산책일기'<br />
                    지금 바로 사용해보세요!
                    </p>
            }
        </div>
    )
  }
  
  export default Banner;