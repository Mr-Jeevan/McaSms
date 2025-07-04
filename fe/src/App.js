import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login'
// import Sidebar from './components/layout/sidebar';
import Header from '../src/layout/header';
import Home from '../src/pages/Home/Home';
import McaTwo from '../src/pages/Mca_2/McaTwo';
import Edit from '../src/pages/Editpage/Edit';
import AddStudents from '../src/pages/addStudents/AddStudents';

import ParticlePage from './components/tries/ParticlePage';

import EditableTable from './components/utils-tries/EditableTable';
// import LongPress from './components/tries/LongPress'

function App() {

  const location = useLocation();
  //save login state after login
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const isAuthPage = ['/', '/login'].includes(location.pathname.toLowerCase());
  return (

    <div className="App">
      <div className="d-flex" id="wrapper">
        <div className=' w-100' id="page-content-wrapper" >
          {isLoggedIn && !isAuthPage && <Header setIsLoggedIn={setIsLoggedIn} />}
          {/* <Header setIsLoggedIn={setIsLoggedIn} /> */}
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <LandingPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
            <Route path="/McaTwo" element={isLoggedIn ? <McaTwo /> : <Navigate to="/" />} />
            <Route path='/EditableTable' element={<EditableTable />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/AddStudents" element={<AddStudents />} />
            <Route path="/ParticlePage" element={<ParticlePage />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>

  );
}

export default App;

