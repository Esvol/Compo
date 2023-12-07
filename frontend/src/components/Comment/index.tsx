import React from 'react'
import { Comment as CommentType } from '../../redux/slices/project'
import styles from './index.module.scss'

type Props = {
    comment: CommentType,
}

export const Comment = ({comment}: Props) => {
  return (
    <div className={styles.container}>
        <div className={styles.avatar}>
            <img src={"https://lostfilm.info/images/photo/92/118107_910772.jpg"} alt="Pic" /> 
                    {/* comment.user.imageURL ??*/}
        </div>

        <div className={styles.information}>
            <div className={styles.name}>
                {comment.user.firstName} {comment.user.lastName}
            </div>

            <div className={styles.text}>
                {comment.text}
            </div>
        </div>
    </div>
  )
}
