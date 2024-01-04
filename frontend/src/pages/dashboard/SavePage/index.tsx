import React from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Project } from '../../../components/Project'
import { useGetAllProjectsQuery } from '../../../redux/services/project'
import { useCurrentQuery } from '../../../redux/services/auth'

import { catchFetchError } from '../../../helpers'
import { ErrorPage } from '../ErrorPage'
import { Preloader } from '../../../components/Preloader'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/auth'
import { RootState } from '../../../redux/store'

export const SavePage = () => {

  const {data: projects} = useGetAllProjectsQuery();
  const user = useSelector(selectUser)
  const status = useSelector((state: RootState) => state.auth.status)
  
  // const {data: user, error, isError, isLoading} = useCurrentQuery();

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
  
  if(!user || !projects){
    return <ErrorPage error={'No message'}/>
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
