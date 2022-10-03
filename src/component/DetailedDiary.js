import React from "react";

function DetailedDiary() {
    return (
    <main>
        <section className='detailed-diary'>
            <div className='diary-crud'>
                <button className='crud-icon'><img className='icon-image' src='edit.png' /></button>
                <button className='crud-icon'><img className='icon-image' src='delete.png' /></button>
                <button className='crud-icon'><img className='icon-image' src='cancel.png' /></button>
            </div>
            <img className='diary-pictures' src='example-image.jpg' />
            <div className='diary-info'>
                <div className='diary-info-item'>날짜</div>
                <div className='diary-info-item'>날씨</div>
                <select className='diary-info-item dog-select' name=''>
                    <option className='dog-option'>인삼이</option>
                    <option className='dog-option'>산삼이</option>
                    <option className='dog-option'>홍삼이</option>
                </select>
            </div>
            <h3 className='diary-title'>시냇가에서...</h3>
            <p className='diary-content'>
                오늘은 인삼이와 하천에서 산책을 했다. 시냇가에서 발을 시원하게 식히기도 하고 돌다리도 건너보며
                재미있고 활동적이었던 하루를 보냈다.
            </p>
        </section>
    </main>
    )
}

export default DetailedDiary;