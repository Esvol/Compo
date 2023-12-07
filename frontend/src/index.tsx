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


const router = createBrowserRouter([
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
    path: '/company/register',
    element: <CompanyRegistration/>,
  },

  {
    path: '/user/create-project',
    element: <AddProject/>
  },

  {
    path: '/user/projects/:id/edit',
    element: <AddProject/>
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


