import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({type}) {
    const [menu, setMenu] = React.useState('');
    function handleShowMenu() {
        setMenu('show-menu');
    }
    function handleHiddenMenu() {
        setMenu('');
    }

    return (
        <header onMouseOver={handleShowMenu} onMouseLeave={handleHiddenMenu}>
            <h1 className='page-name'><Link to="/">산책 일기</Link></h1>
            <nav className={menu}>
                <ul className='menu-container'>
                    <li className ='menu'><Link to="/mydiary">내 일기장</Link></li>
                    <li className ='menu'><Link to="/write-diary">일기 쓰기</Link></li>
                    <li className ='menu'><Link to="/login" >{type}</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;