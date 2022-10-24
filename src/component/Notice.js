import React from 'react';

function Notice({ notice, noticeIcon, display }) {
    return (
        <div className='notice' style={{ display: display }}>
            <div>
                <img src={noticeIcon} alt='경고 느낌표' />
                <p>{notice}</p>
            </div>
        </div>
    )
}

export default Notice;