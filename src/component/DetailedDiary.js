import React from 'react';
import styles from './DetailedDiary.module.css';

function DetailedDiary() {
    return (
    <section className={styles.DetailedDiary}>
        <div className={styles.crudIcon}>
            <button className={styles.icons}><img className={styles.iconImages} src='edit.png' /></button>
            <button className={styles.icons}><img className={styles.iconImages} src='delete.png' /></button>
            <button className={styles.icons}><img className={styles.iconImages} src='cancel.png' /></button>
        </div>
        <img className={styles.diaryPictures} src='example-image.jpg' />
        <div className={styles.diaryInfo}>
            <div className={styles.diaryInfoItems}>날짜</div>
            <div className={styles.diaryInfoItems}>날씨</div>
            <select className={`${styles.diaryInfoItems} ${styles.diaryTitle}`}>
                <option>인삼이</option>
                <option>산삼이</option>
                <option>홍삼이</option>
            </select>
        </div>
        <h3 className={styles.diaryTitle}>시냇가에서...</h3>
        <p className={styles.diaryContent}>
            오늘은 인삼이와 하천에서 산책을 했다. 시냇가에서 발을 시원하게 식히기도 하고 돌다리도 건너보며
            재미있고 활동적이었던 하루를 보냈다.
        </p>
    </section>
    )
}

export default DetailedDiary;