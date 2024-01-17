import React, { useState } from 'react'
import styles from './index.module.scss'

import { useDeleteVacancyMutation, useGetAllVacanciesQuery } from '../../redux/services/vacancy'
import { Vacancy as VacancyType } from '../../redux/slices/vacancy'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../redux/slices/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useSavePostMutation, useUnsavePostMutation } from '../../redux/services/save'
import { setCurrentLevel, setCurrentPosition, setCurrentSkill } from '../../redux/slices/filter'
import clsx from 'clsx'

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmailIcon from '@mui/icons-material/Email';
import TvIcon from '@mui/icons-material/Tv';
import BuildIcon from '@mui/icons-material/Build';
import LayersIcon from '@mui/icons-material/Layers';

import { FormatDate } from '../../helpers';
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { useDeleteProjectMutation } from '../../redux/services/project';
import { setCurrentTag } from '../../redux/slices/filter';

import axios, { AxiosResponse } from 'axios';
import toast, { Toaster } from 'react-hot-toast';


type Props = {
  vacancy: VacancyType,
  isEditable?: boolean,
  isFullVacancy?: boolean,
  isSavePage?: boolean,
  isProfile?: boolean,
}

export const Vacancy = ({vacancy, isFullVacancy = false, isEditable = false, isSavePage = false, isProfile = false}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {_id, title, skills, position, aboutVacancy, requirements, comments, contact, createdAt, viewCount, user} = vacancy;    
  const currentUser = useSelector(selectUser);
  
  const [deleteVacancy] = useDeleteVacancyMutation();
  const [savePost] = useSavePostMutation();
  const [unsavePost] = useUnsavePostMutation();

  const [error, setError] = useState<string>('')
  const [saveClass, setSaveClass] = useState<string>(currentUser?.savedPosts.includes(vacancy._id) ? styles.saved : styles.save);

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

  const deleteVacancyHandler = async () => {
    if (window.confirm('Are you sure you want to delete this Vacancy?')){
        await deleteVacancy(_id).unwrap()
        .then(() => {
            if(isFullVacancy){
                navigate('/dashboard');
            }
        })
        .catch(err => {
            console.log(err);
            throw new Error('Error: ' + err)
        })
    }
  }

  const filterBySkillHandler = (skill: string) => {
    console.log(skill);
    
    dispatch(setCurrentSkill(skill))
  }

  const filterByLevelHandler = (level: string) => {
    console.log(level);
    
    dispatch(setCurrentLevel(level))
  }

  const filterByPositionHandler = (position: string) => {
    console.log(position);
    
    dispatch(setCurrentPosition(position))
  }

  const saveVacancyHandler = async () => {
    try {
        if(!currentUser){
            alert('You need to register to save any of these vacancies!')
            return null;
        }

        if(saveClass === styles.save){
            await savePost({postId: _id})
            .unwrap()
            .then(() => {
                setSaveClass(styles.saved)
            })
            .catch(error => {
                setError(error.data.message || error.data.errors[0].msg);
            })
        }
        else if(saveClass === styles.saved){
            await unsavePost({postId: _id})
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

  const applyHandler = () => {
    if(window.confirm('Are you sure you want to apply?')){
      toast.success("Successfully applied!")
    }
  }

  return (
    <div className={clsx(styles.vacancy, {[styles.vacancyFull]: isFullVacancy}, {[styles.vacancySmall]: isSavePage})}>
        <div className={styles.avatar}>
            <img src={user.avatarURL ? `http://localhost:5000${user.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Avatar" />   
        </div>

        <div className={clsx(styles.content, {[styles.contentFull]: isFullVacancy}, {[styles.contentSmall]: isSavePage})}>

            <div className={clsx(styles.user_title, {[styles.user_titleSmall]: isSavePage})}>
                <Link to={`/user/profile/${user.nickname}`} className={clsx(styles.name, {[styles.nameFull]: isFullVacancy}, {[styles.nameSmall]: isSavePage})}>
                    {user.nickname}
                </Link>

                <div className={clsx(styles.time, {[styles.timeFull]: isFullVacancy}, {[styles.timeSmall]: isSavePage})}>
                    {FormatDate(createdAt)}
                </div>
                
            </div>

            {
                isFullVacancy ? (
                         <>
                            <div className={styles.titleFull}> 
                                {title} 
                            </div> 

                            {/* <div className={styles.idea}> 
                                {idea} 
                            </div>  */}

                            <div className={styles.aboutVacancy}> 
                                <p>About Vacancy:</p>
                                <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(aboutVacancy)))} readOnly={true} onChange={() => {}}/> 
                            </div>
                            
                            <div className={styles.requirements}> 
                              <p>Requirements:</p>
                                <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(requirements)))} readOnly={true} onChange={() => {}}/> 
                            </div>

                            {/* <div className={styles.projectTeam}>
                                <p>Project team:</p>
                                {
                                    projectTeam.map(member => (
                                        <Link to={`http://localhost:3000/user/profile/${member.nickname}`} key={member._id} className={styles.member}>
                                            <img src={member.avatarURL ? `http://localhost:5000${member.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Pic" />
                                            <span>{member.nickname}</span>
                                        </Link>
                                    ))
                                }
                            </div>                */}
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
                    <>
                        <div className={styles.skills}>
                            {
                                skills.map(skill => <p onClick={() => !isFullVacancy && !isSavePage && !isProfile && filterBySkillHandler(skill)} key={skill} className={styles.skill}>#{skill}</p>)
                            }
                        </div>
                    </>
                )
            }

            <div className={clsx(styles.info, {[styles.infoSmall]: isSavePage})}>
              {/* <div className={styles.stageClass(tag)}>  */}
                <div className={styles.position}> 
                    <p>{position}</p>
                </div>
                <div className={styles.viewCount}>
                    <VisibilityIcon/>
                    <p>{viewCount}</p>
                </div>
                <div className={styles.commentsLength}>
                    <CommentIcon/>
                    <p>{comments.length}</p>
                </div>
                <div onClick={saveVacancyHandler}>
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
                !isEditable && (
                    <div className={styles.active_buttons}>
                        <Link className={styles.edit} to={`/user/vacancy/${vacancy._id}/edit`}>
                            <EditIcon fontSize='large' />
                        </Link>
                        <div className={styles.delete} onClick={deleteVacancyHandler}>
                            <DeleteOutlineIcon fontSize='large' />
                        </div>
                    </div>
                )
            }
        </div>

        {
            isFullVacancy && isEditable &&
            <div className={styles.contact} onClick={applyHandler}>
                <div className={styles.contact_link}>
                  <EmailIcon fontSize='large' sx={{cursor: 'pointer'}}/>
                  <p>Apply now</p>
                </div>
                <Toaster />
            </div>
        } 

      <div className={styles.icon}>
        {
          position === 'Full-Stack' ?
            <LayersIcon fontSize='large'/>
          : position === 'Backend' ?
            <BuildIcon fontSize='large'/>
          : <TvIcon fontSize='large'/>
        }
      </div>
    </div>
  )
}
