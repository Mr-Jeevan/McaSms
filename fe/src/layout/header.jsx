import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../GolbalCss/header.css";

// Accept the user object as a prop
function Header({ setIsLoggedIn, user }) {
    const navigate = useNavigate();

    const logout = () => {
        // Remove both the token and the user object from storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            <section id="header">
                <nav className="navbar p-1 navbar-expand-lg border-bottom fixed-top mb-5">
                    <div className="container-fluid d-flex align-items-center justify-content-between">

                        {/* LEFT: Logo */}
                        <div className="d-flex align-items-center gap-3">
                            <img src="/asset/img/srm-ist-logo.jpg" alt="Logo" height="40" />
                        </div>

                        {/* CENTER: Title */}
                        <div className="d-none d-lg-block position-absolute start-50 translate-middle-x">
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>MCA</span>
                        </div>

                        {/* Toggler for mobile */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* RIGHT: Navbar Items */}
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mt-2 mt-lg-0 align-items-center">
                                <li className="nav-item active">
                                    <Link className="nav-link text-white" to="/home">Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link dropdown-toggle btn btn-link text-white"
                                        id="navbarDropdown"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Class
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/McaOne">MCA I</Link>
                                        <Link className="dropdown-item" to="/McaTwo">MCA II</Link>
                                    </div>
                                </li>
                                
                                {/* Display Welcome Message */}
                                <li className="nav-item mx-2">
                                    <span className="navbar-text text-white">
                                        {user?.username || 'User'}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <button onClick={logout} className="btn btn-outline-danger rounded bg-one fw-bold">
                                        Log-Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </section>
        </>
    )
}

export default Header;
