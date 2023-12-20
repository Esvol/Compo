import React, { useState } from 'react'
import styles from './index.module.scss'
import './index.module.scss'

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { Project as ProjectType, User } from '../../redux/slices/project';
import { Link, useNavigate } from 'react-router-dom';
import { FormatDate } from '../../helpers';
import clsx from 'clsx';

import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { useDeleteProjectMutation } from '../../redux/services/project';
import { useSaveProjectMutation, useUnsaveProjectMutation } from '../../redux/services/save';
import { useDispatch } from 'react-redux';
import { setCurrentTag } from '../../redux/slices/filter';

import axios, { AxiosResponse } from 'axios';
import { Stripe, loadStripe } from '@stripe/stripe-js';

type Props = {
    currentUser?: User | null,
    project: ProjectType,
    isFullProject?: boolean,
    isEditable?: boolean,
    isSavePage?: boolean,
}

export const Project = ({currentUser, project, isFullProject = false, isEditable = false, isSavePage = false} : Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {_id, title, idea, text, user, stage, tags, price, comments, createdAt, viewCount} = project;
    
    const [deleteProject] = useDeleteProjectMutation();
    const [saveProject] = useSaveProjectMutation();
    const [unsaveProject] = useUnsaveProjectMutation();

    const [error, setError] = useState<string>('')
    const [saveClass, setSaveClass] = useState(currentUser?.savedPosts.includes(project._id) ? styles.saved : styles.save);

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

    const deleteProjectHandler = async () => {
        if (window.confirm('Are you sure you want to delete this project?')){
            await deleteProject(_id).unwrap()
            .then(() => {
                if(isFullProject){
                    navigate('/dashboard');
                }
            })
            .catch(err => {
                console.log(err);
                throw new Error('Error: ' + err)
            })
        }
    }

    const filterByTagHandler = (tag: string) => {
        console.log(tag);
        
        dispatch(setCurrentTag(tag))
    }

    const saveProjectHandler = async () => {
        try {
            if(!currentUser){
                alert('You need to register to save any of these projects!')
                return null;
            }

            if(saveClass === styles.save){
                await saveProject({projectId: _id})
                .unwrap()
                .then(() => {
                    setSaveClass(styles.saved)
                })
                .catch(error => {
                    setError(error.data.message || error.data.errors[0].msg);
                })
            }
            else if(saveClass === styles.saved){
                await unsaveProject({projectId: _id})
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

    const checkoutPaymentHandler = () => {
        let stripePromise: Stripe | null;

        axios.get('http://localhost:5000/config-payment')
            .then(async({data}: AxiosResponse<{publishableKey: string}>) => {
                console.log(data.publishableKey);
                await loadStripe(data.publishableKey).then(stripe => {
                    stripePromise = stripe;
                })
            })
            .catch(error => {
                console.error(error);
                alert('There is a problem with payment!');
            })

            axios.post('http://localhost:5000/create-checkout-session', {title: title, price: price})
            .then(async ({data}: AxiosResponse<{id: string}>) => {
                if(stripePromise){
                    await stripePromise?.redirectToCheckout({
                        sessionId: data.id,
                    })
                    .catch(error => console.error(error))
                }
            })
            .catch(error => {
                console.error(error);
                alert('There is a problem with payment!');
            })
    }

  return (
    <div className={clsx(styles.project, {[styles.projectFull]: isFullProject}, {[styles.projectSmall]: isSavePage})}>
        <div className={styles.avatar}>
            <img src={user.avatarURL ? `http://localhost:5000${user.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Avatar" /> 
        </div>

        <div className={clsx(styles.content, {[styles.contentFull]: isFullProject}, {[styles.contentSmall]: isSavePage})}>

            <div className={clsx(styles.user_title, {[styles.user_titleSmall]: isSavePage})}>
                <Link to={`/user/profile/${user.firstName}_${user.lastName}`} className={clsx(styles.name, {[styles.nameFull]: isFullProject}, {[styles.nameSmall]: isSavePage})}>
                    {user.firstName} {user.lastName}
                </Link>

                <div className={clsx(styles.time, {[styles.timeFull]: isFullProject}, {[styles.timeSmall]: isSavePage})}>
                    {FormatDate(createdAt)}
                </div>
            </div>

            {
                isFullProject ? (
                         <>
                            <div className={styles.titleFull}> 
                                {title} 
                            </div> 

                            <div className={styles.idea}> 
                                {idea} 
                            </div> 

                            <div className={styles.textFull}> 
                                <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(text)))} readOnly={true} onChange={() => {}}/> 
                            </div>                  
                         </>
                ) : (
                    <Link to={`/dashboard/${_id}`} style={{textDecoration: 'none'}}>
                        <div className={clsx(styles.title, {[styles.titleSmall]: isSavePage})}>
                            {title}
                        </div>
                    </Link>
                )
            }

            {
                !isSavePage && (
                    <div className={styles.tags}>
                        {
                            tags.map(tag => <p onClick={() => filterByTagHandler(tag)} key={tag} className={styles.tag}>#{tag}</p>)
                        }
                    </div>
                )
            }

            {
                isFullProject && !isEditable && (
                    <div className={styles.price}>
                        <p className={styles.price_text}>{price}$</p>
                        <div onClick={checkoutPaymentHandler}>
                            <ShoppingCartIcon className={styles.purchase_button} fontSize='large'/>
                        </div>
                    </div>
                )
            }

            <div className={clsx(styles.info, {[styles.infoSmall]: isSavePage})}>
                <div className={stageClass(stage)}>
                    <p>{stage}</p>
                </div>
                <div className={styles.viewCount}>
                    <VisibilityIcon/>
                    <p>{viewCount}</p>
                </div>
                <div className={styles.commentsLength}>
                    <CommentIcon/>
                    <p>{comments.length}</p>
                </div>
                <div onClick={saveProjectHandler}>
                    {
                        saveClass === styles.save 
                        ?
                        <FavoriteBorderIcon className={saveClass}/>
                        :
                        <FavoriteIcon className={saveClass} />
                    }
                </div>
            </div>

            {
                isEditable && (
                    <div className={styles.active_buttons}>
                        <Link className={styles.edit} to={`/user/projects/${project._id}/edit`}>
                            <EditIcon fontSize='large' />
                        </Link>
                        <div className={styles.delete} onClick={deleteProjectHandler}>
                            <DeleteOutlineIcon fontSize='large' />
                        </div>
                    </div>
                )
            }

        </div>
    </div>
  )
}
