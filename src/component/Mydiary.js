import React from "react";

function Mydiary() {
    return (
    <main className='mydiary'>
        <section className='mydiary-section favorite-section'>
            <h2 className='mydiary-title'>즐겨찾기</h2>
            <ul className='mydiary-favorites'>
                <li className='favorite-item'></li>
                <li className='favorite-item'></li>
                <li className='favorite-item'></li>
            </ul>
        </section>
        <section className='mydiary-section diary-section'>
            <h2 className='mydiary-title'>일기 보관함</h2>
            <select className='sort-selection' name='sort'>
                <option className='sort-option'>정렬 방식</option>
                <option className='sort-option'>최근순서</option>
                <option className='sort-option'>날짜순서</option>
                <option className='sort-option'>강아지</option>
            </select>
            <div className='diary-section-container'>
                <button className='diary-button' type='button'><img className='button-image left-button' src='images/previous.png' /></button>
                <ul className='diary-container'>
                    <li className='diary'></li>
                    <li className='diary'></li>
                    <li className='diary'></li>
                    <li className='diary'></li>
                    <li className='diary'></li>
                    <li className='diary'></li>
                </ul>
                <button className='diary-button' type='button'><img className='button-image right-button' src='images/next.png' /></button>
            </div>
        </section>
    </main>)
}

export default Mydiary;