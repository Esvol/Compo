import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'

import { Project } from '../../../components/Project';
import { Search } from '../../../components/Search';
import { Filter } from '../../../components/Filter';
import { useGetAllProjectsQuery } from '../../../redux/services/project';
import { Project as ProjectType } from '../../../redux/slices/project';
import { ProjectPanel } from '../../../components/ProjectPanel';
import { TagPanel } from '../../../components/TagPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { catchFetchError } from '../../../helpers';
import { ErrorPage } from '../ErrorPage';
import { Preloader } from '../../../components/Preloader';
import { selectUser } from '../../../redux/slices/auth';
import { useGetAllVacanciesQuery } from '../../../redux/services/vacancy';
import { Vacancy } from '../../../components/Vacancy';


export const Dashboard = () => {

    const {data: projects, error, isError, isLoading} = useGetAllProjectsQuery();      
    const {data: vacancies} = useGetAllVacanciesQuery();  
       
    const user = useSelector(selectUser)
    const {page, filter, currentStage, currentTag, search, currentSkill, currentLevel, currentPosition} = useSelector((state: RootState) => state.filter)

    const [focusedProject, setFocudesProject] = useState<ProjectType | null>(null)

    if(isLoading){
        return <Preloader />
    }
    
    if(isError || !projects || !vacancies){
        const errorMessage = catchFetchError(error);
        return <ErrorPage error={errorMessage || 'No message'}/>
    }

    const handleFocus = (projectId: string | null) => {
        setFocudesProject(projects.filter(project => project._id === projectId)[0])
    };

    const filtered_vacancies = [...vacancies].sort((a, b) => filter === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.viewCount - a.viewCount)
        .filter(vacancy => vacancy.skills.find(skill => currentSkill ? skill === currentSkill : true))
            .filter(vacancy => currentLevel ? vacancy.level === currentLevel : true)
                .filter(vacancy => currentPosition ? vacancy.position === currentPosition : true)
                    .filter(project => project.title.toLowerCase().includes(search.toLowerCase()))

    const filtered_projects = [...projects].sort((a, b) => filter === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.viewCount - a.viewCount)
        .filter(project => project.tags.find(tag => currentTag ? tag === currentTag : true))
            .filter(project => currentStage !== 'All stages' ? project.stage === currentStage : true)
                .filter(project => project.title.toLowerCase().includes(search.toLowerCase()))
                
  return (
    <Layout>
        <div className={styles.container_top}>
            <Search />
            <Filter />
        </div>

        <div className={styles.container_main}>
            <div className={styles.project_left_side}>
                {
                    page === 'Projects' 
                        ? filtered_projects.map(project =>
                            filtered_projects.length !== 0 ?
                            (
                                <div style={{padding: '10px'}} key={project._id} id={project._id} onMouseEnter={() => handleFocus(project._id)}>
                                    <Project key={project._id} project={project} isEditable={project.user._id === user?._id}/>
                                </div>
                            ) : <p className={styles.not_found}>No IT-projects were found.</p>
                            ) 
                                        
                        : filtered_vacancies.map(vacancy => 
                            filtered_vacancies.length !== 0 ?
                            (
                                <div style={{padding: '10px'}} key={vacancy._id} id={vacancy._id} onMouseEnter={() => handleFocus(vacancy._id)}>
                                    <Vacancy key={vacancy._id} vacancy={vacancy} isEditable={vacancy.user._id === user?._id}/>
                                </div>
                            ) : <p className={styles.not_found}>No Vacancies were found.</p>  
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
