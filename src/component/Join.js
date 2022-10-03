import React from 'react';

function Join() {
    return (
    <main>
        <div className='info-container'>
            <h2 className='info-title'>회원가입</h2>
            <form className='info-form'>
                <div className='form-section'>
                    <div className='form-item'>
                        <label className='form-label'>ID</label>
                        <input className='form-input'></input>
                    </div>
                    <div className='form-item'>                       
                        <label className='form-label'>PW</label>
                        <input className='form-input'></input>
                    </div>
                    <div className='form-item'>
                        <label className='form-label'>이름</label>
                        <input className='form-input'></input>
                    </div>
                    <div className='form-item'>
                        <label className='form-label'>반려견 이름</label>
                        <input className='form-input'></input>
                    </div>
                </div>
                <div className='button-container'>
                    <button className='form-button cancel-button'>취소</button>
                    <input className='form-button submit-button' type='submit' value='가입'></input>
                </div>
            </form>
        </div>
    </main>
    )
}

export default Join;