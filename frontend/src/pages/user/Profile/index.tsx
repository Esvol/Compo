import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Layout } from '../../../components/layout'
import { useCurrentQuery, useEditMutation } from '../../../redux/services/auth'
import { useNavigate, useParams } from 'react-router-dom';
import styles from './index.module.scss'
import { useForm } from 'react-hook-form';
import { useGetAllProjectsQuery } from '../../../redux/services/project';
import { Project } from '../../../components/Project';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Preloader } from '../../../components/Preloader';
import { useDispatch, useSelector } from 'react-redux';
import { UserType, selectUser } from '../../../redux/slices/auth';
import clsx from 'clsx';
import { useGetAllVacanciesQuery } from '../../../redux/services/vacancy';
import { Vacancy } from '../../../components/Vacancy';
import { RootState } from '../../../redux/store';
import { setPage } from '../../../redux/slices/filter';
import { ErrorPage } from '../../dashboard/ErrorPage';

export type EditType = {
  email: string,
  nickname: string,
  level: 'Frontend' | 'Backend' | 'Full Stack',
  avatarURL?: string,
}

const editOptions = {
  email: {
    required: {
      value: true, 
      message: 'You need to fulfill new email!'
    }
  },
  nickname: {
    required: {
      value: true, 
      message: 'You need to fulfill your first name!'
    },
    minLength: {
      value: 2,
      message: 'First name should be at least 2 characters!'
    }
  },
}

