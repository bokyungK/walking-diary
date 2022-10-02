import React from 'react';

function Login() {
    return (
        <main>
            <div className='login-container'>
                <form className='login-form' method='post'>
                    <div className='input-container'>
                        <div className='input-box'>
                            <label className='input-label' for="login-id">ID</label>
                            <input className='input-info' type='text' id='login-id'/>
                        </div>
                        <div>
                            <label className='input-label' for="login-pw">PW</label>
                            <input className='input-info' type='text' id="login-pw" />
                        </div>
                    </div>
                    <button className="login-button" type="submit">LOGIN</button>
                </form>
                <div className="join">회원가입 하러가기</div>
            </div>
        </main>
    )
}

export default Login;