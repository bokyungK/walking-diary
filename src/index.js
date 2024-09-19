import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Banner from './pages/Banner/Banner';
import MyDiary from './pages/MyDiary/MyDiary';
import WriteDiary from './pages/WriteDiary/WriteDiary';
import DetailedDiary from './pages/DetailDiary/DetailDiary';
import Join from './pages/Join/Join';
import Login from './pages/Login/Login';
import Mypage from './pages/MyPage/MyPage';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: "/",
        element: <Banner />,
      },
      {
        path: "/diary",
        element: <MyDiary />,
      },
      {
        path: "/diary/id",
        element: <DetailedDiary />,
      },
      // {
      //   path: "/diary/id",
      //   element: <WriteDiary />,
      // },
      {
        path: "/join",
        element: <Join />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/mypage",
        element: <Mypage />,
      },
    ]
  },
  {

  }
]);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);

reportWebVitals();
