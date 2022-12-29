import React from 'react'
import styles from './Table.module.scss';

interface Props {
  children: any;
}

export function Table({ children }: Props) {
  return (
    <table className={styles.Table}>
      {children}
    </table>
  )
}

export function SCTable({ children }: Props) {
  return (
    <table className={styles.SCTable}>
      {children}
    </table>
  )
}