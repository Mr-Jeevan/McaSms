import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

// import "./ImageSlider.scss";

import banner_1 from "../../assets/imgs/landingpage/banner_1.png"
import banner_2 from "../../assets/imgs/landingpage/banner_2.png"
import banner_3 from "../../assets/imgs/landingpage/banner_3.png"
import banner_4 from "../../assets/imgs/landingpage/banner_4.png"

const images = [
    banner_2,
    banner_3,
    banner_4,
    banner_1
];
const LandingPage = () => {

    const trackRef = useRef(null);

    const codeSnippet = `
while (alive) {
    eat();
    sleep();
    code();
    design();
    repeat();
}`;

    useEffect(() => {
        const track = trackRef.current;
        let x = 0;
        let frameId;

        const scroll = () => {
            x += 0.5; // speed
            track.style.transform = `translateX(-${x}px)`;
            if (x >= track.scrollWidth / 2) {
                x = 0;
            }
            frameId = requestAnimationFrame(scroll);
        };

        scroll();

        return () => cancelAnimationFrame(frameId);
    }, []);
    return (
        <section id='landingpage'>
            <div>
                <nav className="navbar header">
                    <div className="container-fluid mx-5">
                        <span className="navbar-brand">SMS</span>
                        <form className="d-flex" >
                            <Link to="/login">
                                <button className="btn px-5 rounded-2" type="submit">LOGIN</button>
                            </Link>
                        </form>
                    </div>
                </nav>
            </div>

            <div className="banner container my-5">
                <div className="heading">
                    <h1 className="text-center">MCA STUDENTS DETAILS</h1>
                </div>
                <div className="banner_content">
                    <div className="row">
                        <div className="col-6">
                            <p>Our department’s Student Management System is designed exclusively for staff, streamlining the way you organize, access, and export student data. Categorize students year-wise for clear, structured management. Instantly view comprehensive student profiles, attendance records, and academic performance, all in one place.</p>
                        </div>
                        <div className="col-6">
                            <img className='img-fluid' src={banner_1} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="slider my-5 py-3">
                <div className="slider_content">
                    <div className="smooth-scroller">
                        <div className="image-track" ref={trackRef}>
                            {[...images, ...images].map((src, i) => (
                                <img key={i} src={src} alt={`img-${i}`} className="scroller-img" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="login_btn my-5 py-3">
                <div className="d-flex justify-content-center ">
                    <button className='btn px-4'><>LOGIN</></button>
                </div>
            </div>

            <div className="advice">
                <div className="advice-content d-flex justify-content-center">
                    <div className="code-container">
                        <h2>A Dev Loop</h2>
                        <pre>
                            <code>
                                <span className="keyword">while</span> (true) {'{'}{'\n'}
                                &nbsp;&nbsp;<span className="function-name">eat</span>();{'\n'}
                                &nbsp;&nbsp;<span className="function-name">sleep</span>();{'\n'}
                                &nbsp;&nbsp;<span className="special-function">code</span>();{'\n'}
                                &nbsp;&nbsp;<span className="another-special-function">design</span>();{'\n'}
                                &nbsp;&nbsp;<span className="function-name">repeat</span>();{'\n'}
                                {'}'}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
            <hr />
            <footer>
                <div className="content">
                    <div className="d-flex justify-content-between">
                            <h2>SMS</h2>
                            <p className='txt-disabled'>Copyright @2025</p>
                    </div>
                </div>
            </footer>
        </section>
    )
}

export default LandingPage