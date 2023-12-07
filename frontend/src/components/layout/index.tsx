import React from 'react'
import styles from './index.module.css'
import { Header } from '../header'

type Props = {
    children: React.ReactNode
}

export const Layout = ({children}: Props) => {
  return (
    <div className={styles.main}>
        <Header/>
        {children}
    </div>
  )
}
