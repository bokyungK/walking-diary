import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { TfiClose } from "react-icons/tfi";
import { useRecoilValue } from 'recoil';
import { CiMenuBurger } from "react-icons/ci";
import { opacityState } from '../../recoil/Atom';
import { useUserContext } from '../../context/userContext';
import { logout } from '../../api/firebase';


const INITIAL_MENU = [
  // { name: '로그인', destination: 'login' },
  { name: '일기장', destination: 'diary' },
  { name: '일기 쓰기', destination: 'diary/new' },
  { name: '마이페이지', destination: 'mypage' },
  { name: '산책 매너 배우기', destination: 'mypage' },
  { name: '동반 시설 찾기', destination: 'mypage' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUserContext();
  // const backgroundOpacity = useRecoilValue(opacityState);
  const navigate = useNavigate();

  const handleMenuOpen = () => setIsOpen(true);
  const handleMenuClose = () => setIsOpen(false);
  const handleLogout = () => {
    logout(setUser)
    .then((test) => {
      setIsOpen(false);
      navigate('/');
    });
  };

  return (
    <header className={ isOpen && 'open'}>
      <Link className={styles.title} to="/">ㅅㅊ<br />ㅇㄱ</Link>
      <button>
        <CiMenuBurger className={styles.menuIcon} onClick={handleMenuOpen} />
      </button>
      {
        isOpen && 
        <div className={styles.menu}>
          <div className={styles.menuTop}>
            { user && <button className={styles.login} onClick={handleLogout}>로그아웃</button> }
            { !user && <Link className={styles.login} onClick={handleMenuClose} to={`/login`}>로그인</Link> }
            <button className={styles.cancel} onClick={handleMenuClose}>
              <TfiClose />
            </button>
          </div>
          <ul className={styles.menuBottom}>
            {
              INITIAL_MENU.map((item) => {
                const { name, destination } = item;
                return <li key={name}>
                  <Link onClick={handleMenuClose} to={`/${destination}`}>{name}</Link>
                </li>
              })
            }
          </ul>
        </div>
      }
    </header>
  )
}
