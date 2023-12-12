import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { selectUser } from '../../../redux/slices/auth'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.scss'
import { Layout } from '../../../components/layout'

import { Button, FormControlLabel} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import axios from 'axios'

import { Editor } from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { useForm } from 'react-hook-form'
import { PinkSwitch } from '../../../custom-components/Forms'
import { useAddProjectMutation, useUpdateProjectMutation } from '../../../redux/services/project'
import { Project } from '../../../redux/slices/project'

const projectOptions = {
    title: {
        required: "Title is required!",
        minLength: {
          value: 2,
          message: "Title must have at least 2 characters!"
        }
    },
    idea: {
        required: "Idea is required!",
        minLength: {
          value: 2,
          message: "Idea must have at least 2 characters!"
        }
    },
    // text: {
    //     required: "Text is required!",
    //     minLength: {
    //       value: 12,
    //       message: "Text must have at least 12 characters"
    //     }
    // },
    contact: {
        required: "Contact is required!",
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "Invalid email!",
        },
    },
    price: {
        required: "Price is required!",
        valueAsNumber: true,
        validate: (value: number) => {
            if(value === 0){
                return "More than 0$!"
            }
        },
    },
}

const stageOptions = [
    {
        color: 'rgb(54, 102, 118)',
        value: 'Beginner'
    },
    {
        color: 'rgb(27, 124, 27)',
        value: 'Mid-development'
    },
    {
        color: 'rgb(224, 83, 70)',
        value: 'Almost finished'
    },
    {
        color: 'rgb(76, 19, 175)',
        value: 'Testing'
    },
    {
        color: 'rgb(175, 19, 19)',
        value: 'Maintenance'
    },
]

export type ProjectInput = {
    title: string,
    idea: string,
    tags: string,
    text: string,
    projectTeam: {
        name: string,
        link: string,
    }[],
    stage: "Beginner" | "Mid-development" | "Almost finished" | "Testing" | "Maintenance",
    preorder: boolean,
    price: number,
    contact: string,
    imageURL: string,
}

