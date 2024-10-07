import React from 'react';
import styles from './DiaryWriting.module.css';

export default function DiaryWriting({ pathname, diary, handleInput}) {
  return (
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
  </div>
  );
}

