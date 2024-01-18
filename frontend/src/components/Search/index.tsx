import React, { ChangeEvent, useState } from 'react'
import styles from './index.module.scss'

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { IconSearchButton } from '../../custom-components/Buttons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSkill, setCurrentTag, setSearch } from '../../redux/slices/filter';
import { RootState } from '../../redux/store';

export const Search = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('')
  const {currentTag, currentSkill} = useSelector((state : RootState) => state.filter);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const searchHandler = () => {
    dispatch(setSearch(value))
  }

  return (
    <div className={styles.search}>
        <input placeholder='Search...' value={value} onChange={onChangeHandler}/>
        <IconSearchButton aria-label="search" onClick={searchHandler}>
            <TaskAltIcon />
        </IconSearchButton>
        { currentTag && <p onClick={() => {dispatch(setCurrentTag(''))}} className={styles.current_tag}>#{currentTag}</p> }
        { currentSkill && <p onClick={() => {dispatch(setCurrentSkill(''))}} className={styles.current_skill}>#{currentSkill}</p> }
    </div>
  )
}
