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
import { Auth } from './auth';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddProject } from './pages/user/AddProject';
import { PostPage } from './pages/dashboard/PostPage';
import { SavePage } from './pages/dashboard/SavePage';
import { Profile } from './pages/user/Profile';
import { ErrorPage } from './pages/dashboard/ErrorPage';
import { AddVacancy } from './pages/user/AddVacancy';

// Component
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
    path: '/dashboard/register',
    element: <UserRegistration/>,
  },
  {
    path: '/dashboard/:id',
    element: <PostPage/>,
  },
  
  
  {
    path: '/dashboard/user/add-project',
    element: <AddProject/>
  },
  {
    path: '/dashboard/user/projects/:id/edit',
    element: <AddProject/>
  },

  {
    path: '/dashboard/user/add-vacancy',
    element: <AddVacancy/>
  },
  {
    path: '/dashboard/user/vacancy/:id/edit',
    element: <AddVacancy/>
  },

  {
    path: '/dashboard/saved-posts',
    element: <SavePage />
  },
  {
    path: '/dashboard/profile/:value',
    element: <Profile />
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


