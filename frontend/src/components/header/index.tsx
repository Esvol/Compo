import React, { useState } from 'react'
import styles from './index.module.scss'

import { AppBar, Toolbar, Typography, Box, Container, Avatar, IconButton, Badge, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import DeveloperModeRoundedIcon from '@mui/icons-material/DeveloperModeRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { LoginButton, RegistrationButton } from '../../custom-components/Buttons';
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../redux/slices/auth';

export const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const user = useSelector(selectUser)

    const logoutHandler = () => {
        dispatch(logout())
        localStorage.removeItem('token');
    }

  return (
    <AppBar position='static' sx={{backgroundColor: "#141418"}}>
        <Container maxWidth='xl'>
            <Toolbar disableGutters>
                <Link to={'/dashboard'} style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#f6f6f6'}}>
                    <DeveloperModeRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex', textDecoration: 'none', },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        COMPO
                    </Typography>
                </Link>
                <Box sx={{display: 'flex', justifyContent: 'space-around', ml: 16}} maxWidth="md">
                    <Button
                        startIcon={<DataObjectRoundedIcon />}
                        sx={{mr: 2, color:"#9F3ED5", backgroundColor: "rgb(170, 0, 255, 0.1)"}}
                        size="large"
                        variant="text"
                        >
                            Projects
                    </Button>
                    <Button
                        startIcon={<WorkOutlineRoundedIcon/>}
                        color="primary"
                        sx={{color:"rgb(41, 98, 255)", backgroundColor: 'rgb(0, 145, 234, 0.1)'}}
                        size="large"
                        variant="text"
                        >
                            Vacancy
                    </Button>
                </Box>

                <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'space-around', ml: 12}} maxWidth="md"/>
                    
                {
                    user ? 
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', ml: 12}} maxWidth="md">
                        <Button 
                            onClick={logoutHandler}
                            startIcon={<ChevronLeftRoundedIcon />}
                            sx={{mr: 2}}
                            color="error"
                            size="medium"
                            variant="outlined"
                            >
                                Log out
                        </Button>
                        <Button 
                            onClick={() => navigate('/user/create-project')}
                            endIcon={<AddIcon />}
                            sx={{mr: 2}}
                            color="info"
                            size="medium"
                            variant="outlined"
                            >
                                Create Project
                        </Button>
                        <IconButton onClick={() => {}} sx={{ p: 0, mr: 1.2}}>
                            <Avatar alt="User" src="" />
                        </IconButton> 

                        <Link to={'/user/projects/saved-posts'} className={styles.save_button}>
                            <Badge color="secondary" badgeContent={1} max={99}>
                                <FavoriteBorderRoundedIcon fontSize='large'/>
                            </Badge>
                        </Link>
                    </Box>
                    :
                    <Stack spacing={2} direction='row'>
                        <Link to={'/user/register'}>
                            <RegistrationButton size='large' variant='outlined' startIcon={<CreateIcon/>}>
                                Register
                            </RegistrationButton>
                        </Link>
                        <Link to={'/dashboard/login'}>
                            <LoginButton size='large' variant='outlined' endIcon={<KeyIcon/>}>
                                Login
                            </LoginButton>
                        </Link>
                    </Stack>
                }
            </Toolbar>
        </Container>
    </AppBar>
  )
}