export const AddProject = () => {
    const navigate = useNavigate();

    const {id} = useParams();
    const isEditable = Boolean(id);

    const user = useSelector((state: RootState) => selectUser(state))
    const [addProject] = useAddProjectMutation();
    const [updateProject] = useUpdateProjectMutation();

    const {register, reset, setValue, handleSubmit, formState: {errors}} = useForm<ProjectInput>({
        defaultValues:{
            title: '',
            idea: '',
            tags: '',
            text: '',
            projectTeam: [{
                name: '',
                link: ''
            }],
            stage: 'Beginner',
            price: 0,
            preorder: false,
            contact: ``,
            imageURL: '',
        }
    })

    const inputFileRef = useRef<HTMLInputElement | null>(null)
    const [error, setError] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>('') 
    const [selectStage, setSelectStage] = useState<string>('')
    const [isPreorder, setIsPreorder] = useState(false)
    const [projectTeam, setProjectTeam] = useState([{
        name: '',
        link: ''
    }])    

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [convertedContent, setConvertedContent] = useState('');


    const addProjectTeam = () => {
        setProjectTeam(prev => [...prev, {name: '', link: ''}])
    }

    const onChangeNameHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        setProjectTeam(prev => prev.filter((member, ind) => {
            if (ind === index){
                member.name = e.target.value
            }
            return member;
        }))
    }

    const onChangeLinkHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        setProjectTeam(prev => prev.filter((member, ind) => {
            if (ind === index){
                member.link = e.target.value
            }
            return member;
        }))
    }

    const deleteProjectMemberHandler = (index: number) => {
        setProjectTeam(prev => prev.filter((member, ind) => {
            if (ind !== index || projectTeam.length === 1){
                return member;
            }

            return null;
        }))
    }

    const onChangeStageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectStage(e.target.value);        
    }

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const formData = new FormData()
            if (e.target.files){
                const file = e.target.files[0];                
                formData.append('image', file);
                const { data } = await axios.post('http://localhost:5000/uploads', formData);
                setImageUrl(data.url);
            }
        } catch (error) {
            console.log(error);
            alert('Error, upload file')
        }
    }

    const onClickRemoveImage = () => {
        setImageUrl('')
    }

    const editorStateHandler = () => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        setConvertedContent(JSON.stringify(rawContentState));
    }

    const onSubmitFormHandler = async (data: ProjectInput) => {
        try {
            const project: ProjectInput = {
                title: data.title,
                idea: data.idea,
                text: convertedContent,
                projectTeam: projectTeam,
                tags: data.tags,
                stage: data.stage,
                preorder: data.preorder,
                price: data.price,
                contact: data.contact,
                imageURL: imageUrl ?? '',
            }
            
            if(isEditable && id){
                await updateProject({...project, id}).unwrap()
                    .then(() => {
                        navigate('/dashboard')
                    })
                    .catch(error => {
                        reset();
                        setError(error.data.message || error.data.errors[0].msg);
                    })
            }
            else{
                await addProject(project).unwrap()
                    .then(() => {
                        navigate('/dashboard');
                    })
                    .catch(error => {
                        reset();
                        setError(error.data.message || error.data.errors[0].msg);
                    })
            }
            
        } catch (error) {
            throw new Error(`` + error);
        }
    }

    useEffect(() => {
        if(!user){
            navigate('/dashboard');
        }

        if(id){
            axios.get(`http://localhost:5000/dashboard/projects/${id}`)
                .then((response) => {
                    const data : Project = response.data;
                    console.log(data);
                    setImageUrl(data.imageURL);
                    setValue('title', data.title);
                    setValue('idea', data.idea);
                    setValue('tags', data.tags.join(' '))
                    setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.text))));
                    setProjectTeam(data.projectTeam);
                    setValue('stage', data.stage);
                    setValue('preorder', data.preorder);
                    setValue('contact', data.contact);
                    setValue('price', data.price)
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
            <div className={styles.add_project}>
                <form method='post' onSubmit={handleSubmit(onSubmitFormHandler)}>
                    <div className={styles.add_picture}>
                        
                        {imageUrl && 
                            <img className={styles.image} src={`http://localhost:5000${imageUrl}`} alt="Image" />
                        }
                        <Button onClick={() => inputFileRef.current?.click()} variant="outlined">
                            Download preview
                        </Button>

                        {
                        imageUrl && (
                        <Button sx={{ml: 1}} variant="contained" color="error" onClick={onClickRemoveImage}>
                                Delete
                            </Button>
                        )}
                        <input type="file" ref={inputFileRef} onChange={handleChangeFile} hidden />
                    </div>

                    <div className={styles.title}>
                        <input {...register('title', projectOptions.title)} type='text' placeholder='Project title'/>
                        {
                            <span className={styles.errorMessage}>{errors.title && errors.title.message}</span>
                        }
                    </div>

                    <div className={styles.idea}>
                        <input {...register('idea', projectOptions.idea)} type='text' placeholder='Idea'/>
                        {
                            <span className={styles.errorMessage}>{errors.idea && errors.idea.message}</span>
                        }
                    </div>

                    <input {...register('tags')} type="text" className={styles.tags} placeholder='#tag'/>

                    <div className={styles.text_editor}>
                        <Editor
                            editorState={editorState}
                            toolbarClassName={styles.toolbar_class}
                            wrapperClassName={styles.wrapper_class}
                            editorClassName={styles.editor_class}
                            editorStyle={{paddingLeft: '10px'}}
                            onEditorStateChange={setEditorState}
                            onChange={editorStateHandler}
                            placeholder='Write a project text here...'
                            />
                            {/* {
                                <span>{convertedContent.length < 20 && "Text should be at least 10 symbols!"}</span>
                            } */}
                    </div>

                    <div className={styles.projectTeam}>
                        <div>
                            <p className={styles.projectTeam_title}>Project Team</p>
                            <span onClick={addProjectTeam}><AddBoxIcon fontSize='large' style={{cursor: 'pointer'}}/></span>
                        </div>
                        {
                            projectTeam.map((member, index) => (
                                <div key={index} className={styles.projectTeam_member}>
                                    <p>Name:</p>
                                    <input type="text" value={member.name} className={styles.projectTeam_member_name} onChange={e => onChangeNameHandler(e, index)}/>
                                    <p>Link:</p>
                                    <input type="text" value={member.link} className={styles.projectTeam_member_link} onChange={e => onChangeLinkHandler(e, index)}/>
                                    <span onClick={() => deleteProjectMemberHandler(index)}><DeleteOutlineIcon fontSize='large' style={{cursor: 'pointer', color: 'rgb(179, 50, 50)'}}/></span>
                                </div>
                            ))
                        }    
                    </div>

                    <div className={styles.stage}>
                        <p>Stage: </p>
                        {
                            stageOptions.map((stage, index) =>
                            <span key={index} defaultChecked={index === 0} {...register('stage')} onChange={onChangeStageHandler} style={{backgroundColor: `${stage.color}`}}><input type="radio" value={`${stage.value}`} name='stage'/> {stage.value} </span>
                            )
                        }
                    </div>

                    <div className={styles.preorder}>
                        <p>Do you want to have a preorder possibility for your project?</p>
                        <FormControlLabel control={<PinkSwitch {...register('preorder')} checked={isPreorder} onChange={() => setIsPreorder(prev => !prev)} />} label={isPreorder ? "Yes" : "No"} />
                    </div>

                    <div className={styles.priceAndContact}>
                        <div className={styles.price}>
                            <p>Price: </p>
                            <input type="number" placeholder='0$' {...register('price', projectOptions.price)}/>
                            {
                                <span className={styles.errorMessage}>{errors.price && errors.price.message}</span>
                            }
                        </div>

                        <div className={styles.contact}>
                            <p>Contact: </p>
                            <input type="text" {...register('contact', projectOptions.contact)}/>
                            {
                                <span className={styles.errorMessage}>{errors.contact && errors.contact.message}</span>
                            }
                        </div>             
                    </div>

                    <div className={styles.action_buttons}>
                        <button type='submit' className={styles.submit_button}>{isEditable ? 'Edit' : 'Submit' }</button>
                        <Link to={'/dashboard'}>
                            <button className={styles.cancel_button}>Cancel</button>
                        </Link>
                    </div>

                </form>
                <p>{error && `${error} + !`}</p>
            </div>
        </div>
    </Layout>
  )
}
