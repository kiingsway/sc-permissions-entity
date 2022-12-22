import React from 'react'
import styles from './Table.module.scss';

interface Props {
  children: any;
}

export default function Table({ children }: Props) {
  return (
    <table className={styles.Table}>
      {children}
    </table>
  )
}