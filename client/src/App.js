import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './pages/NavBar/NavBar'
import Login from './pages/Login/Login'
import Main from './pages/Main/Main'
import Write from './pages/Write/Write'
import Register from './pages/Register/Register'
import MyProfile from './pages/MyProfile/MyProfile'
import Community from './pages/Community/Community'
import MyLikes from './pages/MyLikes/MyLikes'
import UserProfile from './pages/UserProfile/UserProfile'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/write' element={<Write />} />
        <Route path='/register' element={<Register />} />
        <Route path='/myProfile' element={<MyProfile />} />
        <Route path='/community' element={<Community />} />
        <Route path='/myLikes' element={<MyLikes />} />
        <Route path='/userProfile/:nickname' element={<UserProfile />} />
      </Routes>
    </>
  )
}

export default App
