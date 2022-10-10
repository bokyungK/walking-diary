import React from "react";
import axios from "axios";
import styles from "./Mypage.module.css";
import Buttons from "./Buttons.js"
import PetNameBox from "./PetNameBox.js";

function Mypage() {
    const defaultBox = true;
    const buttonName = {
        cancel: '취소',
        submit: '변경'
    }
    const cancelLink = {
        path: '/',
    }

    const [appendPetNameBox, setAppendPetNameBox] = React.useState([]);
    function handleAddPetName() {
        setAppendPetNameBox([...appendPetNameBox, <PetNameBox key={`pet-${appendPetNameBox.length + 2}`} />]);
    }
    function handleRemovePetName() {
        setAppendPetNameBox([...appendPetNameBox].filter((item, idx) => idx !== [...appendPetNameBox].length - 1));
    }

    const [userName, setUserName] = React.useState();
    const [userId, setUserId] = React.useState();
    const [userPetName, setUserPetName] = React.useState();
    axios.get('http://localhost:3001/info', { withCredentials: true })
    .then(res => {
        const data = res.data;
        setUserName(data[0].name);
        setUserId(data[0].id);
        setUserPetName(data[0].dog_name);
    });
    return (
        <div className={styles.Mypage}>
            <h2 className={styles.infoTitle}>마이페이지</h2>
            <form className={styles.infoForm}>
                <div className={styles.formSection}>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>이름</label>
                        <input className={styles.itemInput} type='text' disabled value={userName}/>
                    </div>
                    <div className={styles.formItem}>                       
                        <label className={styles.itemLabel}>아이디</label>
                        <input className={styles.itemInput} type='text' disabled value={userId}/>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.itemLabel}>비밀번호</label>
                        <input className={styles.itemInput} type='text' />
                    </div>
                    <PetNameBox defaultBox={defaultBox} handleAddPetName={handleAddPetName} handleRemovePetName={handleRemovePetName} appendPetNameBox={appendPetNameBox} userPetName={userPetName} setUserPetName= {setUserPetName} />
                    {   appendPetNameBox.length > 0 ? appendPetNameBox.map((item) => { return item }) : ''  }
                    <div className={styles.additionalTab}>
                        <button className={`button ${styles.withdrawal}`} type='button'>회원탈퇴</button>
                        <button className={`button ${styles.logout}`} type='button'>로그아웃</button>
                    </div>
                </div>
                <Buttons buttonName={buttonName} cancelLink={cancelLink} />
            </form>
        </div>
    )
}

export default Mypage;