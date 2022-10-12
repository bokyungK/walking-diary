// import React from "react";
// import styles from "./Mypage.module.css";

// const PetNameBox = React.forwardRef(({ handleAddPetName, handleRemovePetName, defaultBox, appendPetNameBox, userDogName }, forwardedRef) => {
//         return (
//             <div className={styles.PetNameBox}>
//                 <div>
//                     <label className={styles.itemLabel}>반려견 이름</label>
//                     <input ref={forwardedRef} className={styles.itemInput} type='text' defaultValue={userDogName} />
//                 </div>
//                 <div>
//                     <label className={styles.itemLabel}>반려견 이름</label>
//                     <input ref={forwardedRef} className={styles.itemInput} type='text' defaultValue={userDogName} />                 
//                 </div>
//                 <div>
//                     <label className={styles.itemLabel}>반려견 이름</label>
//                     <input ref={forwardedRef} className={styles.itemInput} type='text' defaultValue={userDogName} />                 
//                 </div>                {
//                     defaultBox && <>
//                         <button className={styles.addPetButton} onClick={handleAddPetName} type='button'>추가</button>
//                         {
//                             appendPetNameBox.length > 0 ? <button className={`${styles.addPetButton} ${styles.removePetButton}`} onClick={handleRemovePetName} type='button'>삭제</button> : ''
//                         }
//                     </>
//                 }
//             </div>
//         )
// })

// export default PetNameBox;