import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'

import { Project } from '../../../components/Project';
import { Search } from '../../../components/Search';
import { Filter } from '../../../components/Filter';
import { useGetAllProjectsQuery } from '../../../redux/services/project';
import { Project as ProjectType, ProjectTeam } from '../../../redux/slices/project';
import { ProjectPanel } from '../../../components/ProjectPanel';
import { TagPanel } from '../../../components/TagPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useCurrentQuery } from '../../../redux/services/auth';


export const Dashboard = () => {
 
    const {data: projects} = useGetAllProjectsQuery();
    const {data: user} = useCurrentQuery();
    
    const {filter, language, search} = useSelector((state: RootState) => state.filter)

    const [focusedProject, setFocudesProject] = useState<ProjectType | null>(null)

    if (!projects){
        return <p></p> //Something went wrong. Try again!
    }

    const handleFocus = (projectId: string | null) => {
        setFocudesProject(projects.filter(project => project._id === projectId)[0])
    };

  return (
    <Layout>
        <div className={styles.container_top}>
            <Search />
            <Filter/>
        </div>

        <div className={styles.container_main}>
            <div className={styles.project_left_side}>
                {
                    [...projects]
                        .sort((a, b) => filter === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.viewCount - a.viewCount)
                            .filter(project => project.tags.find(tag => language === 'all' ? true : tag === language))
                                .filter(project => project.title.toLowerCase().includes(search.toLowerCase()))
                                    .map(project => 
                                        (
                                            <div style={{padding: '10px'}} key={project._id} id={project._id} onMouseEnter={() => handleFocus(project._id)}>
                                                <Project key={project._id} currentUser={user ? user : null} project={project} isEditable={project.user._id === user?._id}/>
                                            </div>
                                        )
                                        )
                }
            </div>

            <div className={styles.right_side}> 
                <ProjectPanel focusedProject={focusedProject}/>
                <TagPanel />
            </div>
        </div>
    </Layout>
  )
}
