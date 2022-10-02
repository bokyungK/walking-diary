import './App.css';
import Header from './component/Header';
import Main from './component/Main'

function App() {
  const type = {
    login: '로그인',
    mypage: '마이페이지'
  };

  return (
    <div>
      <Header type={type.login} />
      <Main />
    </div>
  );
}

export default App;
