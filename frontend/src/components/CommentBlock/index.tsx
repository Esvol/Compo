import React from 'react'
import styles from './index.module.scss'
import { Comment as CommentType } from '../../redux/slices/project'
import { Comment } from '../Comment'

type Props = {
  comments: CommentType[]
}

export const CommentBlock = ({comments}: Props) => {
  return (
    <>
      <p className={styles.title_comments}>Comments:</p>
      <div className={styles.comments_block}>
          {
              comments.map((comment, index) => <Comment key={index} comment={comment} />)
          }
      </div>
    </>
  )
}
