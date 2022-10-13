import React from 'react';

function Notice({ notice, display, noticeIcon }) {
    return (
        <div className='notice' style={{ display: `${display}` }}>
            <img src={noticeIcon} alt='경고 느낌표'></img>
            <p>{notice}</p>
        </div>
    )
}

export default Notice;