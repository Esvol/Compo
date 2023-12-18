import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { store } from './redux/store';
import { Provider } from 'react-redux'

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { UserRegistration } from './pages/user/registration';
import { Login } from './pages/dashboard/login';
import { CompanyRegistration } from './pages/company/registration';
import { Auth } from './auth';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddProject } from './pages/user/AddProject';
import { ProjectPage } from './pages/dashboard/ProjectPage';
import { SavePage } from './pages/dashboard/SavePage';
import { Profile } from './pages/user/Profile';
import { ErrorPage } from './pages/dashboard/ErrorPage';


const router = createBrowserRouter([
  {
    path: '*',
    element: <Navigate to='/dashboard'/>
  },
  {
    path: '/error',
    element: <ErrorPage />
  },
  {
    path: '/',
    element: <Navigate to='/dashboard'/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
  },
  {
    path: '/dashboard/login',
    element: <Login/>,
  },
  {
    path: '/dashboard/:id',
    element: <ProjectPage/>,
  },
  

  {
    path: '/user/register',
    element: <UserRegistration/>,
  },
  {
    path: '/user/add-project',
    element: <AddProject/>
  },
  {
    path: '/user/projects/:id/edit',
    element: <AddProject/>
  },
  {
    path: '/user/projects/saved-posts',
    element: <SavePage />
  },
  {
    path: '/user/profile/:value',
    element: <Profile />
  },


  {
    path: '/company/register',
    element: <CompanyRegistration/>,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement || null);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Auth>
        <RouterProvider router={router}/>
      </Auth>
    </ThemeProvider>
  </Provider>
);


