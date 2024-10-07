import React from 'react';
import styles from './DiaryOptions.module.css'

export default function DiaryOptions({ pathname, diary, handleInput }) {
  return (
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
              <input type='radio' onChange={handleInput} name='weather' id={type} value={type} checked={checked} />
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
  );
}

