import React, { ChangeEvent, useState } from 'react'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { setCurrentStage, setFilter } from '../../redux/slices/filter'

type Filter = 'newest' | 'popular' //| 'mostLiked'
type currentStageType = '' | 'Beginner' | 'Mid-development' | 'Almost finished' | 'Testing' | 'Maintenance'

const stages = ['All stages', 'Beginner', 'Mid-development', 'Almost finished', 'Testing', 'Maintenance']

export const Filter = () => {
    const dispatch = useDispatch();

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilter(event.target.value as Filter))
    };

    const handleCurrentStageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentStage(event.target.value as currentStageType))
    };

  return (
    <div className={styles.filter}>
        <div className={styles.filter_form}>
            <label htmlFor="filterSelect">Filter:</label>
            <select id="filterSelect" onChange={handleFilterChange}>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                {/* <option value="mostLiked">Most d</option> */}
            </select>
        </div>

        <div className={styles.stage_filter_form}>
            <label htmlFor="stageSelect">Stage:</label>
            <select id="stageSelect" onChange={handleCurrentStageChange}>
                {
                    stages.map(stage => <option key={stage} value={stage} defaultChecked={stage === 'All stages'}>{stage}</option>)
                }
            </select>
        </div>
    </div>
  )
}
