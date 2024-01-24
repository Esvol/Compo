import { Notification as NotifiactionType, UserType } from '../../redux/slices/auth'
import styles from './index.module.scss'

import React, { useState } from 'react'
import { FormatDate } from '../../helpers';
import { Link } from 'react-router-dom';

import NotificationsIcon from '@mui/icons-material/Notifications';
import CancelIcon from '@mui/icons-material/Cancel';
import { Badge } from '@mui/material';
import { useRemoveNotificationMutation, useUpdateNotificationMutation } from '../../redux/services/notification';


type Props = {
    user: UserType
}

export const Notification = ({user}: Props) => {

    const [isNotificationOpen, setIsNotificationOpen] = useState(false)

    const [updateNotification] = useUpdateNotificationMutation();
    const [removeNotification] = useRemoveNotificationMutation();

    const actionHandler = async (vacancyUserId: string, appliedUserId: string,_id: string, type: string) => {
        if(window.confirm(`You sure you want to ${type==='Accept' ? 'accept' : 'deny'} this user?`)){
            await updateNotification({vacancyUserId: vacancyUserId, appliedUserId: appliedUserId, _id: _id, text: type === 'Accept' ? 'You were accepted!' : 'You were denied sorry!'})
            .catch((err) => {
                alert('There is a problem with this notification.')
                console.log(err);
            })
        }
    }

    const removeHandler = async (notification: NotifiactionType) => {
        const removedNotification = {
            _id: notification._id, 
            appliedUserId: notification.appliedUser._id,
        }

        await removeNotification(removedNotification)
            .catch((err) => {
                alert('There is a problem with deleting this notification.')
                console.log(err);
        })
    }

    return (
        <>
            <div onClick={() => setIsNotificationOpen(prev => !prev)}>
                <Badge className={styles.notification_button} color="secondary" badgeContent={user.notifications.length} max={99}>
                    <NotificationsIcon fontSize='large'/>
                </Badge>
            </div>

            <div className={`${styles.notification_list} ${isNotificationOpen ? '' : `${styles.notification_list_hidden}`}`} >
                {
                    user.notifications.map((notification, index) => 
                    notification.text && notification.appliedUser._id === user._id 
                    ? (
                        <div key={index} className={`${styles.notification_item} ${ notification.text === 'You were accepted!' ? styles.accept_answer : styles.deny_answer}`}>
                            <div className={styles.notification_top}>
                                <div className={styles.notification_avatar}>
                                    <img alt="Notification" src={notification.vacancyUser.avatarURL ? `http://localhost:5000${notification.vacancyUser.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} />
                                    <div>
                                        <Link className={styles.notification_nickname} to={`/user/profile/${notification.vacancyUser.nickname}`}>
                                            <p>{notification.vacancyUser.nickname}</p>
                                        </Link>
                                        <p>{FormatDate(notification.updatedAt)}</p>
                                    </div>
                                </div>
                                <div className={styles.notification_answer}>
                                    {notification.text}
                                </div>
                            </div>
                            
                            <div className={styles.notification_bottom}>
                                <Link className={styles.notification_bottom_p} to={`/dashboard/${notification.vacancy._id}`}>
                                    <p>{notification.vacancy.title}</p>
                                </Link>
                            </div>

                            <div onClick={() => removeHandler(notification)} className={styles.remove_notification}>
                                <CancelIcon/>
                            </div>
                        </div>
                    )
        
                    : !notification.text && notification.appliedUser._id !== user._id && (
                        <div key={index} className={styles.notification_item}>
                            <div className={styles.notification_top}>
                                <div className={styles.notification_avatar}>
                                    <img alt="Notification" src={notification.appliedUser.avatarURL ? `http://localhost:5000${notification.appliedUser.avatarURL}` : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/1000_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg'} />
                                    <div>
                                        <Link className={styles.notification_nickname} to={`/user/profile/${notification.appliedUser.nickname}`}>
                                            <p>{notification.appliedUser.nickname}</p>
                                        </Link>
                                        <p>{FormatDate(notification.createdAt)}</p>
                                    </div>
                                </div>
                                <div className={styles.notification_buttons}>
                                    <div className={styles.agree_button} onClick={() => actionHandler(notification.vacancyUser._id, notification.appliedUser._id, notification._id, 'Accept')}>Accept</div>
                                    <div className={styles.deny_button} onClick={() => actionHandler(notification.vacancyUser._id, notification.appliedUser._id, notification._id, 'Deny')}>Deny</div>
                                </div>
                            </div>
                            
                            <div className={styles.notification_bottom}>
                                <div className={styles.notification_bottom_p}>
                                    <p>{notification.vacancy.title}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }

                    {
                        user.notifications.length === 0 && <p>No notifications</p>
                    }
            </div>
        </>
    )
}
