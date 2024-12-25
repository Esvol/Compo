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
import EmailIcon from '@mui/icons-material/Email';

import { Project as ProjectType } from '../../redux/slices/project';
import { Link, useNavigate } from 'react-router-dom';
import { FormatDate } from '../../helpers';
import clsx from 'clsx';

import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { useDeleteProjectMutation } from '../../redux/services/project';
import { useSavePostMutation, useUnsavePostMutation } from '../../redux/services/save';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/auth';
import { setCurrentTag } from '../../redux/slices/filter';

import axios, { AxiosResponse } from 'axios';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import toast, { Toaster } from 'react-hot-toast';


type Props = {
    project: ProjectType,
    isFullProject?: boolean,
    isEditable?: boolean,
    isSavePage?: boolean,
    isProfile?: boolean,
}

export const Project = ({project, isFullProject = false, isEditable = false, isSavePage = false, isProfile = false,} : Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    
    const {_id, title, idea, text, projectTeam, user, stage, tags, price, comments, contact, createdAt, viewCount, sold} = project;    
    const currentUser = useSelector(selectUser);
    
    const [deleteProject] = useDeleteProjectMutation();
    const [savePost] = useSavePostMutation();
    const [unsavePost] = useUnsavePostMutation();

    const [error, setError] = useState<string>('')
    const [saveClass, setSaveClass] = useState<string>(currentUser?.savedPosts.includes(project._id) ? styles.saved : styles.save);
    
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
                console.log(1);
                
                await savePost({postId: _id})
                .unwrap()
                .then(() => {
                    setSaveClass(styles.saved)
                })
                .catch(error => {
                    setError(error.data.message || error.data.errors[0].msg);
                })
            }
            else if(saveClass === styles.saved){
                console.log(2);

                await unsavePost({postId: _id})
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

    const checkoutPaymentHandler = (price: number) => {
        if(currentUser){
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
        else{
            alert('You need to register your account for this action!')
        }
    }

  return (
    <div className={clsx(styles.project, {[styles.projectFull]: isFullProject}, {[styles.projectSmall]: isSavePage})}>
        <div className={styles.avatar}>
            <img src={user.avatarURL ? `http://localhost:5000${user.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Avatar" />   
        </div>

        <div className={clsx(styles.content, {[styles.contentFull]: isFullProject}, {[styles.contentSmall]: isSavePage})}>

            <div className={clsx(styles.user_title, {[styles.user_titleSmall]: isSavePage})}>
                <Link to={`/dashboard/profile/${user.nickname}`} className={clsx(styles.name, {[styles.nameFull]: isFullProject}, {[styles.nameSmall]: isSavePage})}>
                    {user.nickname}
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

                            <div className={styles.projectTeam}>
                                <p>Project team:</p>
                                {
                                    projectTeam.map(member => (
                                        <Link to={`http://localhost:3000/dashboard/profile/${member.nickname}`} key={member._id} className={styles.member}>
                                            <img src={member.avatarURL ? `http://localhost:5000${member.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} alt="Pic" />
                                            <span>{member.nickname}</span>
                                        </Link>
                                    ))
                                }
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
                    <>
                        <div className={styles.tags}>
                            {
                                tags.map(tag => <p onClick={() => !isFullProject && !isSavePage && !isProfile && filterByTagHandler(tag)} key={tag} className={styles.tag}>#{tag}</p>)
                            }
                        </div>
                    </>
                )
            }

            {
                isFullProject && !isEditable && !sold?._id && currentUser?.role !== 'user' && (
                    <div className={styles.price}>
                        <div className={styles.price_buy}>
                            <p className={styles.price_buy_text}>Buy: {price}$</p>
                            <div onClick={() => checkoutPaymentHandler(price)}>
                                <ShoppingCartIcon className={styles.purchase_button} fontSize='large'/>
                            </div>
                        </div>
                        {
                            project.preorder && (
                                <div className={styles.price_preorder}>
                                    <p className={styles.price_preorder_text}>Preorder: {(price*0.05).toFixed(0)}$</p>
                                    <div onClick={() => checkoutPaymentHandler(price*0.05)}>
                                        <ShoppingCartIcon className={styles.purchase_button} fontSize='large'/>
                                    </div>
                                </div>
                            )
                        }
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
                isEditable && !sold?._id && (
                    <div className={styles.active_buttons}>
                        <Link className={styles.edit} to={`/dashboard/user/projects/${project._id}/edit`}>
                            <EditIcon fontSize='large' />
                        </Link>
                        <div className={styles.delete} onClick={deleteProjectHandler}>
                            <DeleteOutlineIcon fontSize='large' />
                        </div>
                    </div>
                )
            }
        </div>

        {
            isFullProject && 
            <div className={styles.contact} onClick={() => {navigator.clipboard.writeText(contact); toast.success("Email was copied!")}}>
                <EmailIcon fontSize='large' sx={{cursor: 'pointer'}}/>
                <Toaster />
            </div>
        } 
        
    </div>
  )
}
