import React from 'react';

function Notice({ message, icon, display }) {
    return (
        <div className='notice' style={{ display: display }}>
            <div>
                <img src={icon} alt='경고 느낌표' />
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Notice;