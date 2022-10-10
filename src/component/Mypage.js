import React from "react";
import axios from "axios";
import styles from "./Mypage.module.css";
import Buttons from "./Buttons.js"
import PetNameBox from "./PetNameBox.js";

function Mypage() {
    const buttonName = {
        cancel: '취소',
        submit: '변경'
    }
    const cancelLink = {
        path: '/',
    }
    const defaultBox = true;
    const [appendPetNameBox, setAppendPetNameBox] = React.useState([]);
    
    function handleAddPetName() {
        setAppendPetNameBox([...appendPetNameBox, <PetNameBox key={`pet-${appendPetNameBox.length + 2}`} />]);
    }
    function handleRemovePetName() {
        setAppendPetNameBox([...appendPetNameBox].filter((item, idx) => idx !== [...appendPetNameBox].length - 1));
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
                    <PetNameBox defaultBox={defaultBox} handleAddPetName={handleAddPetName} handleRemovePetName={handleRemovePetName} appendPetNameBox={appendPetNameBox}  />
                    {
                        appendPetNameBox.length > 0 ? appendPetNameBox.map((item) => { return item }) : ''
                    }
                </div>
                <Buttons buttonName={buttonName} cancelLink={cancelLink} />
            </form>
        </div>
    )
}

export default Mypage;