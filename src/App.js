import React, { useState, useEffect, useRef } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import Header from './component/Header.js';
import Banner from './component/Banner.js';
import Login from './component/Login.js';
import Join from './component/Join.js';
import Mypage from './component/Mypage.js';
import MyDiary from './component/MyDiary.js';
import DetailedDiary from './component/DetailedDiary.js';
import WriteDiary from './component/WriteDiary.js';

function App() {
  const history = useHistory();
  const location = useLocation();
  const wrapper = useRef();
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

  useEffect(() => {
    const handleShowHeaderBc = (e) => {
      const browserHeight = e.target.scrollingElement.clientHeight;
      const documentHeight = e.target.scrollingElement.scrollHeight;
      const scrollHeight = documentHeight - browserHeight;
      const scrollPosition = e.target.scrollingElement.scrollTop;

      setBackgroundOpacity((scrollPosition / scrollHeight).toFixed(1));
    }
    window.addEventListener('scroll', handleShowHeaderBc);

    return () => {
    window.removeEventListener('scroll', handleShowHeaderBc);
    };
  }, []);

  const [notice, setNotice] = useState('');
  const [noticeIcon, setNoticeIcon] = useState('warning.png');
  const [display, setDisplay] = useState('none')

  function changeNotice(notice, icon, display, path) {
    setNotice(notice);
    setNoticeIcon(icon);
    setDisplay(display);
    
    if (path === 0) {
      return;
    } else if (path === 1) {
      setTimeout(() => {
        setNotice('');
        setNoticeIcon('');
        setDisplay('none');
      }, 1000);
    } else {
      setTimeout(() => {
        history.push(path);
      }, 1000);
    }
  }

  const [checkMessage, setCheckMessage] = useState({ display: 'none' });

  function checkLogin() {
    const loginState = localStorage.getItem('loginState');
    if (!loginState) {
      changeNotice('로그인 후 사용하세요', 'warning.png', 'flex', "/login");
      return true;
    } else {
      return false;
    }
  }

  function checkCookie(data, path) {
    if (data === 'There is no access_token' || data === 'This is not a valid token') {
      changeNotice('로그인이 만료되었습니다', 'warning.png', 'flex', path);
      localStorage.removeItem('loginState');
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    history.listen(() => {
          if (notice === '') {
            return;
          }
          setNotice('');
          setNoticeIcon('');
          setDisplay('none');
        })
  }, [history, notice])

  const [checkLocation, setCheckLocation] = useState(false);
  useEffect(() => {
    if (location.pathname !== '/detail-diary') {
      setCheckLocation(false);
    }
  }, [checkLocation, setCheckLocation, location.pathname])

  return (
  <div ref={wrapper}>
    <Header backgroundOpacity={backgroundOpacity} />
    <main>
      <Route path="/" exact={true} render={() =>
        <Banner checkCookie={checkCookie} />} />
      <Route path="/login" render={() =>
        <Login changeNotice={changeNotice} notice={notice}
        noticeIcon={noticeIcon} display={display}/>} />
      <Route path="/join" render={() =>
        <Join changeNotice={changeNotice} notice={notice} noticeIcon={noticeIcon} display={display} />} />
      <Route path="/mypage" render={() =>
        <Mypage changeNotice={changeNotice} checkLogin={checkLogin} checkMessage={checkMessage}
        setCheckMessage={setCheckMessage} checkCookie={checkCookie} notice={notice} noticeIcon={noticeIcon}
        display={display} /> } />
      <Route path="/mydiary" render={() =>
        <MyDiary notice={notice} noticeIcon={noticeIcon} display={display} checkLogin={checkLogin}
        checkCookie={checkCookie} />} />
      <Route path="/detail-diary" render={() =>
        <DetailedDiary notice={notice} noticeIcon={noticeIcon} display={display} changeNotice={changeNotice}
        checkLogin={checkLogin} checkLocation={checkLocation} setCheckLocation={setCheckLocation} 
        checkMessage={checkMessage} setCheckMessage={setCheckMessage} checkCookie={checkCookie} /> } />
      <Route path="/write-diary" render={() =>
       <WriteDiary notice={notice} noticeIcon={noticeIcon} display={display} changeNotice={changeNotice}
       checkLogin={checkLogin} checkCookie={checkCookie} />} />
    </main>
  </div>
  )
}

export default App;
