import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';

export default function Button({ name, isButton, destination, state, isSubmitting }) {
  if (isButton) {
    const addedText = isSubmitting ? '중' : '';
    const text = name + addedText;
    return <button className={styles.button}>{text}</button>
  } else {
    return <Link className={styles.button} to={destination} state={state} disabled={isSubmitting}>{name}</Link>;
  }
}
