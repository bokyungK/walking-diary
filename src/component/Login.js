import React from 'react';
import { Link } from 'react-router-dom';

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
                <div className="join"><Link to="/join">회원가입 하러가기</Link></div>
            </div>
        </main>
    )
}

export default Login;