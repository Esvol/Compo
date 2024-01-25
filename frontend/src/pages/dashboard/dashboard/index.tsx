import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'

import { Project } from '../../../components/Project';
import { Search } from '../../../components/Search';
import { Filter } from '../../../components/Filter';
import { useGetAllProjectsQuery } from '../../../redux/services/project';
import { Project as ProjectType } from '../../../redux/slices/project';
import { PostPanel } from '../../../components/PostPanel';
import { TagPanel } from '../../../components/TagPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { catchFetchError } from '../../../helpers';
import { ErrorPage } from '../ErrorPage';
import { Preloader } from '../../../components/Preloader';
import { selectUser } from '../../../redux/slices/auth';
import { useGetAllVacanciesQuery } from '../../../redux/services/vacancy';
import { Vacancy } from '../../../components/Vacancy';
import { Vacancy as VacancyType } from '../../../redux/slices/vacancy';


export const Dashboard = () => {

    const {data: projects, error, isError, isLoading: isProjectsLoading} = useGetAllProjectsQuery();      
    const {data: vacancies, isLoading: isVacanciesLoading} = useGetAllVacanciesQuery();  
       
    const user = useSelector(selectUser)
    const {page, filter, currentStage, currentTag, search, currentSkill, currentLevel, currentPosition} = useSelector((state: RootState) => state.filter)

    const [focusedProject, setFocudesProject] = useState<ProjectType | VacancyType | null>(null)

    if(isProjectsLoading || isVacanciesLoading){
        return <Preloader />
    }
    
    if(isError || !projects || !vacancies){
        const errorMessage = catchFetchError(error);
        return <ErrorPage error={errorMessage || 'Some problem with dashboard, come later!'}/>
    }

    const handleFocus = (postId: string | null) => {
        setFocudesProject(projects.find(project => project._id === postId) ? projects.filter(project => project._id === postId)[0] : vacancies.filter(vacancy => vacancy._id === postId)[0])
    };

    const filtered_vacancies = [...vacancies].sort((a, b) => filter === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.viewCount - a.viewCount)
        .filter(vacancy => vacancy.skills.find(skill => currentSkill ? skill === currentSkill : true))
            .filter(vacancy => currentLevel !== 'All levels' ? vacancy.level === currentLevel : true)
                .filter(vacancy => currentPosition !== 'All positions' ? vacancy.position === currentPosition : true)
                    .filter(project => project.title.toLowerCase().includes(search.toLowerCase()))

    const filtered_projects = [...projects].sort((a, b) => filter === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.viewCount - a.viewCount)
        .filter(project => project.tags.find(tag => currentTag ? tag === currentTag : true))
            .filter(project => currentStage !== 'All stages' ? project.stage === currentStage : true)
                .filter(project => project.title.toLowerCase().includes(search.toLowerCase()))
                
  return (
    <Layout>
        <div className={styles.container_top}>
            <Search />
            <Filter page={page}/>
        </div>

        <div className={styles.container_main}>
            <div className={styles.project_left_side}>

                {
                    page === 'Projects' 
                    ? <p style={{marginLeft: '8px', fontSize: '24px'}}>Projects:</p>
                    : <p style={{marginLeft: '8px', fontSize: '24px'}}>Vacancies:</p> 
                }
                {
                    page === 'Projects' 
                        ? filtered_projects.length !== 0 ? filtered_projects.map(project =>
                            (
                                <div style={{padding: '10px'}} key={project._id} id={project._id} onMouseEnter={() => handleFocus(project._id)}>
                                    <Project key={project._id} project={project} isEditable={project.user._id === user?._id}/>
                                </div>
                            ) 
                            ) : <p className={styles.not_found}>No IT-projects were found.</p>
                                        
                        : filtered_vacancies.length !== 0 ? filtered_vacancies.map(vacancy => 
                            
                            (
                                <div style={{padding: '10px'}} key={vacancy._id} id={vacancy._id} onMouseEnter={() => handleFocus(vacancy._id)}>
                                    <Vacancy key={vacancy._id} vacancy={vacancy} isEditable={vacancy.user._id === user?._id}/>
                                </div>
                            ) 
                            ) : <p className={styles.not_found}>No Vacancies were found.</p>  
                }
            </div>

            <div className={styles.right_side}> 
                <PostPanel focusedPost={focusedProject}/>
                {/* <TagPanel /> */}
            </div>
        </div>
    </Layout>
  )
}
