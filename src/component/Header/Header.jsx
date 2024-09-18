import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { TfiClose } from "react-icons/tfi";
import { useRecoilValue } from 'recoil';
import { CiMenuBurger } from "react-icons/ci";
import { opacityState } from '../../recoil/Atom';

const INITIAL_MENU = [
  // { name: '로그인', destination: 'login' },
  { name: '일기장', destination: 'diary' },
  { name: '일기 쓰기', destination: 'diary/id' },
  { name: '마이페이지', destination: 'mypage' },
  { name: '알아봅시다! 반려견 산책 매너', destination: 'mypage' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const backgroundOpacity = useRecoilValue(opacityState);
  const handleMenuOpen = () => setIsOpen(true);
  const handleMenuClose = () => setIsOpen(false);

  return (
    <header opacity={backgroundOpacity}>
      <Link className={styles.title} to="/">ㅅㅊ<br />ㅇㄱ</Link>
      <button>
        <CiMenuBurger className={styles.menuIcon} onClick={handleMenuOpen} />
      </button>
      {
        isOpen && 
        <div className={styles.menu}>
          <div className={styles.menuTop}>
            <Link className={styles.login} onClick={handleMenuClose} to={`/login`}>로그인</Link>
            <button className={styles.cancel} onClick={handleMenuClose}>
              <TfiClose />
            </button>
          </div>
          <ul className={styles.menuBottom}>
            {
              INITIAL_MENU.map((item) => {
                const { name, destination } = item;
                return <li>
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
