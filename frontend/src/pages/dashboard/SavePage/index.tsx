import React from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Project } from '../../../components/Project'
import { useGetAllProjectsQuery } from '../../../redux/services/project'
import { useCurrentQuery } from '../../../redux/services/auth'

import { catchFetchError } from '../../../helpers'
import { ErrorPage } from '../ErrorPage'
import { Preloader } from '../../../components/Preloader'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/auth'
import { RootState } from '../../../redux/store'
import { useGetAllVacanciesQuery } from '../../../redux/services/vacancy'
import { Vacancy } from '../../../components/Vacancy'
import { setPage } from '../../../redux/slices/filter'

export const SavePage = () => {
  const dispatch = useDispatch();

  const {data: projects} = useGetAllProjectsQuery();
  const {data: vacancies} = useGetAllVacanciesQuery();

  const user = useSelector(selectUser)
  const status = useSelector((state: RootState) => state.auth.status)
  const page = useSelector((state: RootState) => state.filter.page)

  const changePageHandler = (page: string) => {
    dispatch(setPage(page))
  }

  // if(isLoading){
  //   return <Preloader />
  // }

  // if(isError || !user || !projects){
  //   const errorMessage = catchFetchError(error);
  //   return <ErrorPage error={errorMessage || 'No message'}/>
  // }

  if(status === 'loading'){
    return <Preloader />
  }
  
  if(!user || !projects || !vacancies){
    return <ErrorPage error={'No message'}/>
  }

  return (
    <Layout>
      <div className={styles.savePage_header}>
      <p className={styles.title}>Saved Posts:</p>
          <div className={styles.filter_page}>
              <div className={`${styles.project_page} ${page === 'Projects' ? styles.project_active : ''}`} onClick={() => changePageHandler('Projects')}>Projects</div>
              <div className={`${styles.vacancy_page} ${page === 'Vacancies' ? styles.vacancy_active : ''}`} onClick={() => changePageHandler('Vacancies')}>Vacancies</div>
          </div>
      </div>
      <div className={styles.container}>
        {
          page === 'Projects' 
          ? [...projects]
            .filter(project => user.savedPosts.includes(project._id))
              .map((project, index) => (
                <div key={project._id} className={styles.post_container}>
                  <Project key={project._id} project={project} isSavePage={true}/>
                  {/* <p className={styles.line}></p> */}
                </div>
              ))
            : [...vacancies]
              .filter(vacancy => user.savedPosts.includes(vacancy._id))
                .map((vacancy, index) => (
                  <div key={vacancy._id} className={styles.post_container}>
                    <Vacancy key={vacancy._id} vacancy={vacancy} isSavePage={true}/>
                    {/* <p className={styles.line}></p> */}
                  </div>
                ))
        }
      </div>
    </Layout>
  )
}
