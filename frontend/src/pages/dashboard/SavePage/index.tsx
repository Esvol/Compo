import React from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Project } from '../../../components/Project'
import { useGetAllProjectsQuery } from '../../../redux/services/project'
import { useCurrentQuery } from '../../../redux/services/auth'
import { Navigate, useNavigate } from 'react-router-dom'

import DeleteIcon from '@mui/icons-material/Delete';

export const SavePage = () => {
  const navigate = useNavigate();

  const {data: projects} = useGetAllProjectsQuery();
  const {data: user} = useCurrentQuery();

  if(!user || !projects){
    return <Navigate to={'/dashboard'} />
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
                        <Project key={project._id} currentUser={user ? user : null} project={project} isSavePage={true}/>
                        <p className={styles.line}></p>
                      </div>
                    ))
              }
        </div>
    </Layout>
  )
}
