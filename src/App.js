import React, { useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';
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
  const [loginState, setLoginState] = React.useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = React.useState('');
  const wrapper = useRef();

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

  return (
  <div ref={wrapper}>
    <Header backgroundOpacity={backgroundOpacity} loginState={loginState} />
    <main>
      <Route path="/" exact={true} component={Banner} />
      <Route path="/login" render={() => <Login setLoginState={setLoginState} />} />
      <Route path="/join" component={Join} />
      <Route path="/mypage" component={Mypage} />
      <Route path="/mydiary" component={MyDiary} />
      <Route path="/detail-diary" component={DetailedDiary} />
      <Route path="/write-diary" component={WriteDiary} />
    </main>
  </div>
  )
}

export default App;
