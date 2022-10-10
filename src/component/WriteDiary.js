import React, { useRef } from "react";
import Buttons from "./Buttons";
import styles from "./WriteDiary.module.css";

function WriteDiary() {
    const buttonName = {
        cancel: '취소',
        submit: '저장'
    }
    const cancelLink = {
        path: '/MyDiary'
    }
    const dateInput = useRef();
    dateInput.value = new Date().toISOString().slice(0, 10);
    
    
    return (
        <section className={styles.WriteDiary}>    
            <form>
                <label className={styles.attachmentLabel} htmlFor='image-attach'>영역을 눌러 사진을 첨부하세요!</label>
                <input className={styles.attachmentInput} type='file' id='image-attach'/>
                <div className={styles.diaryInfo}>
                    <input ref={dateInput} className={styles.infoItem} type='date' value={dateInput.value} disabled />
                    <fieldset className={`${styles.infoItem} ${styles.weatherRadio}`}>
                            <input type='radio' id='sunny' name='weather-radio' value='sunny' />
                            <label htmlFor='sunny'>☀</label>
                            <input type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                            <label htmlFor='cloudy'>☁</label>
                            <input type='radio' id='rainy'  name='weather-radio' value='rainy' />
                            <label htmlFor='rainy'>☂</label>
                            <input type='radio' id='snowy'  name='weather-radio' value='snowy' />
                            <label htmlFor='snowy'>☃</label>
                    </fieldset>
                    <select className={styles.infoItem}>
                        <option>인삼이</option>
                        <option>산삼이</option>
                        <option>홍삼이</option>
                    </select>
                </div>
                <input className={`${styles.writingInfo} ${styles.titleInfo}`} type='text' placeholder='제목을 입력하세요'/>
                <textarea className={`${styles.writingInfo} ${styles.contentInfo}`} placeholder='일기를 입력하세요'></textarea>
                <Buttons buttonName={buttonName} cancelLink={cancelLink} />
            </form>
        </section>
    )
}

export default WriteDiary;