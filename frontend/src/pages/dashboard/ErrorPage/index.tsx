import React from 'react'
import styles from './index.module.scss'
import imgError from '../../../img/no-results.png'
import { Link } from 'react-router-dom'

type Props = {
    error?: string | undefined,
}

export const ErrorPage = ({error}: Props) => {

  return (
    <div className={styles.container}>
        <img src={imgError} alt="" />
        <p>{error ? error: 'Error is hidden.'}</p>
        <p>Please return back to dashboard</p>
        <Link to={'/dashboard'}>
            <button className={styles.error_button}>Return back</button>
        </Link>
    </div>
  )
}
