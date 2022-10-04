import React from "react";

function Mypage() {
    return (
    <main>
        <div className='info-container'>
            <h2 className='info-title'>마이페이지</h2>
            <form className='info-form'>
                <div className='form-section'>
                    <div className='form-item'>
                        <label className='form-label'>이름</label>
                        <input className='form-input' disabled></input>
                    </div>
                    <div className='form-item'>                       
                        <label className='form-label'>아이디</label>
                        <input className='form-input' disabled></input>
                    </div>
                    <div className='form-item'>
                        <label className='form-label'>비밀번호</label>
                        <input className='form-input'></input>
                    </div>
                    <div className='form-item'>
                        <label className='form-label'>반려견 이름</label>
                        <input className='form-input'></input>
                    </div>
                </div>
                <div className='button-container'>
                    <button className='buttons'>
                        <img src='button.png'/>
                        <div>취소</div>
                    </button>
                    <button className='buttons' type='submit' value='가입'>
                        <img src='button.png'/>
                        <div>변경</div>
                    </button>
                </div>
            </form>
        </div>
    </main>
    )
}

export default Mypage;