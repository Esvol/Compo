import React from 'react'
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
      color: 'rgb(54, 102, 118)',
      value: 'Frontend'
  },
  {
      color: 'rgb(27, 124, 27)',
      value: 'Backend'
  },
  {
      color: 'rgb(224, 83, 70)',
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


  return (
    <Layout>
        <div className={styles.container}>
          <form className={styles.add_vacancy}>

            <div className={styles.title}> 
              <input type="text" {...register('title', vacancyOptions.title)}/>
              {errors.title?.message ?? <span className={styles.errorMessage}>{errors.title?.message}</span>}
            </div>

            <div className={styles.skills}> 
              <input type="text" {...register('skills', vacancyOptions.skills)}/>
              {errors.skills?.message ?? <span className={styles.errorMessage}>{errors.skills?.message}</span>}
            </div>

            <div className={styles.position}> 
              <span>Position: </span>
              {positionOptions.map((position, index) => <span><input type="radio" name='position'/></span>)}
            </div>

            <div className={styles.skills}> 
              <span>Skills: </span>
            </div>

          </form>
        </div>
    </Layout>
  )
}
