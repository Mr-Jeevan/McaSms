import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// import Sidebar from './components/layout/sidebar';
import Header from './components/layout/header';
import Home from './components/Home/Home';
import McaTwo from './components/Mca_2/McaTwo';
import Edit from './components/Editpage/Edit';
import AddStudents from './components/addStudents/AddStudents';

import EditableTable from './components/utils-tries/EditableTable';
// import LongPress from './components/tries/LongPress'

function App() {
  return (
    <Router>
      <div className="App">
        <div className="d-flex" id="wrapper">
          {/* <Sidebar /> */}
          <div className=' w-100' id="page-content-wrapper" >
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/McaTwo" element={<McaTwo />} />
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

