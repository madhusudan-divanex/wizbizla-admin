import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './route/router'
import "react-perfect-scrollbar/dist/css/styles.css";
import NavigationProvider from './contentApi/navigationProvider';
import SideBarToggleProvider from './contentApi/sideBarToggleProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <NavigationProvider>
        <SideBarToggleProvider>
          <RouterProvider router={router} />
        </SideBarToggleProvider>
      </NavigationProvider>
      <ToastContainer autoClose={2000} />
    </>
  )
}

export default App