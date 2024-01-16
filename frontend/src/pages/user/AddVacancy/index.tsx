import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { Layout } from '../../../components/layout'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'

import { Editor } from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAddVacancyMutation, useUpdateVacancyMutation } from '../../../redux/services/vacancy'
import axios from 'axios'
import { Vacancy } from '../../../redux/slices/vacancy'

export type VacancyInput = {
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
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditable = false;
    const user = useSelector((state: RootState) => state.auth.data)

    const [addVacancy] = useAddVacancyMutation();
    const [updateVacancy] = useUpdateVacancyMutation();

    const [editorVacancyState, setEditorVacancyState] = useState(
      () => EditorState.createEmpty(),
    );
    const [convertedVacancyContent, setConvertedVacancyContent] = useState('');
    const [aboutVacancyError, setAboutVacancyError] = useState(false)
      
    const [editorRequirementsState, setEditorRequirementsState] = useState(
      () => EditorState.createEmpty(),
    );
    const [convertedRequirementsContent, setConvertedRequirementsContent] = useState('');
    const [requirementsError, setRequirementsError] = useState(false)
    
    const [error, setError] = useState('')
    console.log(error);
    

    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm<VacancyInput>({
      defaultValues: {
        title: "",
        skills: "",
        position: "",
        level: "",	
        aboutVacancy: "",
        requirements: "",
        contact: user?.email,
      }
    })

    const editorVacancyStateHandler = () => {
      if(editorVacancyState.getCurrentContent().hasText()){
        setAboutVacancyError(false)
      }
      const rawContentState = convertToRaw(editorVacancyState.getCurrentContent());
      setConvertedVacancyContent(JSON.stringify(rawContentState));
    }

    const editorRequirementsStateHandler = () => {
      if(editorRequirementsState.getCurrentContent().hasText()){
        setRequirementsError(false)
      }
      const rawContentState = convertToRaw(editorRequirementsState.getCurrentContent());
      setConvertedRequirementsContent(JSON.stringify(rawContentState));
    } 

    const addVacancyHandler = async (data: VacancyInput) => {
      try {        
        if(!editorVacancyState.getCurrentContent().hasText()){
          setAboutVacancyError(true)
          return null
        }

        if(!editorRequirementsState.getCurrentContent().hasText()){
          setRequirementsError(true)          
          return null
        }

        const vacancy: VacancyInput = Object.assign(data, {aboutVacancy: convertedVacancyContent, requirements: convertedRequirementsContent})

        if(isEditable && id){
          await updateVacancy({...vacancy, id})
          .unwrap()
          .then(() => {
            navigate('/dashboard')
          })
          .catch(error => {
              reset();
              setError(error.data.message || error.data.errors[0].msg);
          })
        }
        else{
          await addVacancy(vacancy)
          .unwrap()
          .then(() => {
            navigate('/dashboard')
          })
          .catch(error => {
              reset();
              setError(error.data.message || error.data.errors[0].msg);
          })
        }

      } catch (error) {
        console.log('Error' + error);
        return error;
      }
    }

    useEffect(() => {
      if(!user){
        navigate('/dashboard')
      }
      if(id){
        axios.get(`http://localhost:5000/dashboard/vacancies/${id}`)
          .then((response) => {
              const data : Vacancy = response.data;
              console.log(data);
              setValue('title', data.title);
              setValue('skills', data.skills.join(' '));
              setValue('position', data.position);
              setValue('level', data.level);
              setEditorVacancyState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.aboutVacancy))));
              setConvertedVacancyContent(data.aboutVacancy);
              setEditorRequirementsState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.requirements))));
              setConvertedRequirementsContent(data.requirements);
              setValue('contact', data.contact);
          })
          .catch((error) => {
              console.log(error);
              navigate('/dashboard')
              throw new Error ('Error: ' + error)
          })
      }
    }, [])


  return (
    <Layout>
        <div className={styles.container}>
          <form className={styles.add_vacancy} onSubmit={handleSubmit(addVacancyHandler)}>

            <div className={styles.title}> 
              <input type="text" {...register('title', vacancyOptions.title)} placeholder='Vacancy title' autoComplete='off'/>
              {<span className={styles.errorMessage}>{errors.title?.message ?? errors.title?.message}</span>}
            </div>

            <div className={styles.skills}> 
              <input type="text" {...register('skills', vacancyOptions.skills)} placeholder='Skills (Java, React, e.t.c)' autoComplete='off'/>
              {<span className={styles.errorMessage}>{errors.skills?.message ?? errors.skills?.message}</span>}
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
              <div className={styles.aboutVacancy_editor}>
                <Editor
                    
                    editorState={editorVacancyState}
                    toolbarClassName={styles.toolbar_class}
                    wrapperClassName={styles.wrapper_class}
                    editorClassName={styles.editor_class}
                    editorStyle={{paddingLeft: '10px', color: 'white', height: '8rem'}}
                    onEditorStateChange={setEditorVacancyState}
                    onChange={editorVacancyStateHandler}
                    placeholder='Write about your vacancy here...'
                    />
                </div>
              <span className={styles.errorMessage}>{aboutVacancyError && "Text should be at least 1 symbol!"}</span> 
            </div>

            <div className={styles.requirements}>
              <p>Requirements: </p>
              <div className={styles.requirements_editor}>
                <Editor
                    editorState={editorRequirementsState}
                    toolbarClassName={styles.toolbar_class}
                    wrapperClassName={styles.wrapper_class}
                    editorClassName={styles.editor_class}
                    editorStyle={{paddingLeft: '10px', color: 'white', height: '8rem'}}
                    onEditorStateChange={setEditorRequirementsState}
                    onChange={editorRequirementsStateHandler}
                    placeholder='Write a requirements here...'
                    />
              </div>
              <span className={styles.errorMessage}>{requirementsError && "Text should be at least 1 symbol!"}</span> 
            </div>
            
            <div className={styles.contact}>
              <p>Contact: </p>
              <input type="text" placeholder='test@test.ua' {...register('contact', vacancyOptions.contact)} autoComplete='off'/>
              {<span className={styles.errorMessage}>{errors.contact?.message ?? errors.contact?.message}</span>}
            </div>
            

            <div className={styles.action_buttons}>
                <button type='submit' className={styles.submit_button}>{isEditable ? 'Edit' : 'Submit' }</button>
                <Link to={'/dashboard'}>
                    <button className={styles.cancel_button}>Cancel</button>
                </Link>
            </div>
          </form>
        </div>
    </Layout>
  )
}
