import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login'
import Header from '../src/layout/header';
import Footer from './layout/footer';
import Home from './pages/Home';
import McaTwo from '../src/pages/Mca_2/McaTwo';
import McaOne from './pages/Mca_1/McaOne';
// import Edit from '../src/pages/Editpage/Edit';
// import AddStudents from '../src/pages/addStudents/AddStudents';

import ParticlePage from './components/ParticlesBackground/ParticlePage';

import EditableTable from './components/utils-tries/EditableTable';
// import LongPress from './components/tries/LongPress'


function App() {
  const location = useLocation();

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("authToken"));

  // State for the logged-in user's data
  const [currentUser, setCurrentUser] = useState(null);

  // Effect to load user data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthPage = ['/', '/login', '/register'].includes(location.pathname.toLowerCase());

  return (
    <div className="App">
      <div className="d-flex" id="wrapper">
        <div className='w-100' id="page-content-wrapper">
          {/* Pass both user and setIsLoggedIn to Header */}
          {isLoggedIn && !isAuthPage && <Header setIsLoggedIn={setIsLoggedIn} user={currentUser} />}
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <LandingPage />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/home" replace /> : <Register />} />
            {/* Pass setCurrentUser to the Login component */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} />

            {/* Protected Routes */}
            <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
            <Route path="/McaTwo" element={isLoggedIn ? <McaTwo /> : <Navigate to="/" />} />
            <Route path="/McaOne" element={isLoggedIn ? <McaOne /> : <Navigate to="/" />} />
            <Route path="/ParticlePage" element={<ParticlePage />} />
          </Routes>
          {isLoggedIn && !isAuthPage && <Footer setIsLoggedIn={setIsLoggedIn} user={currentUser} />}
        </div>
      </div>
    </div>
  );
}

export default App;

