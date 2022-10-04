import React from "react";
import styles from "./Mypage.module.css";
import Buttons from "./Buttons.js"

function Mypage() {
    const buttonName = {
        cancel: '취소',
        submit: '변경'
    }
    return (
        <div className={styles.Mypage}>
            <h2 className={styles.infoTitle}>마이페이지</h2>
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>이름</label>
                        <input className={styles.itemInput} disabled></input>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel}>아이디</label>
                        <input className={styles.itemInput} disabled></input>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>비밀번호</label>
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

export default Mypage;