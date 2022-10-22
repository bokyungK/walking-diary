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
  const [backgroundOpacity, setBackgroundOpacity] = useState('');

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
  const [display, setDisplay] = useState('none');

  function changeNotice(notice, icon, display, path) {
    setNotice(notice);
    setNoticeIcon(icon);
    setDisplay(display);
    
    if (path) {
        setTimeout(() => {
          setNotice('');
          setNoticeIcon('');
          setDisplay('none');
          history.push(path);
        }, 1000);
        return;
    }

    if (path === 0) {
        setTimeout(() => {
            history.go(path);
        }, 1000);
    }
}

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
      <Route path="/" exact={true} component={Banner} />
      <Route path="/login" component={Login} />
      <Route path="/join" component={Join} />
      <Route path="/mypage" component={Mypage} />
      <Route path="/mydiary" render={() =>
         <MyDiary notice={notice} noticeIcon={noticeIcon} display={display} changeNotice={changeNotice} />} />
      <Route path="/detail-diary" render={() =>
         <DetailedDiary notice={notice} noticeIcon={noticeIcon} display={display} changeNotice={changeNotice}
         checkLocation={checkLocation} setCheckLocation={setCheckLocation} /> } />
      <Route path="/write-diary" component={WriteDiary} />
    </main>
  </div>
  )
}

export default App;
