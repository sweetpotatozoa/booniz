import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Main from './pages/Main/Main'
import Write from './pages/Write/Write'
import Register from './pages/Register/Register'
import MyProfile from './pages/MyProfile/MyProfile'
import Community from './pages/Community/Community'
import MyLikes from './pages/MyLikes/MyLikes'
import UserProfile from './pages/UserProfile/UserProfile'
import Edit from './pages/Edit/Edit'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/write' element={<Write />} />
        <Route path='/register' element={<Register />} />
        <Route path='/myProfile' element={<MyProfile />} />
        <Route path='/community' element={<Community />} />
        <Route path='/myLikes' element={<MyLikes />} />
        <Route path='/UserProfile/:userId' element={<UserProfile />} />
        <Route path='/edit/:userId/:reviewId' element={<Edit />} />
      </Routes>
    </>
  )
}

export default App