export const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {value} = useParams();
    
    const user = useSelector(selectUser)
    const page = useSelector((state: RootState) => state.filter.page)
    
    const {data: projects, isLoading: isLoadingProjects} = useGetAllProjectsQuery();
    const {data: vacancies, isLoading: isLoadingVacancies} = useGetAllVacanciesQuery();

    const [editProfile] = useEditMutation();    

    const [profile, setProfile] = useState<UserType>()
    const [edit, setEdit] = useState(false);
    const [myProfile, setMyProfile] = useState(true)
    
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [error, setError] = useState('')

    const inputAvatarRef = useRef<HTMLInputElement | null>(null);
    const [avatarURL, setAvatarURL] = useState(user?.avatarURL ?? '')

    const levelProfileClass = 
    (profile?.level === 'Frontend') ? styles.frontend_level 
    :
    (profile?.level === 'Backend') ? styles.backend_level 
    :
    (profile?.level === 'Full Stack') ? styles.fullStack_level : styles.level

    const levelUserClass = 
    (user?.level === 'Frontend') ? styles.frontend_level 
    :
    (user?.level === 'Backend') ? styles.backend_level 
    :
    (user?.level === 'Full Stack') ? styles.fullStack_level : styles.level

    const {register, reset, handleSubmit, formState: {errors}} = useForm<EditType>({
      defaultValues: {
        email: '',
        nickname: '',
        level: 'Frontend',
        avatarURL: '',
      }
    });

    const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        const formData = new FormData()
        if (e.target.files){
            const file = e.target.files[0];                
            formData.append('image', file);
            const { data } = await axios.post('http://localhost:5000/uploads', formData);
            setAvatarURL(data.url);
            await axios.post('http://localhost:5000/delete/uploads', {oldAvatar: user?.avatarURL})
        }
      } catch (error) {
          console.log(error);
          alert('Error, upload file')
      }
    }

    const submitEditHandler = async (data: EditType) => {
      try {
        data.avatarURL = avatarURL;
        console.log(data);
        await editProfile(data).unwrap()
          .then(() => {
              navigate(`/user/profile/${data.nickname}`)
          })
          .catch(error => {
              setError(error.data.message || error.data.errors[0].msg);
          })

        setEdit(!edit)
        reset();
      } catch (error) {
        console.log(error);
        throw new Error('Error' + error)
      }
    }

    const changePageHandler = (page: string) => {
      dispatch(setPage(page))
    }

    useEffect(() => {
        axios.get(`http://localhost:5000/user/profile/${value}`)
          .then(({data}: AxiosResponse<UserType>) => {
            setProfile(data);
            setMyProfile(data._id === user?._id)
            setIsLoadingUser(false)
          })
          .catch((error: Error | AxiosError) => {
            console.log(error);
            navigate('/error')
          })
    }, [value])

    if(isLoadingUser || isLoadingProjects || isLoadingVacancies){
      return <Preloader />
    }
  
    if(!projects || !vacancies){
      return <ErrorPage error={'Problem with getting projects/vacancies'}/>
    }

  return (
    <Layout>
        <div className={styles.profile_header}>
          <p className={styles.title}>Profile</p>
          <div className={styles.filter_page}>
              <div className={`${styles.project_page} ${page === 'Projects' ? styles.project_active : ''}`} onClick={() => changePageHandler('Projects')}>Projects</div>
              <div className={`${styles.vacancy_page} ${page === 'Vacancies' ? styles.vacancy_active : ''}`} onClick={() => changePageHandler('Vacancies')}>Vacancies</div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.left_container}>
            {
              myProfile
              ? (
                <>
                  <input type="file" ref={inputAvatarRef} onChange={handleChangeAvatar} hidden/>
                  <div onClick={() => edit ? inputAvatarRef.current?.click() : {}} className={clsx(styles.avatar, {[styles.avatarEdit]: edit})}>
                    <img src={avatarURL ? `http://localhost:5000${avatarURL}` : user?.avatarURL ? `http://localhost:5000${user?.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Pic" /> 
                  </div>
                  <p className={styles.user_name}>{user?.nickname}</p>
                  <p className={levelUserClass}>{user?.level}</p>
                  <p className={styles.user_email}>{user?.email}</p>
                  {
                    edit 
                    ? (
                      <form className={styles.form} method='post' onSubmit={handleSubmit(submitEditHandler)}>
                        <input type='email' placeholder='Enter email..' {...register('email', editOptions.email)}/>
                        {errors.email && <label>{errors.email.message}</label>}
                        
                        <input type='text' placeholder='Enter nickname..' {...register('nickname', editOptions.nickname)}/>
                        {errors.nickname && <label>{errors.nickname.message}</label>}

                        <select id="developer_level" {...register('level')}>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Full Stack">Full Stack</option>
                        </select>
                        {errors.level && <label>{errors.level.message}</label>}

                        <div className={styles.buttons}>
                          <button className={styles.save_button} type='submit'>Save</button>
                          <button className={styles.cancel_button} onClick={() => {setEdit(!edit); reset(); setAvatarURL('');}}>Cancel</button>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                      </form>
                    )
                    : <div className={styles.edit_button} onClick={() => setEdit(!edit)}>Edit</div>
                  } 
                </>
              ) 
              : (
                <>
                  <div className={styles.avatar}>
                    <img src={profile?.avatarURL ? `http://localhost:5000${profile.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Pic" /> 
                  </div>
                  <p className={styles.user_name}>{profile?.nickname}</p>
                  <p className={levelProfileClass}>{profile?.level}</p>
                  <p className={styles.user_email}>{profile?.email}</p>
                </>
              ) 
            }
          </div>

          <div className={styles.right_container}>
            {
              page === 'Projects' ?
              myProfile
              ? (
                [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((project, index) => project.user._id === user?._id && <Project key={project._id} project={project} isEditable={true} isProfile={true}/>)
              ) 
              : (
                [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((project, index) => project.user._id === profile?._id && <Project key={project._id} project={project} isProfile={true}/>)
              ) 

              :
              myProfile
              ? (
                [...vacancies].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((vacancy, index) => vacancy.user._id === user?._id && <Vacancy key={vacancy._id} vacancy={vacancy} isEditable={true} isProfile={true}/>)
              ) 
              : (
                [...vacancies].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((vacancy, index) => vacancy.user._id === profile?._id && <Vacancy key={vacancy._id} vacancy={vacancy} isProfile={true}/>)
              ) 
            }
              
          </div>

        </div>
    </Layout>
  )
}
