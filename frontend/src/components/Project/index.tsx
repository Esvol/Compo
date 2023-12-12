import React, { useState } from 'react'
import styles from './index.module.scss'
import './index.module.scss'

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Project as ProjectType, User } from '../../redux/slices/project';
import { Link, useNavigate } from 'react-router-dom';
import { FormatDate } from '../../helpers';
import clsx from 'clsx';

import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { useDeleteProjectMutation } from '../../redux/services/project';
import { useSaveProjectMutation, useUnsaveProjectMutation } from '../../redux/services/save';

type Props = {
    currentUser?: User | null,
    project: ProjectType,
    isFullProject?: boolean,
    isEditable?: boolean,
    isSavePage?: boolean,
}

export const Project = ({currentUser, project, isFullProject = false, isEditable = false, isSavePage = false} : Props) => {
    const navigate = useNavigate();
    const {_id, title, idea, text, user, stage, tags, comments, createdAt, viewCount} = project;
    
    const [deleteProject] = useDeleteProjectMutation();
    const [saveProject] = useSaveProjectMutation();
    const [unsaveProject] = useUnsaveProjectMutation();

    const [error, setError] = useState<string>('')
    const [saveClass, setSaveClass] = useState(currentUser?.savedPosts.includes(project._id) ? styles.saved : styles.save);

    const stageClass = (stage: string) => {
        const stageCl = 
        stage === 'Beginner'
      ? styles.beginner
      : stage === 'Mid-development'
      ? styles.middle
      : stage === 'Almost finished'
      ? styles.almost_finished
      : stage === 'Testing'
      ? styles.testing
      : stage === 'Maintenance'
      ? styles.maintenance
      : '';

      return stageCl;
    }

    const deleteProjectHandler = async () => {
        if (window.confirm('Are you sure you want to delete this project?')){
            await deleteProject(_id).unwrap()
            .then(() => {
                if(isFullProject){
                    navigate('/dashboard');
                }
            })
            .catch(err => {
                console.log(err);
                throw new Error('Error: ' + err)
            })
        }
    }

    const saveProjectHandler = async () => {
        try {
            if(!currentUser){
                alert('You need to register to save any of these projects!')
                return null;
            }

            if(saveClass === styles.save){
                await saveProject({projectId: _id})
                .unwrap()
                .then(() => {
                    setSaveClass(styles.saved)
                })
                .catch(error => {
                    setError(error.data.message || error.data.errors[0].msg);
                })
            }
            else if(saveClass === styles.saved){
                await unsaveProject({projectId: _id})
                    .unwrap()
                    .then(() => {
                        setSaveClass(styles.save)
                    })
                    .catch(error => {
                        setError(error.data.message || error.data.errors[0].msg);
                    })
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error: ' + error)
        }
    }

  return (
    <div className={clsx(styles.project, {[styles.projectFull]: isFullProject}, {[styles.projectSmall]: isSavePage})}>
        <div className={styles.avatar}>
            <img src={"https://lostfilm.info/images/photo/92/118107_910772.jpg"} alt="Pic" /> 
                    {/* user.avatarURL ??*/}
        </div>

        <div className={clsx(styles.content, {[styles.contentFull]: isFullProject}, {[styles.contentSmall]: isSavePage})}>

            <div className={clsx(styles.user_title, {[styles.user_titleSmall]: isSavePage})}>
                <div className={clsx(styles.name, {[styles.nameFull]: isFullProject}, {[styles.nameSmall]: isSavePage})}>
                    {user.firstName} {user.lastName}
                </div>

                <div className={clsx(styles.time, {[styles.timeFull]: isFullProject}, {[styles.timeSmall]: isSavePage})}>
                    {FormatDate(createdAt)}
                </div>
            </div>

            {
                isFullProject ? (
                         <>
                            <div className={styles.titleFull}> 
                                {title} 
                            </div> 

                            <div className={styles.idea}> 
                                {idea} 
                            </div> 

                            <div className={styles.textFull}> 
                                <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(text)))} readOnly={true} onChange={() => {}}/> 
                            </div> 
                         </>
                ) : (
                    <Link to={`/dashboard/${_id}`} style={{textDecoration: 'none'}}>
                        <div className={clsx(styles.title, {[styles.titleSmall]: isSavePage})}>
                            {title}
                        </div>
                    </Link>
                )
            }

            {
                !isSavePage && (
                    <div className={styles.tags}>
                        {
                            tags.map(tag => <p key={tag} className={styles.tag}>#{tag}</p>)
                        }
                    </div>
                )
            }

            <div className={clsx(styles.info, {[styles.infoSmall]: isSavePage})}>
                <div className={stageClass(stage)}>
                    <p>{stage}</p>
                </div>
                <div className={styles.viewCount}>
                    <VisibilityIcon/>
                    <p>{viewCount}</p>
                </div>
                <div className={styles.commentsLength}>
                    <CommentIcon/>
                    <p>{comments.length}</p>
                </div>
                <div onClick={saveProjectHandler}>
                    {
                        saveClass === styles.save 
                        ?
                        <FavoriteBorderIcon className={saveClass}/>
                        :
                        <FavoriteIcon className={saveClass} />
                    }
                </div>
            </div>

                {
                    isEditable && (
                        <div className={styles.active_buttons}>
                            <Link className={styles.edit} to={`/user/projects/${project._id}/edit`}>
                                <EditIcon fontSize='large' />
                            </Link>
                            <div className={styles.delete} onClick={deleteProjectHandler}>
                                <DeleteOutlineIcon fontSize='large' />
                            </div>
                        </div>
                    )
                }
        </div>
    </div>
  )
}
