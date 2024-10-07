import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { deleteDiary, getDogName, saveDiary } from "../../api/firebase.js";
import { deleteImage, saveImage } from "../../api/cloudinary.js";
import { useUserContext } from "../../context/userContext";
import { useSubmitContext } from "../../context/submitContext";
import styles from './Diary.module.css';
import Button from "../../component/Button/Button";
import DiaryFile from "../../component/DiaryFile/DiaryFile";
import DiaryOptions from "../../component/DiaryOptions/DiaryOptions";
import DiaryWriting from "../../component/DiaryWriting/DiaryWriting";

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

  useEffect(() => {
    setDiary((prev) => {
      return {...prev, dogName}
    })
  }, [dogName])

  const handleInput = (e) => {
    const { value, name } = e.target;

    setDiary((prev) => {
      return {...prev, [name]: value};
    })
  }

  const handleSave = (e) => {
    e.preventDefault();
    handleSubmitTrue();

    if (!file.status) {
      saveDiary(user.uid, diary, diary.id)
      .finally(() => {
        handleSubmitFalse();
        navigate('/diary');
      })
      return;
    }

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

  return (
    <section className={`${styles.section} column`}>
      <h2>
        { pathname.includes('update') && '일기 수정하기' }
        { pathname.includes('new') && '일기 쓰기' }
        { !(pathname.includes('update') || pathname.includes('new')) && '일기 보기' }
      </h2>
      <div className={styles.ruleButtonWrap}>
        { 
          (pathname.includes('new') || pathname.includes('update')) ?
            // <button className={styles.ruleButton} type='button'>💡 작성 규칙 확인하기</button>
            ''
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
        <DiaryFile INITIAL_FILE={INITIAL_FILE} pathname={pathname} diary={diary} setDiary={setDiary}
         file={file} setFile={setFile} state={state} />
        <DiaryOptions pathname={pathname} diary={diary} handleInput={handleInput} />
        <DiaryWriting pathname={pathname} diary={diary} handleInput={handleInput} />
        {
          (pathname.includes('new') || pathname.includes('update')) &&
          <div className='buttonWrap'>
            <Button name='취소' destination='/diary' />
            <Button name='저장' isButton isSubmitting={isSubmitting} />
          </div>
        }
      </form>
    </section>
  )
}