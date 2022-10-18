import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styles from './DetailedDiary.module.css';
import Notice from './Notice';
import Buttons from './Buttons';

function DetailedDiary({ notice, noticeIcon, display, changeNotice, diaryInfo, star, handleStarImage, checkLocation, setCheckLocation } ) {
    const history = useHistory();
    const sunny = useRef();
    const cloudy = useRef();
    const rainy = useRef();
    const snowy = useRef();
    const selectedDog = useRef();

    useEffect(() => {
        if (star.starred === diaryInfo.starred) {
            return;
        }
        axios.post('http://localhost:3001/starred', {...star, imageName: diaryInfo.imageName}, { withCredentials: true })
    }, [star, diaryInfo.starred, diaryInfo.imageName]);

    useEffect(() => {
        const weathers = [sunny, cloudy, rainy, snowy];
        weathers.forEach((item) => {
            if (item.current.value === diaryInfo.weather) {
                item.current.checked = true;
            } else {
            }
        })

    }, [diaryInfo.weather, checkLocation])

    // update
    const imageAttach = useRef();
    const [imageSrc, setImageSrc] = React.useState('');
    const [img, setImg] = React.useState('');

    function handleImagePreview(fileBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve) => {
          reader.onload = () => {
            setImageSrc(reader.result);
            resolve();
          };
        });
    }
    
    function handleDiaryUpdate() {
        setCheckLocation(true);
    }

    const title = useRef();
    const content = useRef();

    function handleFormSubmit() {
        const weathers = [sunny, cloudy, rainy, snowy];
        const weather = weathers.filter((item) => item.current.checked === true);

        const newDiaryInfo = {
            weather: weather[0].current.value,
            dogName: selectedDog.current.value,
            title: title.current.value,
            content: content.current.value,
            imageName: diaryInfo.imageName,
        }

        axios.post('http://localhost:3001/update-diary', newDiaryInfo, { withCredentials: true })
        .then((res) => {
            const data = res.data;
            if (data === 'Success') {
                changeNotice('변경되었습니다', 'correct.png', 'flex', '/detail-diary');
                setCheckLocation(false);
            }
        })
    }

    useEffect(() => {
        if (checkLocation) {
            setImageSrc(diaryInfo.imageSrc);

            axios.get('http://localhost:3001/get-dogs', { withCredentials: true })
            .then(res => {
                const data = res.data;
                const dogNames = [data.dog_name_1, data.dog_name_2, data.dog_name_3];
                dogNames.forEach((dogName, idx) => {
                    if (dogName === '') {
                        selectedDog.current[idx].innerText = ''
                    } else {
                        selectedDog.current[idx].innerText = dogName;
                    }

                    if (dogName === diaryInfo.dogName) {
                        selectedDog.current.value = dogName;
                    }
                })
            })
        }
    }, [checkLocation])

    // delete
    function handleDiaryDelete() {
        axios.post('http://localhost:3001/delete-diary', diaryInfo, { withCredentials: true })
        .then(res => {
            const data = res.data;
            if (data === 'Success') {
                changeNotice('삭제되었습니다', 'correct.png', 'flex', '/mydiary');
            }
        })
    }

    return (
    <section className={styles.DetailedDiary}>
        <Notice notice={notice} noticeIcon={noticeIcon} display={display} />
        <div className={styles.crudIcon}>
            <button onClick={handleStarImage} className={styles.icons}><img className={styles.iconImages} src={star.src} alt='즐겨찾기 버튼'/></button>
            <button onClick={handleDiaryUpdate} className={styles.icons}><img className={styles.iconImages} src='edit.png' alt='수정 버튼' /></button>
            <button onClick={handleDiaryDelete} className={styles.icons}><img className={styles.iconImages} src='delete.png' alt='삭제 버튼' /></button>
            <button onClick={() => history.push("/mydiary")} className={styles.icons}><img className={styles.iconImages} src='cancel.png' alt='뒤로가기 버튼'/></button>
        </div>
        {
            checkLocation ? 
            <>
                <label className={styles.attachmentLabel} htmlFor='image-attach'>
                    <p>
                        영역을 눌러 사진을 첨부하세요! <br />
                        (사진을 변경하거나 추가하지 않으면,<br />
                        기존 사진이 유지됩니다)
                    </p>
                    {
                        imageSrc && <>
                            <img className={styles.previewImage} src={imageSrc} alt='첨부 이미지 미리보기' />,
                            <button onClick={(e) => {
                                e.preventDefault();
                                imageAttach.current.value = '';
                                setImageSrc('');
                            }} type='button'><img src='cancel.png' alt='첨부 이미지 삭제 버튼' /></button>
                        </>
                    }
                </label>
                <input ref={imageAttach} onChange={(e) => {
                    handleImagePreview(e.target.files[0]);
                    setImg(e.target.files[0]);
                    }} className={styles.attachmentInput} id='image-attach' type='file' accept='image/*' />
                <div className={styles.diaryInfo}>
                    <div className={styles.diaryInfoItems}>{diaryInfo.date}</div>
                    <fieldset className={`${styles.diaryInfoItems} ${styles.weatherRadio}`}>
                        <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' />
                        <label htmlFor='sunny'>☀</label>
                        <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' />
                        <label htmlFor='cloudy'>☁</label>
                        <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' />
                        <label htmlFor='rainy'>☂</label>
                        <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' />
                        <label htmlFor='snowy'>☃</label>
                    </fieldset>
                    <select ref={selectedDog} className={styles.infoItem}>
                        <option></option>
                        <option></option>
                        <option></option>
                    </select>
                </div>
                <input ref={title} className={`${styles.writingInfo} ${styles.titleInfo}`} type='text' placeholder='제목을 입력하세요' maxLength='30' defaultValue={diaryInfo.title} />
                <textarea ref={content} className={`${styles.writingInfo} ${styles.contentInfo}`} placeholder='일기를 입력하세요' maxLength='500' defaultValue={diaryInfo.content}></textarea>

                <Buttons buttonName={{cancel: '취소' ,submit: '변경'}} cancelLink='/detail-diary' handleFormSubmit={handleFormSubmit}
                 setCheckLocation={setCheckLocation} />
            </>
            :
            <>
                <img className={styles.diaryPictures} src={diaryInfo.imageSrc} alt='일기 사진' />
                <div className={styles.diaryInfo}>
                    <div className={styles.diaryInfoItems}>{diaryInfo.date}</div>
                    <fieldset className={`${styles.diaryInfoItems} ${styles.weatherRadio}`}>
                        <input ref={sunny} type='radio' id='sunny' name='weather-radio' value='sunny' disabled />
                        <label htmlFor='sunny'>☀</label>
                        <input ref={cloudy} type='radio' id='cloudy' name='weather-radio' value='cloudy' disabled />
                        <label htmlFor='cloudy'>☁</label>
                        <input ref={rainy} type='radio' id='rainy'  name='weather-radio' value='rainy' disabled />
                        <label htmlFor='rainy'>☂</label>
                        <input ref={snowy} type='radio' id='snowy'  name='weather-radio' value='snowy' disabled />
                        <label htmlFor='snowy'>☃</label>
                    </fieldset>
                    <div className={styles.diaryInfoItems}>{diaryInfo.dogName}</div>
                </div>
                <h3 className={styles.diaryTitle}>{diaryInfo.title}</h3>
                <p className={styles.diaryContent}>{diaryInfo.content}</p>
            </>
        }
    </section>
    )
}

export default DetailedDiary;