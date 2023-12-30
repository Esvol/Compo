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


export const ProjectPage = () => {
    const { id: _id } = useParams();

    const user = useSelector(selectUser)
    const {data: project, error, isLoading, isError} = useGetOneProjectQuery(_id!)    

    if(isLoading){
      return <Preloader />
    }

    if(!project || isError){
      const errorMessage = catchFetchError(error);
      return <ErrorPage error={errorMessage || 'No message'}/>
    }

  return (
    <Layout>
        <Project project={project} isFullProject={true} isEditable={user ? user._id === project.user._id : false}/>

        <div className={styles.comments}>
            <AddComment isOpen={!!user} user={user}/>
            <CommentBlock comments={project.comments} userId={user ? user._id : ''}/>
        </div>
    </Layout>
  )
}
