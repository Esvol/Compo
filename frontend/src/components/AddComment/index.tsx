import React, { FormEvent, useState } from 'react'
import styles from './index.module.scss'
import { useParams } from 'react-router-dom'
import { useCreateCommentMutation } from '../../redux/services/comment'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
    isOpen?: boolean
}


export type CommentInput = {
    text: string,
    projectId: string,
    type: string,
}

export const AddComment = ({isOpen = false}: Props) => {
    const {id : projectId} = useParams();
    const [createComment] = useCreateCommentMutation();
    const {register, reset, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            value: ''
        },
        mode: 'onChange',
    })

    const handleCommentSubmit: SubmitHandler<{ value: string }> = async (data) => {
        try {
            if(projectId){
                const comment: CommentInput = {
                    text: data.value,
                    projectId: projectId,
                    type: 'project'
                }
    
                await createComment(comment).unwrap()
                    .then(() => {
                        reset();
                    })
                    .catch(error => {
                    console.log("Error with creating the comment: ", error);
                    throw new Error(error);
                })
            }
            
        } catch (error) {
            console.log('error with creating a comment' + error);
            throw new Error(`${error}`)
        }
    }

  return (
    <div className={styles.container}>
        <div className={styles.avatar}>
            <img src={"https://lostfilm.info/images/photo/92/118107_910772.jpg"} alt="Pic" /> 
                    {/* user.avatarURL ??*/}
        </div>

        {
            isOpen 
            ? (
                <form method='post' className={styles.add_comment} onSubmit={handleSubmit(handleCommentSubmit)}>
                    <input type="text" placeholder='Comment...' {...register('value', {required: true, minLength: {value: 1, message: 'Comment should has at least 1 symbol!'}})}/>
                    {
                        errors.value && <p className={styles.error}>Message should has at least 1 symbol!</p> 
                    }
                    <button type='submit'>Send</button>
                </form>
            )
            : (
                <div className={styles.disabled_input}> You need to login to write a comment. </div>
            )
        }
    </div>
  )
}
