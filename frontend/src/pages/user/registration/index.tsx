import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useForm } from "react-hook-form"
import { useRegisterMutation } from '../../../redux/services/auth';
import { useNavigate } from 'react-router';
import axios from 'axios';


export type FormRegisterData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  savedPosts: string[],
  avatarURL?: string,
};

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

export const UserRegistration = () => {
  const navigate = useNavigate();

  const [registerUser] = useRegisterMutation();
  const [error, setError] = useState("");

  const inputImageRef = useRef<HTMLInputElement | null>(null);
  const [avatarURL, setAvatarURL] = useState("")

  const {register, handleSubmit, reset, formState: { errors }, } = useForm<FormRegisterData>({
    defaultValues,
    mode: 'onChange'
  })

  const registerOptions = {
    firstName: {required: "First name is required!"} , 
    lastName: {required: "Last name is required!"} ,
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
      await registerUser(data).unwrap()
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {        
        reset(defaultValues);
        setError(error.data.message || error.data.errors[0].msg);
      });
    } catch (error) {
      reset(defaultValues);
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
                <div className={styles.input_container}>
                  <input 
                    {...register('firstName', registerOptions.firstName)}
                    required autoComplete="off" placeholder='*First name' type='text' id='firstName' name='firstName' className={styles.input}/>
                  <label className={styles.label} id='firstName'>
                    {errors.firstName ? errors.firstName.message : ''}
                  </label>
                </div>

                <div className={styles.input_container}>
                  <input 
                    {...register('lastName', registerOptions.lastName)}
                    required autoComplete="off" placeholder='*Last name' type='text' id='lastName' name='lastName' className={styles.input}/>
                  <label className={styles.label} id='lastName'>
                    {errors.lastName ? errors.lastName.message : ''}
                  </label>
                </div>

                <div className={styles.input_container}>
                  <input 
                    {...register('email', registerOptions.email)}
                    required autoComplete="off" placeholder='*Email' type='email' id='email' name='email' className={styles.input}/>
                  <label className={styles.label} id='email'>
                    {errors.email ? errors.email.message : ''}
                  </label>
                </div>

                <div className={styles.input_container}>
                  <input 
                    {...register('password', registerOptions.password)}
                    required autoComplete="off" placeholder='*Password' type='password' id='password' name='password' className={styles.input}/>
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
    </Layout> 
  )
}
