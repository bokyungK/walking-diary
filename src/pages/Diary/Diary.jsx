import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/userContext.jsx";
import styles from './Diary.module.css';
import { deleteDiary, saveDiary } from "../../api/firebase.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Button from "../../component/Button/Button.jsx";
import { deleteImage, saveImage } from "../../api/cloudinary.js";

const INITIAL_FILE = { status: false, value: '', file: '' }

export default function Diary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { user } = useUserContext();
  const [file, setFile] = useState(INITIAL_FILE);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const fullYear = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const fixedMonth = (month < 10 ? '0' : '') + month;
  const fixedDate = (date < 10 ? '0' : '') + date;
  const [diary, setDiary] = useState({
    title: '',
    content: '',
    weather: 'sunny',
    dog: '인삼',
    imageUrl: '',
    time: `${fullYear}-${fixedMonth}-${fixedDate}`,
    mark: false,
  });
  
  useEffect(() => {
    if (pathname.includes('new')) {
      setDiary({
        title: '',
        content: '',
        weather: 'sunny',
        dog: '인삼',
        imageUrl: '',
        time: `${fullYear}-${fixedMonth}-${fixedDate}`,
        mark: false,
      })
    } else {
      setDiary(state);
    }
  }, [pathname, fullYear, fixedMonth, fixedDate, state])

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
    setIsLoading(true);

    saveImage(file.file)
    .then((imageUrl) => {
      const newDiary = {...diary, imageUrl};
      saveDiary(user.uid, newDiary, id);
    })
    .finally(() => {
      setIsLoading(false);
      navigate('/diary');
    })
  };

  const handleControl = (e) => {
    const { id: type } = e.currentTarget;

    if (type === 'update') navigate('/diary/update/', { state });
    else if (type === 'cancel') navigate(`/diary`, { state });
    else if (type === 'mark') {
      // 업데이트 후 mutation 필요, 뒤로가기 금지
      const newDiary = {...diary, mark: !diary.mark};
      setDiary(newDiary)
      saveDiary(user.uid, newDiary, id);
    } else if (type === 'delete') {
      // 삭제 후 mutation 필요, 뒤로가기 금지
      deleteImage(diary.imageUrl)
      .then((result) => {
        if (result) {
          deleteDiary(user.uid, id)
          .then(() => navigate('/diary'))
        }
      })
    }
  }

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

                  return <>
                    <input type='radio' name='weather' id={type} value={type} checked={checked} />
                    <label htmlFor={type}>
                      <img src={`/${type}.svg`} alt={type} />
                    </label>
                  </>
                })
              }
            </fieldset>
          }

          { diary && <select onChange={handleInput} name='dog' className={styles.dogSelect}
              value={diary.dog} required={!(pathname.includes('new') || pathname.includes('update'))} disabled={!(pathname.includes('new') || pathname.includes('update'))}>
              {
                ['인삼', '산삼', '홍삼'].map((text) => <option key={text}>{text}</option>)
              }
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
              <Button name='저장' isButton isLoading={isLoading} />
            </div>
          }
        </div>
      </form>
    </section>
  )
}