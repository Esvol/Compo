import React, { useRef, useState } from 'react'
import styles from './index.module.scss'
import { Layout } from '../../../components/layout'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'


type VacancyInput = {
  title: string,
  skills: string,
  position: string,
  level: string,
  aboutVacancy: string,
  requirements: string,
  tags: string,
  contact: string,
  user: string,
}

const vacancyOptions = {
  title: {
    required: "Title is required!",
    minLength: {
      value: 2,
      message: "Title must have at least 2 characters!"
    }
  },
  skills: {
    required: "Skills are required!",
    minLength: {
      value: 1,
      message: "At least one skill is required!"
    }
  },
  contact: {
    required: "Contact is required!",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Invalid email!",
    },
  },
  level: {
    required: "Title is required!",
    minLength: {
      value: 2,
      message: "Title must have at least 2 characters!"
    }
  },
}

const positionOptions = [
  {
      color: 'rgb(184, 145, 15)',
      value: 'Frontend'
  },
  {
      color: 'rgb(27, 124, 27)',
      value: 'Backend'
  },
  {
      color: 'rgb(15, 111, 184)',
      value: 'Full-Stack'
  },
]

const levelOptions = [
  {
      color: 'rgb(54, 102, 118)',
      value: 'Junior'
  },
  {
      color: 'rgb(27, 124, 27)',
      value: 'Middle'
  },
  {
      color: 'rgb(224, 83, 70)',
      value: 'Senior'
  },
  {
      color: 'rgb(76, 19, 175)',
      value: 'Junior-Middle'
  },
  {
      color: 'rgb(175, 19, 19)',
      value: 'Middle-Senior'
  },
]

const vacancyInfo = {
  title: "React",
  skills: "aa, aa, aa af",
  position: 'Web Developer',
  level: 'Senior',
  aboutVacancy: "We are very good group who are looking for good developer!",
  requirements: "We need from you: +1 year of experience",
  contact: "test@test.ua",
  comments: [],
  user: 'id',
}


export const AddVacancy = () => {
    const currentUser = useSelector((state: RootState) => state.auth.data)

    const log = () => {

    };

    const {register, handleSubmit, formState: {errors}} = useForm<VacancyInput>({
      defaultValues: {
        title: "",
        skills: "",
        position: "",
        level: "",	
        aboutVacancy: "",
        requirements: "",
        contact: "",
        user: "",
      }
    })

    const addVacancyHandler = (data: VacancyInput) => {
      try {
        console.log(data);
        
      } catch (error) {
        
      }
    }

  return (
    <Layout>
        <div className={styles.container}>
          <form className={styles.add_vacancy} onSubmit={handleSubmit(addVacancyHandler)}>

            <div className={styles.title}> 
              <input type="text" {...register('title', vacancyOptions.title)} placeholder='Vacancy title'/>
              {errors.title?.message ?? <span className={styles.errorMessage}>{errors.title?.message}</span>}
            </div>

            <div className={styles.skills}> 
              <input type="text" {...register('skills', vacancyOptions.skills)} placeholder='Skills (Java, React, e.t.c)'/>
              {errors.skills?.message ?? <span className={styles.errorMessage}>{errors.skills?.message}</span>}
            </div>

            <div className={styles.position}> 
              <p>Position: </p>
              {
              positionOptions.map((position, index) => 
              <div key={index} {...register('position')}>
                <input defaultChecked={index === 0} type="radio" name='position' value={position.value}/>
                  <span>
                    {position.value}
                  </span>
              </div>
              
                )}
            </div>

            <div className={styles.level}> 
              <p>Level: </p>
              {
              levelOptions.map((level, index) => 
              <div key={index} {...register('level')}>
                <input defaultChecked={index === 0} type="radio" name='level' value={level.value}/> 
                <span>
                  {level.value}
                </span>
              </div>
                )}
            </div>

            <div className={styles.aboutVacancy}>
              <p>About Vacancy: </p>
                
            </div>
            <button onClick={log}>Log editor info</button>


            <div className={styles.buttons}>
              <button type='submit' className={styles.submit}>Submit</button>
              <button type='reset' className={styles.cancel}>Cancel</button>
            </div>
          </form>
        </div>
    </Layout>
  )
}
