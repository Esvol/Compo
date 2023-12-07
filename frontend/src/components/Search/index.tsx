import React, { ChangeEvent, useState } from 'react'
import styles from './index.module.scss'

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { IconSearchButton } from '../../custom-components/Buttons';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '../../redux/slices/filter';
import { RootState } from '../../redux/store';

export const Search = () => {
  const dispatch = useDispatch();
  const search = useSelector((state : RootState) => state.filter.search);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(event.target.value))
  }

  return (
    <div className={styles.search}>
        <input placeholder='Search...' value={search} onChange={onChangeHandler}/>
        <IconSearchButton aria-label="search">
            <TaskAltIcon />
        </IconSearchButton>
    </div>
  )
}
