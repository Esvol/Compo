import React, { ChangeEvent, useState } from 'react'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { setFilter, setLanguage } from '../../redux/slices/filter'

type Filter = 'newest' | 'popular' //| 'mostLiked'
type LanguageFilter = 'all' | 'javascript' | 'java' | 'kotlin' | 'c++' | 'c#' | 'python' | 'react' | 'node'

export const Filter = () => {
    const dispatch = useDispatch();

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilter(event.target.value as Filter))
    };
    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLanguage(event.target.value as LanguageFilter))
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

        <div className={styles.language_filter_form}>
            <label htmlFor="languageSelect">Language:</label>
            <select id="languageSelect" onChange={handleLanguageChange}>
                <option value="all" defaultChecked>All Languages</option>
                <option value="javascript">Javascript</option>
                <option value="java">Java</option>
                <option value="kotlin">Kotlin</option>
                <option value="c++">C++</option>
                <option value="c#">C#</option>
                <option value="python">Python</option>
                <option value="react">React</option>
                <option value="node">Node.js</option>
            </select>
        </div>
    </div>
  )
}
