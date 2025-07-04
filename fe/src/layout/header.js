import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./header.css";
function Header({ setIsLoggedIn }) {
    const [iconChange, seticonChange] = useState(false);
    const navigate = useNavigate()



    const iconChangeForSlider = () => {
        if (iconChange) {
            seticonChange(false);
        } else {
            seticonChange(true);

        }
    }

    const sideBarHideShow = (event) => {
        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (sidebarToggle) {
            // Uncomment Below to persist sidebar toggle between refreshes
            // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            //     document.body.classList.toggle('sb-sidenav-toggled');
            // }
            // sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');

            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
            // });
        }
    }
    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            <section id="header">

                <nav className="navbar p-1 navbar-expand-lg border-bottom fixed-top mb-5  ">
                    <div className="container-fluid d-flex align-items-center justify-content-between">

                        {/* LEFT: Logo */}
                        <div className="d-flex align-items-center gap-3">
                            <img src="/asset/img/srm-ist-logo.jpg" alt="Logo" height="40" />
                        </div>

                        {/* CENTER: Title */}
                        <div className="d-none d-lg-block position-absolute start-50 translate-middle-x">
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>MCA</span>
                        </div>

                        {/* Sidebar Toggle Icon */}
                        <span style={{ cursor: 'pointer', fontSize: '25px' }} id="sidebarToggle" onClick={sideBarHideShow}>
                            {iconChange ? (
                                <i onClick={iconChangeForSlider} className="fa-solid fa-circle-arrow-right"></i>
                            ) : (
                                <i onClick={iconChangeForSlider} className="fa-solid fa-circle-arrow-left"></i>
                            )}
                        </span>

                        {/* Toggler for mobile */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* RIGHT: Navbar Items */}
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/home">Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link dropdown-toggle btn btn-link"
                                        id="navbarDropdown"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Class
                                    </button>

                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/LongPress">MCA I</Link>
                                        <Link className="dropdown-item" to="/McaTwo">MCA II</Link>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <button onClick={logout} className=" btn btn-outline-danger rounded bg-one ">
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