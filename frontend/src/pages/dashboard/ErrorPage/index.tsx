import React from 'react'
import styles from './index.module.scss'
import imgError from '../../../img/no-results.png'
import { Link } from 'react-router-dom'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

type Props = {
    error?: FetchBaseQueryError | SerializedError | undefined
}


export const ErrorPage = ({error}: Props) => {

  return (
    <div className={styles.container}>
        <img src={imgError} alt="" />
        <p>There is some problem with page!</p>
        <p>Please return back to dashboard</p>
        <Link to={'/dashboard'}>
            <button className={styles.error_button}>Return back</button>
        </Link>
    </div>
  )
}
