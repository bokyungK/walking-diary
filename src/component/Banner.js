import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
var store = require('store');

function Banner({ checkCookie, apiUrl }) {
    const loginState = store.get('loginState');
    const [calendar, setCalendar] = useState([]);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const [writedDate, setWritedDate] = useState('');

    // get current year, month
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();


    useEffect(() => {
        if (loginState === 'true') {
            axios.get(apiUrl + 'calendar', { withCredentials: true })
            .then((res) => {
                const data = res.data;

                if (checkCookie(data, false)) {
                    return;
                }

                if (data === 'Nothing') {
                    return;
                }

                const writedArr = [];

                data.forEach((item) => {
                    const year = parseInt(item.date.slice(0, 4));
                    const month = parseInt(item.date.slice(5, 7));
                    const date = parseInt(item.date.slice(8, 10));

                    if (currentYear === year && (currentMonth + 1) === month) {
                        writedArr.push(date);
                    }
                    setWritedDate(writedArr);
                })
            })
        }
    }, [])

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
                            currentMonth === 0 ? `12/` + `${previousDate}` : `${currentMonth}/` + `${previousDate}` 
                            :
                            date > currentLastDate ?
                                currentMonth === 11 ? `1/` + `${date - currentLastDate}` : `${currentMonth + 2}/` + `${date - currentLastDate}`
                                :
                                date;

            if (dateArr[index] === undefined) {
                dateArr[index] = [num, ]
            } else {
                dateArr[index].push(num)
            }
        }
        setCalendar(dateArr);
    }, [])

    return (
        <Inner>
            {
                loginState === 'true' ?
                    <div>
                        <Title>{ `${currentYear}년 ${currentMonth + 1}월달의 기록` }</Title>
                        <CalendarTable>
                            <thead>
                                <tr>
                                    {
                                        days.map((day) => {
                                            return <TableHeader key={`day-${day}`}>{day}</TableHeader>;
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    calendar.map((arr, idx) => {
                                        return <tr key={`week-${idx + 1}`}>
                                            {
                                                arr.map((num) => { 
                                                    return typeof num === 'string' ? 
                                                    <OtherMonthCell key={`current-${num}`}>&nbsp;{num}</OtherMonthCell>
                                                    :
                                                    <TableCell key={`current-${num}`}>{ writedDate.includes(num) ?
                                                        <>&nbsp;{num}<Attendance/></>
                                                        :
                                                        <>&nbsp;{num}</>
                                                    }</TableCell>
                                                })
                                            }
                                        </tr>;
                                    })
                                }
                            </tbody>
                        </CalendarTable>
                    </div>
                :
                    <Intro>
                    반려견과 함께<br />
                    하루 하루를 기록하는<br />
                    '산책일기'<br />
                    지금 바로 사용해보세요!
                    </Intro>
            }
        </Inner>
    )
  }
  
  export default Banner;


// styled component
const Inner = styled.div`
    height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
`

const Title = styled.h2`
    font-size: 1.7rem;
    text-align: center;
    margin-bottom: 1rem;
    @media only screen and (max-width: 700px) {
        font-size: 1.5rem;
    }
`

const CalendarTable = styled.table`
    min-width: 702px;
    color: white;
    background-color: skyblue;
    border-collapse: collapse;
    border-radius: 30px;
    overflow: hidden;
    @media only screen and (max-width: 700px) {
        min-width: 352px;
    }
`

const TableHeader = styled.th`
    font-size: 1.3rem;
    height: 50px;
    border: 2px solid white;
    @media only screen and (max-width: 700px) {
        font-size: 1rem;
    }
`

  
const TableCell = styled.td`
    position: relative;
    width: 100px;
    height: 100px;
    border: 2px solid white;
    vertical-align: top;
    @media only screen and (max-width: 700px) {
        width: 50px;
        height: 50px;
        font-size: 0.8rem;
    }
`


const OtherMonthCell = styled(TableCell)`
    color: rgba(244, 243, 243, 0.534);
`
  
const Attendance = styled.img.attrs(() => ({
    src: 'attendance.png',
    alt: '출석 도장',
}))`
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50px;
    height: 50px;
    @media only screen and (max-width: 700px) {
        width: 25px;
        height: 25px;
    }
`
  
const Intro = styled.p`
    width: 100%;
    text-align: center;
    line-height: 4rem;
    font-size: 1.8rem;
    color: black;
    @media only screen and (max-width: 700px) {
        font-size: 1.5rem;
    }
`
