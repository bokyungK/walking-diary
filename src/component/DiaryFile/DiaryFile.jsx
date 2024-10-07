import React from 'react';
import { IoClose } from "react-icons/io5";
import styles from "./DiaryFile.module.css";

export default function DiaryFile({ INITIAL_FILE, pathname, setFile, setDiary, diary, file, state }) {
  const handleFile = (e) => {
    const { value, files } = e.target;
    setFile({ status: true, value, file: files[0]});
  }

  const handleClose = () => {
    setFile(INITIAL_FILE);
    setDiary((prev) => {
      return {...prev, imageUrl: ''}
    });
  }

  return (
    <div className={styles.fileWrap}>
      { (pathname.includes('new') || pathname.includes('update')) && <>
          <label className={styles.fileLabel} htmlFor='file'>사진 고르기</label>
          <input className={styles.fileInput} type='file' id='file' name='file' accept='image/*'
           onChange={handleFile} value={file.value} required={pathname.includes('update') ? false : true} />
          {
            (file.status || diary.imageUrl) && <>
              {
                file.status && <img className={styles.filePreview} src={URL.createObjectURL(file.file)} alt='유저 첨부 파일' />
              }
              {
                diary.imageUrl && <img className={styles.userFile} src={diary.imageUrl} alt={diary.title} />
              }
              <button className={styles.fileCloseWrap} type='button' onClick={handleClose}>
                <IoClose className={styles.fileClose} />
              </button>
            </>
          }
        </>
      }
      { 
        !(pathname.includes('update') || pathname.includes('new')) &&
        <img className={styles.userFile} src={state.imageUrl} alt={state.title} />
      }
    </div>
  );
}

