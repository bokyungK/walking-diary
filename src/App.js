import { Route } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import Banner from './component/Banner';
import Login from './component/Login';
import Join from './component/Join';
import Mypage from './component/Mypage';
import MyDiary from './component/MyDiary';
import DetailedDiary from './component/DetailedDiary';
import WriteDiary from './component/WriteDiary';

function App() {
  const type = {
    login: '로그인',
    mypage: '마이페이지'
  };

  return (
  <div>
    <Header type={type.login} />
    <main>
      <Route path="/" exact={true} component={Banner} />
      <Route path="/login" component={Login} />
      <Route path="/join" component={Join}/>
      <Route path="/mypage" component={Mypage} />
      <Route path="/mydiary" component={MyDiary} />
      <Route path="/detail-diary" component={DetailedDiary} />
      <Route path="/write-diary" component={WriteDiary} />
    </main>
  </div>
  )
}

export default App;
