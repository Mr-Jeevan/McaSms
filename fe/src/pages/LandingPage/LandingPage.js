import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <section>
            <div>
                <nav className="navbar">
                    <div className="container-fluid">
                        <span className="navbar-brand">SMS</span>
                        <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                            <Link to="/login">
                                <button className="btn btn-outline-success" type="submit">Log-In</button>
                            </Link>
                        </form>
                    </div>
                </nav>
            </div>
        </section>
    )
}

export default LandingPage