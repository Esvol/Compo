import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import styles from './index.module.scss'
import { Paper, Typography } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useForm } from "react-hook-form"
import { useLoginMutation } from '../../../redux/services/auth';
import { useNavigate } from 'react-router';

export type FormDataLogin = {
  email: string,
  password: string,
}

const defaultValues = {
  email: '',
  password: '',
}

export const Login = () => {
  const navigate = useNavigate();

  const [loginUser] = useLoginMutation();
  const [error, setError] = useState("");
  console.log(error);
  
  const {register, reset, handleSubmit, formState: {errors}} = useForm<FormDataLogin>({
    defaultValues,
    mode: 'onChange',
  });

  const loginOptions = { 
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

  const onSubmitForm = async (data: FormDataLogin) => {
    await loginUser(data).unwrap()
      .then(() => {        
        navigate('/dashboard');
      })
      .catch((err) => {        
        reset(defaultValues);
        setError(err.data.message || err.data.errors[0].msg);
      });
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
              Login
            </Typography>
            
            <form method='post' className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>

                <div className={styles.div}>
                  <input 
                    {...register('email', loginOptions.email)}
                    required autoComplete="off" placeholder='*Email' type='email' id='email' name='email' className={styles.input}/>
                  <label className={styles.label} id='email'>
                    {errors.email ? errors.email.message : ''}
                  </label>
                </div>

                <div className={styles.div}>
                  <input 
                    {...register('password', loginOptions.password)}
                    required autoComplete="off" placeholder='*Password' type='password' id='password' name='password' className={styles.input}/>
                  <label className={styles.label} id='password'>
                    {errors.password ? errors.password.message : ''}
                  </label>
                </div>

                <button type='submit' className={styles.login_button}> 
                  <HowToRegIcon sx={{mr: 1}}/>
                  Log in
                </button>

                {
                  error && <p className={styles.error}>{error}</p>
                }
            </form>

        </Paper>
    </Layout>
  )
}