import React from 'react';
import styles from './Loading.module.css';

export default function Loading({ isInSection }) {
  return (
    <section className={`${styles.section} ${isInSection ? styles.inSection : ''}`}>
      <div className={styles.imageWrap}>
        <img src="/attendance.png" alt="" />
        <img src="/attendance.png" alt="" />
        <img src="/attendance.png" alt="" />
      </div>
    </section>
  );
}

