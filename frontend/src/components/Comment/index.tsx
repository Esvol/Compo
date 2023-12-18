import React, { useState } from 'react'
import { Comment as CommentType } from '../../redux/slices/project'
import styles from './index.module.scss'
import { useDeleteCommentMutation } from '../../redux/services/comment'
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    comment: CommentType,
    isOpen: boolean,
}

export const Comment = ({comment, isOpen = false}: Props) => {
    const [deleteComment] = useDeleteCommentMutation();
    const [error, setError] = useState<string>('')

    const deleteCommentHandler = async () => {
        try {
            if(window.confirm('Are you sure you want ot delete this comment?')){
                const deletedComment = {
                    projectId: comment.projectId,
                    commentId: comment._id,
                    type: 'project'
                }
    
                await deleteComment(deletedComment).unwrap()
                    .then(() => {
                        console.log('Good');
                    })
                    .catch(error => {
                        setError(error.data.message || error.data.errors[0].msg);
                    })
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error with deleting the comment: ' + error)
        }
    }

  return (
    <div className={styles.container}>
        <div className={styles.avatar}>
            <img src={comment.user.avatarURL ? `http://localhost:5000${comment.user.avatarURL}` : ''} alt="Pic" /> 
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

       {
        isOpen && (
            <div className={styles.delete_button} onClick={deleteCommentHandler}>
                <ClearIcon fontSize='large'/>
            </div>
        )
       }

        {error && <p className={styles.error}>There is error with deleting this comment!</p>}
    </div>
  )
}
