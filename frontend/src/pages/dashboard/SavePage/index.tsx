import React, { useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'

export const SavePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {data: projects, isLoading: isProjectsLoading} = useGetAllProjectsQuery();
  const {data: vacancies, isLoading: isVacanciesLoading} = useGetAllVacanciesQuery();

  const user = useSelector(selectUser)
  const status = useSelector((state: RootState) => state.auth.status)
  const page = useSelector((state: RootState) => state.filter.page)

  const changePageHandler = (page: string) => {
    dispatch(setPage(page))
  }

  useEffect(() => {
    if (!localStorage.getItem('token')){
      navigate('/dashboard')
    }
  }, [])


  if(status === 'loading' || isVacanciesLoading || isProjectsLoading){
    return <Preloader />
  }
  
  if(!user || !projects || !vacancies){
    return <ErrorPage error={'There is some problem with this page, sorry!'}/>
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
                </div>
              ))
            : [...vacancies]
              .filter(vacancy => user.savedPosts.includes(vacancy._id))
                .map((vacancy, index) => (
                  <div key={vacancy._id} className={styles.post_container}>
                    <Vacancy key={vacancy._id} vacancy={vacancy} isSavePage={true}/>
                  </div>
                ))
        }
      </div>
    </Layout>
  )
}
