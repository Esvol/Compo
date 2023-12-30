import React from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Project } from '../../../components/Project'
import { useGetAllProjectsQuery } from '../../../redux/services/project'
import { useCurrentQuery } from '../../../redux/services/auth'

import { catchFetchError } from '../../../helpers'
import { ErrorPage } from '../ErrorPage'
import { Preloader } from '../../../components/Preloader'

export const SavePage = () => {

  const {data: projects} = useGetAllProjectsQuery();
  const {data: user, error, isError, isLoading} = useCurrentQuery();

  if(isLoading){
    return <Preloader />
  }

  if(isError || !user || !projects){
    const errorMessage = catchFetchError(error);
    return <ErrorPage error={errorMessage || 'No message'}/>
  }

  return (
    <Layout>
        <div className={styles.container}>
            <p className={styles.title}>Saved Posts:</p>
              {
                [...projects]
                  .filter(project => user.savedPosts.includes(project._id))
                    .map((project, index) => (
                      <div key={project._id} className={styles.post_container}>
                        <Project key={project._id} project={project} isSavePage={true}/>
                        <p className={styles.line}></p>
                      </div>
                    ))
              }
        </div>
    </Layout>
  )
}
