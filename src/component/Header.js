import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ backgroundOpacity }) {
    const loginState = localStorage.getItem('loginState');
    const backgroundStyle = {
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
    }
    const [menu, setMenu] = React.useState('');
    function handleShowMenu() {
        setMenu(styles.showMenu);
    }
    function handleHiddenMenu() {
        setMenu(' ');
    }

    return (
        <header className={styles.Header} style={backgroundStyle} onMouseOver={handleShowMenu} onMouseLeave={handleHiddenMenu}>
            <h1 className={styles.pageName}><Link to="/">산책 일기</Link></h1>
            <nav className={`${styles.menu} ${menu}`}>
                <ul className={styles.menuContainer}>
                    <li className={styles.menuLi}><Link to="/mydiary">내 일기장</Link></li>
                    <li className={styles.menuLi}><Link to="/write-diary">일기 쓰기</Link></li>
                    <li className={styles.menuLi}><Link to={
                        Boolean(loginState) ? "/mypage" : "/login"
                    } >{Boolean(loginState) ? '마이페이지' : '로그인'}</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;