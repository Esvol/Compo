import React, { useState } from 'react'
import { Comment as CommentType } from '../../redux/slices/project'
import styles from './index.module.scss'
import { useDeleteCommentMutation } from '../../redux/services/comment'
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    comment: CommentType,
    isOpen: boolean,
    postType: string,
}

export const Comment = ({comment, isOpen = false, postType}: Props) => {
    const [deleteComment] = useDeleteCommentMutation();
    const [error, setError] = useState<string>('')

    const deleteCommentHandler = async () => {
        try {
            if(window.confirm('Are you sure you want ot delete this comment?')){
                let deletedComment;
                if(postType === 'Project'){
                    deletedComment = {
                        projectId: comment.projectId,
                        commentId: comment._id,
                    }
                }
                else{
                    deletedComment = {
                        vacancyId: comment.vacancyId,
                        commentId: comment._id,
                    }                    
                }
                
                await deleteComment(deletedComment).unwrap()
                    .then(() => {
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
            <img src={comment.user.avatarURL ? `http://localhost:5000${comment.user.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Pic" /> 
        </div>

        <div className={styles.information}>
            <div className={styles.name}>
                {comment.user.nickname}
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
