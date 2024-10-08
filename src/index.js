import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Banner from './pages/Banner/Banner';
import Diaries from './pages/Diaries/Diaries';
import Join from './pages/Join/Join';
import Login from './pages/Login/Login';
import Mypage from './pages/MyPage/MyPage';
import reportWebVitals from './reportWebVitals';
import Diary from './pages/Diary/Diary';
import ProtectedRoute from './component/ProtectedRoute';

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
        path: "/join",
        element: <Join />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/mypage",
        element: <ProtectedRoute>
          <Mypage />
        </ProtectedRoute>,
      },
      {
        path: "/diary",
        element: <ProtectedRoute>
          <Diaries />
        </ProtectedRoute>,
      },
      {
        path: "/diary/:id",
        element: <ProtectedRoute>
          <Diary />
        </ProtectedRoute>,
      },
      {
        path: "/diary/update",
        element: <ProtectedRoute>
          <Diary />
        </ProtectedRoute>,
      },
      {
        path: "/diary/new",
        element: <ProtectedRoute>
          <Diary />
        </ProtectedRoute>,
      },
    ]
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
