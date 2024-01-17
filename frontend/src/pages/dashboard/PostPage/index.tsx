import React from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { useParams } from 'react-router-dom'
import { useGetOneProjectQuery } from '../../../redux/services/project'

import { AddComment } from '../../../components/AddComment'
import { Project } from '../../../components/Project'
import { CommentBlock } from '../../../components/CommentBlock'
import { ErrorPage } from '../ErrorPage'
import { catchFetchError } from '../../../helpers'
import { Preloader } from '../../../components/Preloader'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/auth'
import { useGetOneVacancyQuery } from '../../../redux/services/vacancy'
import { Vacancy } from '../../../components/Vacancy'


export const PostPage = () => {
    const { id: _id } = useParams();

    const user = useSelector(selectUser)
    const {data: project, error, isLoading: isLoadingProject} = useGetOneProjectQuery(_id!) 
    const {data: vacancy, isLoading: isLoadingVacancy } = useGetOneVacancyQuery(_id!);

    if(isLoadingProject && isLoadingVacancy){
      return <Preloader />
    }

    if(!project && !vacancy){
      const errorMessage = catchFetchError(error);
      return <ErrorPage error={errorMessage || 'No message'}/>
    }

  return (
    <Layout>
        {
          project && (
            <>
              <Project project={project} isFullProject={true} isEditable={user ? user._id === project.user._id : false}/>
              <div className={styles.comments}>
                  <AddComment isOpen={!!user} user={user} postType={'Project'}/>
                  <CommentBlock comments={project.comments} userId={user ? user._id : ''} postType={'Project'}/>
              </div>
            </>
          )
        }

        {         
          vacancy && (
            <>
              <Vacancy vacancy={vacancy} isFullVacancy={true} isEditable={user ? user._id === vacancy.user._id : false}/>
              <div className={styles.comments}>
                  <AddComment isOpen={!!user} user={user} postType={'Vacancy'}/>
                  <CommentBlock comments={vacancy.comments} userId={user ? user._id : ''} postType={'Vacancy'}/>
              </div>
            </>
          )
        }
    </Layout>
  )
}
