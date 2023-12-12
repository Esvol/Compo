import React from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { useParams } from 'react-router-dom'
import { useGetOneProjectQuery } from '../../../redux/services/project'

import { AddComment } from '../../../components/AddComment'
import { Project } from '../../../components/Project'
import { CommentBlock } from '../../../components/CommentBlock'
import { useCurrentQuery } from '../../../redux/services/auth'

export const ProjectPage = () => {
    const { id: _id } = useParams();

    const {data: user} = useCurrentQuery();
    const {data: project} = useGetOneProjectQuery(_id!)

    if(!project){
        return <p></p> //Reload this page!
    }

  return (
    <Layout>
        <Project project={project} isFullProject={true} isEditable={user?._id === project.user._id}/>

        <div className={styles.comments}>
            <AddComment isOpen={!!user}/>
            <CommentBlock comments={project.comments} userId={user ? user._id : ''}/>
        </div>
        
    </Layout>
  )
}
