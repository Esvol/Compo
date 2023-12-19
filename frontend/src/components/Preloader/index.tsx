import React from 'react'
import styles from './index.module.scss'

export const Preloader = () => {
  return (
    <div className={styles.container}>
        <div className={styles.lds_ellipsis}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
  )
}
