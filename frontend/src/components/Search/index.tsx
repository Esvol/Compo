import React, { ChangeEvent, useState } from 'react'
import styles from './index.module.scss'

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { IconSearchButton } from '../../custom-components/Buttons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTag, setSearch } from '../../redux/slices/filter';
import { RootState } from '../../redux/store';

export const Search = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('')
  const currentTag = useSelector((state : RootState) => state.filter.currentTag);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const searchHandler = () => {
    dispatch(setSearch(value))
  }

  const clearLanguageHandler = () => {
    dispatch(setCurrentTag(''))
  }

  return (
    <div className={styles.search}>
        <input placeholder='Search...' value={value} onChange={onChangeHandler}/>
        <IconSearchButton aria-label="search" onClick={searchHandler}>
            <TaskAltIcon />
        </IconSearchButton>
        { currentTag && <p onClick={clearLanguageHandler} className={styles.current_tag}>#{currentTag}</p> }
    </div>
  )
}
