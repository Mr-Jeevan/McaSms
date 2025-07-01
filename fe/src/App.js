import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Login from './pages/Login/Login'
// import Sidebar from './components/layout/sidebar';
import Header from '../src/layout/header';
import Home from '../src/pages/Home/Home';
import McaTwo from '../src/pages/Mca_2/McaTwo';
import Edit from '../src/pages/Editpage/Edit';
import AddStudents from '../src/pages/addStudents/AddStudents';

import EditableTable from './components/utils-tries/EditableTable';
// import LongPress from './components/tries/LongPress'

function App() {

  //save login state after login
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <Router>
      <div className="App">
        <div className="d-flex" id="wrapper">
          {/* <Sidebar /> */}
          <div className=' w-100' id="page-content-wrapper" >
            <Header setIsLoggedIn={setIsLoggedIn} />
            <Routes>
              <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

              <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
              <Route path="/McaTwo" element={isLoggedIn ? <McaTwo /> : <Navigate to="/" />} />
              <Route path='/EditableTable' element={<EditableTable />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/AddStudents" element={<AddStudents />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

