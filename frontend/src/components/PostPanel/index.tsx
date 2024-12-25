import React from 'react'
import styles from './index.module.scss'
import { Project } from '../../redux/slices/project'
import { Link } from 'react-router-dom'
import { Vacancy } from '../../redux/slices/vacancy'

type Props = {
    focusedPost: Project | Vacancy | null
}

type FocusedPost = Project | Vacancy;

export const PostPanel = ({focusedPost}: Props) => {
    
    const isProject = (post: FocusedPost): post is Project => {
        return 'idea' in post && 'projectTeam' in post;
    };
    
  return (
    <div className={styles.project_panel}>
        <p className={styles.project_panel_title}>Information about post</p>
        {
            focusedPost && isProject(focusedPost) ? (
                <div className={styles.additional_info}>
                    <p className={styles.idea}>Main idea: <span>{focusedPost.idea}</span></p>
                    <p className={styles.project_team_p}>Project Team:</p>
                    <div className={styles.project_team}>
                        {
                            focusedPost.projectTeam.map(member => 
                            <span 
                                key={member._id}>{member.nickname}:
                                <Link to={`http://localhost:3000/dashboard/profile/${member.nickname}`}>
                                    <span>{member.nickname}</span>
                                </Link>
                                <br></br>
                            </span>)
                        }
                    </div>
                    <div className={styles.price}>Price: <span>{focusedPost.price}$</span></div>
                </div>
            )
            :
                focusedPost && !isProject(focusedPost) && (
                    <div className={styles.additional_info}>
                        <p className={styles.skills}>You need to know: <span style={{fontWeight: 'bold'}}>{focusedPost.skills.join(' ')}</span></p>
                        <p className={styles.position}>They need: <span style={{fontWeight: 'bold'}}>{focusedPost.position}</span></p>
                    </div>
            )

        } 
    </div>
  )
}
