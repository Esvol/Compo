import React from 'react'
import styles from './index.module.scss'
import { Project } from '../../redux/slices/project'
import { Link } from 'react-router-dom'

type Props = {
    focusedProject: Project | null
}

export const ProjectPanel = ({focusedProject}: Props) => {
  return (
    <div className={styles.project_panel}>
        <p className={styles.project_panel_title}>Information about project</p>
        {
            focusedProject && (
                <div className={styles.additional_info}>
                    <p className={styles.idea}>Main idea: <span>{focusedProject.idea}</span></p>
                    <p className={styles.project_team_p}>Project Team:</p>
                    <div className={styles.project_team}>
                        {
                            focusedProject.projectTeam.map(member => 
                            <span 
                                key={member._id}>{member.nickname}:
                                <Link to={`http://localhost:3000/user/profile/${member.nickname}`}>
                                    <span>{member.nickname}</span>
                                </Link>
                                <br></br>
                            </span>)
                        }
                    </div>
                    <div className={styles.price}>Price: <span>{focusedProject.price}$</span></div>
                </div>
            )
        }
    </div>
  )
}
