import './App.css';
import Header from './component/Header';
import Banner from './component/Banner';
import Login from './component/Login';
import Join from './component/Join';
import Mypage from './component/Mypage';
import Mydiary from './component/Mydiary';
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
      {/* <Banner />
      <Login />
      <Join />
      <Mypage />
      <Mydiary />
      <DetailedDiary /> */}
      <WriteDiary />
    </div>
  );
}

export default App;
