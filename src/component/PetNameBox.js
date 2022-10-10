import React from "react";
import styles from "./Mypage.module.css";

function PetNameBox ({ handleAddPetName, handleRemovePetName, defaultBox, appendPetNameBox }) {
    return (
        <div className={styles.formItem}>
            <label className={styles.itemLabel}>반려견 이름</label>
            <input className={styles.itemInput}></input>
            {
                defaultBox && <>
                    <button className={styles.addPetButton} onClick={handleAddPetName} type='button'>추가</button>
                    {
                        appendPetNameBox.length > 0 ? <button className={`${styles.addPetButton} ${styles.removePetButton}`} onClick={handleRemovePetName} type='button'>삭제</button> : ''
                    }
                </>
            }
        </div>
    )
}

export default PetNameBox;