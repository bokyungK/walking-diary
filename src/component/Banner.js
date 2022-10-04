import React from 'react';
import styles from './Banner.module.css'

function Banner() {
    return (
        <div className={styles.Banner}>
            <p className={styles.mainIntroduction}>
                반려견과 함께<br />
                하루 하루를 기록하는<br />
                '산책일기'<br />
                지금 바로 사용해보세요!
            </p>
        </div>
    )
  }
  
  export default Banner;