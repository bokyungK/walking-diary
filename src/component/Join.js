import React from 'react';
import Buttons from './Buttons.js';
import styles from './Join.module.css';

function Join() {
    const buttonName = {
        cancel: '취소',
        submit: '가입'
    }
    return (
        <div className={styles.Join}>
            <h2 className={styles.infoTitle}>회원가입</h2>
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>ID</label>
                        <input className={styles.itemInput}></input>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel}>PW</label>
                        <input className={styles.itemInput}></input>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>이름</label>
                        <input className={styles.itemInput}></input>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>반려견 이름</label>
                        <input className={styles.itemInput}></input>
                    </div>
                </div>
                <Buttons buttonName={buttonName}/>
            </form>
        </div>
    )
}

export default Join;