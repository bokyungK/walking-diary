import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';

export default function Button({ name, isButton, isLoading, destination, state }) {
  if (isButton) {
    return <button className={styles.button}>{name}</button>
  } else {
    const text = name + (isLoading ? '중' : '');
    return <Link className={styles.button} to={destination} state={state} disabled={isLoading}>{text}</Link>;
  }
}
