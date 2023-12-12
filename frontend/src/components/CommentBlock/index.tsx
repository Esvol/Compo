import React from 'react'
import styles from './index.module.scss'
import { Comment as CommentType, User } from '../../redux/slices/project'
import { Comment } from '../Comment'

type Props = {
  comments: CommentType[],
  userId: string,
}

export const CommentBlock = ({comments, userId}: Props) => {

  return (
    <>
      <p className={styles.title_comments}>Comments:</p>
      <div className={styles.comments_block}>
          {
              comments.map((comment, index) => <Comment key={index} comment={comment} isOpen={comment.user._id === userId}/>)
          }
      </div>
    </>
  )
}
 