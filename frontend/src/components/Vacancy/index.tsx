import React, { useState } from 'react'
import styles from './index.module.scss'

import { useDeleteVacancyMutation, useGetAllVacanciesQuery } from '../../redux/services/vacancy'
import { Vacancy as VacancyType } from '../../redux/slices/vacancy'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../redux/slices/auth'
import { useNavigate } from 'react-router-dom'
import { useSavePostMutation, useUnsavePostMutation } from '../../redux/services/save'
import { setCurrentLevel, setCurrentPosition, setCurrentSkill } from '../../redux/slices/filter'
import clsx from 'clsx'

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
  return (
    <div className={clsx(styles.vacancy, {[styles.vacancyFull]: isFullVacancy}, {[styles.vacancySmall]: isSavePage})}>
        hey
    </div>
  )
}
