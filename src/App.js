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
  const [diaryInfo, setDiaryInfo] = useState({
    date: '',
    weather: '',
    dogName: '',
    title: '',
    content: '',
    imageName: '',
    starred: '',
    imageSrc: '',
  });

  const [star, setStar] = React.useState({
    src: 'empty_star.png',
    starred: '',
 });

 function handleStarImage() {
  if (star.src === 'filled_star.png') {
      setStar({...star, src: 'empty_star.png', starred: ''});
  } else {
      setStar({...star, src: 'filled_star.png', starred: true});
  }
}


  useEffect(() => {
    const handleShowHeaderBc = (e) => {
      const wrapperHeight = wrapper.current.clientHeight;
      const windowHeight = e.currentTarget.innerHeight;
      const scrollHeight = wrapperHeight - windowHeight;
      const scrollPosition = e.currentTarget.scrollY;

      if (scrollPosition / scrollHeight <= 1) {
        setBackgroundOpacity(scrollPosition / scrollHeight);
      } else {
        setBackgroundOpacity(1);
      }
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
         <MyDiary notice={notice} noticeIcon={noticeIcon} display={display} changeNotice={changeNotice} 
         setDiaryInfo={setDiaryInfo} star={star} setStar={setStar} />} />
      <Route path="/detail-diary" render={() =>
         <DetailedDiary diaryInfo={diaryInfo} setDiaryInfo={setDiaryInfo}
         notice={notice} noticeIcon={noticeIcon} display={display} changeNotice={changeNotice}
         star={star} setStar={setStar} handleStarImage={handleStarImage} checkLocation={checkLocation}
         setCheckLocation={setCheckLocation} /> } />
      <Route path="/write-diary" component={WriteDiary} />
    </main>
  </div>
  )
}

export default App;
