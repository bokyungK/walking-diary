import React, { useState } from 'react';

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
            <h1 className='page-name'>산책 일기</h1>
            <nav className={menu}>
                <ul className='menu-container'>
                    <li className ='menu'>내 일기장</li>
                    <li className ='menu'>일기 쓰기</li>
                    <li className ='menu'>{type}</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;