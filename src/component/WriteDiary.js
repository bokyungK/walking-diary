import React from "react";

function WriteDiary() {
    return (
    <main className='over-height'>
        <section className='write-diary'>
            <div className='icon-container'>
                <button className='write-cancel' type='button'><img className='icon-image' src='cancel.png' /></button>
            </div>            
            <form>
                <label className='attachments-box' for='image-attach'>영역을 눌러 사진을 첨부하세요!</label>
                <input className='write-attachments' type='file' id='image-attach'/>
                <div className='diary-info'>
                    <input className='diary-info-item' type='date' id='write-date' />
                    <fieldset className='weather-radio'>
                            <input type='radio' id='sunny' name='weather-radio' value='sunny' />
                            <label for='sunny'>☀</label>
                            <input type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                            <label for='cloudy'>☁</label>
                            <input type='radio' id='rainy'  name='weather-radio' value='rainy' />
                            <label for='rainy'>☂</label>
                            <input type='radio' id='snowy'  name='weather-radio' value='snowy' />
                            <label for='snowy'>☃</label>
                    </fieldset>
                    <select className='diary-info-item write-info-item dog-select'>
                        <option className='dog-option'>인삼이</option>
                        <option className='dog-option'>산삼이</option>
                        <option className='dog-option'>홍삼이</option>
                    </select>
                </div>
                <input className='write-title diary-title' type='text' placeholder='제목을 입력하세요'/>
                <textarea className='write-content diary-content' placeholder='일기를 입력하세요'></textarea>
                <div className='write-buttons'>
                    <button className='write-button cancel-button' type='button'>취소</button>
                    <button className='write-button submit-button' type='submit'>저장</button>
                </div>
            </form>
        </section>
    </main>
    )
}

export default WriteDiary;