import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useForm } from "react-hook-form"
import { useCurrentQuery, useRegisterMutation } from '../../../redux/services/auth';
import { useNavigate } from 'react-router';
import axios from 'axios';

import TvIcon from '@mui/icons-material/Tv';
import BuildIcon from '@mui/icons-material/Build';
import LayersIcon from '@mui/icons-material/Layers';
import { Notification } from '../../../redux/slices/auth';
import Verification from '../../../components/Verification';
import { useDispatch, useSelector } from 'react-redux';
import { setVerification } from '../../../redux/slices/filter';
import { RootState } from '../../../redux/store';

export type FormRegisterData = {
  nickname: string,
  position: 'Frontend' | 'Backend' | 'Full Stack',
  email: string,
  role: 'user' | 'company',
  password: string,
  savedPosts: string[],
  avatarURL?: string,
  notifications: Notification[],
};

export const UserRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const verification = useSelector((state: RootState) => state.filter.verification)

  const [registerUser] = useRegisterMutation();
  const [error, setError] = useState("");

  const inputImageRef = useRef<HTMLInputElement | null>(null);
  const [avatarURL, setAvatarURL] = useState("")
  const [role, setRole] = useState<'user' | 'company'>('user')

  const {register, handleSubmit, reset, formState: { errors }, } = useForm<FormRegisterData>({
    defaultValues: {
      nickname: '',
      position: 'Frontend',
      email: '',
      password: '',
    },
    mode: 'onChange'
  })

  const registerOptions = {
    nickname: {required: "Nickname is required!"} , 
    email: {
      required: "Email is required!",
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: "Entered value does not match email format",
      },
    },
    password: {
      required: "Password is required!",
      minLength: {
        value: 4,
        message: "Password must have at least 4 characters"
      }
    }
  }

  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData()
      if (e.target.files){
          const file = e.target.files[0];                
          formData.append('image', file);
          const { data } = await axios.post('http://localhost:5000/uploads', formData);
          setAvatarURL(data.url);
      }
    } catch (error) {
        console.log(error);
        alert('Error, upload file')
    }
  }

  const onSubmitForm = async (data: FormRegisterData) => {
    try {      
      data.avatarURL = avatarURL;
      data.role = role;
      if(data.role === 'user'){
        await registerUser(data).unwrap()
        .then(() => {
          navigate('/dashboard');        
        })
        .catch((error) => {        
          reset({
            nickname: '',
            position: 'Frontend',
            email: '',
            password: '',
          });
          setError(error.data.message || error.data.errors[0].msg);
        });
      }
      else{
        dispatch(setVerification(true));
      }
      
    } catch (error) {
      reset({
        nickname: '',
        position: 'Frontend',
        email: '',
        password: '',
      });
      return 'Some problem with submit the register form.'
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')){
      navigate('/dashboard')
    }
  }, [])


  return (
    <Layout>
      

      {
        !verification ? 
        (
          <>
          <div className={styles.role}>
            <div className={`${styles.role_user} ${role === 'user' ? styles.role_user_active : ''}`} onClick={() => setRole('user')}>Developer</div>
            <div className={`${styles.role_company} ${role === 'company' ? styles.role_company_active : ''}`} onClick={() => setRole('company')}>Company</div>
          </div>
          
          <Paper className={styles.root}>
            <Typography classes={{root: styles.title}} variant="h5">
              Create new account
            </Typography>
            <div className={styles.avatar}>
                <Button onClick={() => inputImageRef.current?.click()} disabled={avatarURL ? true : false} variant="outlined">
                  {
                    avatarURL 
                    ? 
                      <img className={styles.image} src={`http://localhost:5000${avatarURL}`} alt="Image" />
                    :
                    (
                      <Avatar sx={{ width: 60, height: 60, bgcolor: deepPurple[800]}} src='' alt="Fake">
                        <FaceRetouchingNaturalIcon sx={{fontSize: '2rem', color: '#bbbbbb'}}/>
                      </Avatar>
                    )
                  }
                </Button>
                {
                avatarURL && (
                <Button variant="contained" color="error" onClick={() => setAvatarURL('')}>
                        Delete
                </Button>
                )}
                <input type="file" ref={inputImageRef} onChange={handleChangeImage} hidden />
            </div>

            <form method='post' className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
                  {
                    role === 'user' && (
                      <div className={styles.radio_group_container}>
                        <p>What kind of developer are you?</p>
                        <div className={styles.radio_group}>
                          <div className={styles.input_level_container}>
                            <input className={`${styles.input_radio} ${styles.input_radio_1}`} id="Frontend" type="radio" value='Frontend' {...register('position')}/>
                            <div className={styles.radio_title}>
                              <TvIcon />
                              <label className={styles.label_radio} htmlFor="Frontend">Frontend</label>
                            </div>
                          </div>

                          <div className={styles.input_level_container}>
                            <input className={styles.input_radio} id="Backend" type="radio" value='Backend' {...register('position')}/>
                            <div className={styles.radio_title}>
                              <BuildIcon/>
                              <label className={styles.label_radio} htmlFor="Backend">Backend</label>
                            </div>
                          </div>

                          <div className={styles.input_level_container}>
                            <input className={styles.input_radio} id="Full Stack" type="radio" value='Full Stack' {...register('position')}/>
                            <div className={styles.radio_title}>
                              <LayersIcon/>
                              <label className={styles.label_radio} htmlFor="Full Stack">Full Stack</label>
                            </div>
                          </div>
                          <label className={styles.label} id='level'>
                              {errors.position ? errors.position.message : ''}
                          </label>
                        </div>
                        
                      </div>
                    )
                  }

                <div className={styles.input_container}>
                  <input 
                    {...register('nickname', registerOptions.nickname)}
                    required autoComplete="off" placeholder='*Nickname' type='text' id='nickname' name='nickname' className={styles.input_info}/>
                  <label className={styles.label} id='nickname'>
                    {errors.nickname ? errors.nickname.message : ''}
                  </label>
                </div>

                <div className={styles.input_container}>
                  <input 
                    {...register('email', registerOptions.email)}
                    required autoComplete="off" placeholder={role === 'user' ? '*Email' : '*Email (use your company email)'} type='email' id='email' name='email' className={styles.input_info}/>
                  <label className={styles.label} id='email'>
                    {errors.email ? errors.email.message : ''}
                  </label>
                </div>

                <div className={styles.input_container}>
                  <input 
                    {...register('password', registerOptions.password)}
                    required autoComplete="off" placeholder='*Password' type='password' id='password' name='password' className={styles.input_info}/>
                  <label className={styles.label} id='password'>
                    {errors.password ? errors.password.message : ''}
                  </label>
                </div>

                <button type='submit' className={styles.create_button}> 
                  <HowToRegIcon sx={{mr: 1}}/>
                  Create
                </button>

                {
                  error && <p className={styles.error}>{error}</p>
                }
            </form>

          </Paper>
          </>
        ) : (
          <Verification />
        )
      }
    </Layout> 
  )
}
