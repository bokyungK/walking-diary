import React from "react";
import styles from './MyDiary.module.css';

function MyDiary() {
    return (
        <div className={styles.MyDiary}>
            <section className={`${styles.mydiarySection} ${styles.favoriteSection}`}>
                <h2 className={styles.sectionTitle}>즐겨찾기</h2>
                <ul className={styles.favorites}>
                    <li className={styles.favoriteItem}></li>
                    <li className={styles.favoriteItem}></li>
                    <li className={styles.favoriteItem}></li>
                </ul>
            </section>
            <section className={`${styles.mydiarySection} ${styles.diarySection}`}>
                <h2 className={styles.sectionTitle}>일기 보관함</h2>
                <select className={styles.diarySort} name='sort'>
                    <option className={styles.sortOption}>정렬 방식</option>
                    <option className={styles.sortOption}>최근순서</option>
                    <option className={styles.sortOption}>날짜순서</option>
                    <option className={styles.sortOption}>강아지</option>
                </select>
                <div className={styles.diaryContainer}>
                    <ul className={styles.diaries}>
                        <li className={styles.diary}></li>
                        <li className={styles.diary}></li>
                        <li className={styles.diary}></li>
                        <li className={styles.diary}></li>
                        <li className={styles.diary}></li>
                        <li className={styles.diary}></li>
                    </ul>
                    <button className={`${styles.diaryButton} ${styles.leftButton}`} type='button'>
                        <img className={styles.buttonImage} src='images/previous.png' />
                    </button>
                    <button className={`${styles.diaryButton} ${styles.rightButton}`} type='button'>
                        <img className={styles.buttonImage} src='images/next.png' />
                    </button>
                </div>
            </section>
        </div>
    )
}

export default MyDiary;