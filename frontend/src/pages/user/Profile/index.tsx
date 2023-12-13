import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { useCurrentQuery, useEditMutation } from '../../../redux/services/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styles from './index.module.scss'
import { useForm } from 'react-hook-form';
import { useGetAllProjectsQuery } from '../../../redux/services/project';
import { Project } from '../../../components/Project';
import { User } from '../../../redux/slices/project';
import axios, { AxiosResponse } from 'axios';

export type EditType = {
  email: string,
  firstName: string,
  lastName: string,
}

const editOptions = {
  email: {
    required: {
      value: true, 
      message: 'You need to fulfill new email!'
    }
  },
  firstName: {
    required: {
      value: true, 
      message: 'You need to fulfill your first name!'
    },
    minLength: {
      value: 2,
      message: 'First name should be at least 2 characters!'
    }
  },
  lastName: {
    required: {
      value: true, 
      message: 'You need to fulfill your last name!'
    },
    minLength: {
      value: 2,
      message: 'Last name should be at least 2 characters!'
    }
  }
}

export const Profile = () => {
    const navigate = useNavigate();
    const {value} = useParams();
    const {data: user} = useCurrentQuery();
    const {data: projects} = useGetAllProjectsQuery();
    const [editProfile] = useEditMutation();

    console.log(projects);
    

    const [profile, setProfile] = useState<User>()
    const [edit, setEdit] = useState(false);
    const [myProfile, setMyProfile] = useState(true)
    const [error, setError] = useState('')

    const {register, reset, handleSubmit, formState: {errors}} = useForm<EditType>({
      defaultValues: {
        email: '',
        firstName: '',
        lastName: '',
      }
    });

    const submitEditHandler = async (data: EditType) => {
      try {
        console.log(data);
        
        await editProfile(data).unwrap()
          .then(() => {
              console.log('Good');
          })
          .catch(error => {
              setError(error.data.message || error.data.errors[0].msg);
          })
        setEdit(!edit)
      } catch (error) {
        console.log(error);
        throw new Error('Error' + error)
      }
    }

    useEffect(() => {
      axios.get(`http://localhost:5000/user/profile/${value}`)
        .then(({data}: AxiosResponse<User>) => {
          setProfile(data);
          setMyProfile(data._id === user?._id)
        })
        .catch(error => {
          navigate('/dashboard')
          console.log(error);
        })
    }, [user, value])

    if(!value){ //|| !userProfile
      return <Navigate to={'/dashboard'}/>
    }

  return (
    <Layout>
        <p className={styles.title}>Profile</p>
        <div className={styles.container}>
          <div className={styles.left_container}>
            {
              myProfile
              ? (
                <>
                  <div className={styles.avatar}>
                    <img src={"https://lostfilm.info/images/photo/92/118107_910772.jpg"} alt="Pic" /> 
                            {/* user.avatarURL ??*/}
                  </div>
                  <p className={styles.user_name}>{user?.firstName} {user?.lastName}</p>
                  <p className={styles.user_email}>{user?.email}</p>

                  {
                    edit 
                    ? (
                      <form className={styles.form} method='post' onSubmit={handleSubmit(submitEditHandler)}>
                        <input type='email' placeholder='Enter email..' {...register('email', editOptions.email)}/>
                        {errors.email && <label>{errors.email.message}</label>}
                        
                        <input type='text' placeholder='Enter first name..' {...register('firstName', editOptions.firstName)}/>
                        {errors.firstName && <label>{errors.firstName.message}</label>}

                        <input type='text' placeholder='Enter last name..' {...register('lastName', editOptions.lastName)}/>
                        {errors.lastName && <label>{errors.lastName.message}</label>}

                        <div className={styles.buttons}>
                          <button className={styles.save_button} type='submit'>Save</button>
                          <button className={styles.cancel_button} onClick={() => {setEdit(!edit); reset();}}>Cancel</button>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                      </form>
                    )
                    : <div className={styles.edit_button} onClick={() => setEdit(!edit)}>Edit</div>
                  } 
                </>
              ) // : (<p></p>)
              : (
                <>
                  <div className={styles.avatar}>
                    <img src={"https://lostfilm.info/images/photo/92/118107_910772.jpg"} alt="Pic" /> 
                            {/* user.avatarURL ??*/}
                  </div>
                  <p className={styles.user_name}>{profile?.firstName} {profile?.lastName}</p>
                </>
              ) 
            }
          </div>

          <div className={styles.right_container}>
            {
              myProfile
              ? (
                [...projects ?? []].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((project, index) => project.user._id === user?._id && <Project key={project._id} currentUser={user} project={project} isEditable={true}/>)
              ) 
              : (
                [...projects ?? []].sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
                .map((project, index) => project.user._id === profile?._id && <Project key={project._id} currentUser={null} project={project}/>)
              ) 
            }
          </div>

        </div>
    </Layout>
  )
}
