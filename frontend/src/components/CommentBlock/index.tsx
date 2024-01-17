import React from 'react'
import styles from './index.module.scss'
import { Comment as CommentType } from '../../redux/slices/project'
import { Comment } from '../Comment'

type Props = {
  comments: CommentType[],
  userId: string,
  postType: string,
}

export const CommentBlock = ({comments, userId, postType}: Props) => {

  return (
    <>
      <p className={styles.title_comments}>Comments:</p>
      {
        comments.length === 0 && <p style={{paddingLeft: '6%', marginBottom: '16px'}}>No comments here yet.</p>
      }
      <div className={styles.comments_block}>
          {
              [...comments]
                .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((comment, index) => <Comment key={index} comment={comment} isOpen={comment.user._id === userId} postType={postType}/>)
          }
      </div>
    </>
  )
}
 