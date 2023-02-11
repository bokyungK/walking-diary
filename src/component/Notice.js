import React from 'react';
import { useRecoilValue  } from 'recoil';
import { noticeState, noticeIconState, displayState } from '../recoil/Atom'

function Notice() {
    const notice = useRecoilValue(noticeState);
    const noticeIcon = useRecoilValue(noticeIconState);
    const display = useRecoilValue(displayState);
    
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