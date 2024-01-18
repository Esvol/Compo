import React, { ChangeEvent, useState } from 'react'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { setCurrentLevel, setCurrentPosition, setCurrentStage, setFilter } from '../../redux/slices/filter'

type Props = {
    page: "Projects" | "Vacancies"
}
type Filter = 'newest' | 'popular' //| 'mostLiked'
type currentStageType = '' | 'Beginner' | 'Mid-development' | 'Almost finished' | 'Testing' | 'Maintenance'

const stages = ['All stages', 'Beginner', 'Mid-development', 'Almost finished', 'Testing', 'Maintenance']
const positions = ['All positions', 'Full-Stack', 'Frontend', 'Backend']
const levels = ['All levels', 'Junior', 'Middle', 'Senior', 'Junior-Middle', 'Middle-Senior' ]

export const Filter = ({page}: Props) => {
    const dispatch = useDispatch();

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilter(event.target.value as Filter))
    };

    const handleCurrentStageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentStage(event.target.value as currentStageType))
    };

    const handleCurrentPositionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentPosition(event.target.value))
    };

    const handleCurrentLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentLevel(event.target.value))
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

        {
            page === 'Projects' ? 
            (<div className={styles.stage_filter_form}>
                <label htmlFor="stageSelect">Stage:</label>
                <select id="stageSelect" onChange={handleCurrentStageChange}>
                    {
                        stages.map(stage => <option key={stage} value={stage} defaultChecked={stage === 'All stages'}>{stage}</option>)
                    }
                </select>
            </div>)
            :
            (<>
                <div className={styles.position_filter_form}>
                    <label htmlFor="positionSelect">Position:</label>
                    <select id="positionSelect" onChange={handleCurrentPositionChange}>
                        {
                            positions.map(position => <option key={position} value={position} defaultChecked={position === 'All positions'}>{position}</option>)
                        }
                    </select>
                </div>
                <div className={styles.level_filter_form}>
                    <label htmlFor="levelSelect">Level:</label>
                    <select id="levelSelect" onChange={handleCurrentLevelChange}>
                        {
                            levels.map(level => <option key={level} value={level} defaultChecked={level === 'All levels'}>{level}</option>)
                        }
                    </select>
                </div>
            </>
            )
        }
    </div>
  )
}
