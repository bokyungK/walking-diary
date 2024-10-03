import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { deleteDiary, getDogName, saveDiary } from "../../api/firebase.js";
import { deleteImage, saveImage } from "../../api/cloudinary.js";
import { useUserContext } from "../../context/userContext.jsx";
import { useSubmitContext } from "../../context/submitContext.jsx";
import { IoClose } from "react-icons/io5";
import styles from './Diary.module.css';
import Button from "../../component/Button/Button.jsx";

const today = new Date();
const timestamp = Math.floor(new Date().getTime() / 1000);
const fullYear = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
const fixedMonth = (month < 10 ? '0' : '') + month;
const fixedDate = (date < 10 ? '0' : '') + date;

const INITIAL_FILE = { status: false, value: '', file: '' }
const INITIAL_DIARY = {
  title: '',
  content: '',
  weather: 'sunny',
  dogName: '',
  imageUrl: '',
  time: `${fullYear}-${fixedMonth}-${fixedDate}`,
  mark: false,
  timestamp,
}

export default function Diary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, pathname } = useLocation();
  const { user } = useUserContext();
  const { isSubmitting, handleSubmitTrue, handleSubmitFalse } = useSubmitContext();
  const [file, setFile] = useState(INITIAL_FILE);
  const [diary, setDiary] = useState(INITIAL_DIARY);
  const { data: dogName } = useQuery({
    queryKey: ['dogName', user && user.uid],
    queryFn: () => getDogName(user.uid),
    enabled: Boolean(user && user.uid),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })
  
  useEffect(() => {
    if (pathname.includes('new')) {
      setDiary(INITIAL_DIARY);
    } else {
      setDiary(state);
    }
  }, [pathname, state])

  const handleFile = (e) => {
    const { value, files } = e.target;
    setFile({ status: true, value, file: files[0]});
  }

  const handleInput = (e) => {
    const { value, name } = e.target;

    setDiary((prev) => {
      return {...prev, [name]: value};
    })
  }

  const handleClose = () => {
    setFile(INITIAL_FILE);
    setDiary((prev) => {
      return {...prev, imageUrl: ''}
    });
  }

  const handleSave = (e) => {
    e.preventDefault();
    handleSubmitTrue();

    saveImage(file.file)
    .then((imageUrl) => {
      const newDiary = {...diary, imageUrl};
      saveDiary(user.uid, newDiary, id);
    })
    .finally(() => {
      handleSubmitFalse();
      navigate('/diary');
    })
  };

  const handleControl = (e) => {
    const { id: type } = e.currentTarget;

    if (type === 'update') {
      navigate('/diary/update/', { state });
      return;
    }
    
    if (type === 'cancel') {
      navigate(`/diary`, { state });
      return;
    }
    
    if (type === 'mark') {
      // 업데이트 후 mutation 필요, 뒤로가기 금지
      const newDiary = {...diary, mark: !diary.mark};
      setDiary(newDiary)
      saveDiary(user.uid, newDiary, id);
      return;
    }
    
    if (type === 'delete') {
      // 삭제 후 mutation 필요, 뒤로가기 금지
      deleteImage(diary.imageUrl)
      .then((result) => {
        if (result) {
          deleteDiary(user.uid, id)
          .then(() => navigate('/diary'))
        }
      })
      return;
    }
  }

  useEffect(() => {
    setDiary((prev) => {
      return {...prev, dogName}
    })
  }, [dogName])

  return (
    <section className={`${styles.section} column`}>
      <h2>
        { pathname.includes('update') && '일기 고치기' }
        { pathname.includes('new') && '일기 쓰기' }
        { !(pathname.includes('update') || pathname.includes('new')) && '일기 보기' }
      </h2>
      <div className={styles.ruleButtonWrap}>
        { 
          (pathname.includes('new') || pathname.includes('update')) ?
            <button className={styles.ruleButton} type='button'>💡 작성 규칙 확인하기</button>
            :
            <>
              <button onClick={handleControl} id='delete' className={styles.controlButton} type='button'>
                <img src='/icons/delete.png' alt='지우기' />
              </button>
              <button onClick={handleControl} id='cancel' className={styles.controlButton} type='button'>
                <img src='/icons/cancel.png' alt='뒤로가기' />
              </button>
              <button onClick={handleControl} id='update' className={styles.controlButton} type='button'>
                <img src='/icons/edit.png' alt='수정하기' />
              </button>
              <button onClick={handleControl} id='mark' className={styles.controlButton} type='button'>
                <img src={`/icons/star_${String(diary.mark)}.png`} alt='북마크' />
              </button>
            </>
        }
      </div>

      <form className={styles.diaryInfo} onSubmit={handleSave}>
        <div className={styles.fileWrap}>
          { (pathname.includes('new') || pathname.includes('update')) && <>
              <label className={styles.fileLabel} htmlFor='file'>사진 고르기</label>
              <input className={styles.fileInput} type='file' id='file' name='file'
                accept='image/*' onChange={handleFile} value={file.value} required />
              {
                (file.status || diary.imageUrl) && <>
                  {
                    file.status && <img className={styles.filePreview} src={URL.createObjectURL(file.file)} alt='' />
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
        <div className={styles.diaryOptions}>
          {
            diary && <div className={styles.dateBox}>{diary.time}</div>
          }
          
          {
            diary && <fieldset onChange={handleInput} className={styles.weatherBox} name='weather'
              value={diary.weather} required={!(pathname.includes('new') || pathname.includes('update'))} disabled={!(pathname.includes('new') || pathname.includes('update'))}>
              { 
                ['sunny', 'cloudy', 'rainy', 'snowy'].map((type) => {
                  const checked = diary.weather === type;

                  return <div key={type}>
                    <input type='radio' name='weather' id={type} value={type} checked={checked} />
                    <label htmlFor={type}>
                      <img src={`/${type}.svg`} alt={type} />
                    </label>
                  </div>
                })
              }
            </fieldset>
          }

          { diary && <select onChange={handleInput} name='dog' className={styles.dogSelect}
              value={diary.dogName} required={!(pathname.includes('new') || pathname.includes('update'))} disabled={!(pathname.includes('new') || pathname.includes('update'))}>
              <option>{diary.dogName}</option>
            </select>
          }
        </div>
        <div>
          {
            diary && <input onChange={handleInput} className={styles.writingInfo} type='text' name='title'
              placeholder='제목 쓰기' maxLength='30' required disabled={!(pathname.includes('new') || pathname.includes('update'))}
              value={diary.title} />
          }

          { diary && <textarea onChange={handleInput} className={`${styles.writingInfo} ${styles.contentInfo} `}
              name='content' placeholder='내용 쓰기' maxLength='500' required disabled={!(pathname.includes('new') || pathname.includes('update'))} 
              value={diary.content}>
            </textarea>
          }

          {
            (pathname.includes('new') || pathname.includes('update')) &&
            <div className='buttonWrap'>
              <Button name='취소' destination='/diary' />
              <Button name='저장' isButton isSubmitting={isSubmitting} />
            </div>
          }
        </div>
      </form>
    </section>
  )
}