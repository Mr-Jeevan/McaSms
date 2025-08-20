import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../GlobalCss/LandingPage.css'
import "@fontsource/k2d";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import "./ImageSlider.scss";

import banner_1 from "../assets/imgs/landingpage/banner_1.webp"
import banner_2 from "../assets/imgs/landingpage/banner_2.webp"
import banner_3 from "../assets/imgs/landingpage/banner_3.webp"
import banner_4 from "../assets/imgs/landingpage/banner_4.webp"

const images = [
    banner_2,
    banner_3,
    banner_4,
    banner_1
];
const LandingPage = () => {

    const trackRef = useRef(null);


    const codeSnippet =
        `while (isDeveloper) {
    eat();
    sleep();
    code();
    repeat();
}`;

    const [displayedCode, setDisplayedCode] = useState('');
    useEffect(() => {
        let timeout;

        // Function to handle the deleting effect
        const deleteText = () => {
            // By placing the logic inside the setter, `prev` is always the latest state.
            setDisplayedCode(prev => {
                if (prev.length > 0) {
                    // If there's text, remove one character and schedule the next deletion.
                    timeout = setTimeout(deleteText, 35);
                    return prev.slice(0, -1);
                } else {
                    // If the text is empty, schedule the next typing animation.
                    timeout = setTimeout(() => typeText(0), 1000);
                    return ''; // Return the empty string to finalize the state.
                }
            });
        };

        // Function to handle the typing effect (this function was already correct)
        const typeText = (index = 0) => {
            if (index < codeSnippet.length) {
                // Add the next character
                setDisplayedCode(prev => prev + codeSnippet[index]);
                timeout = setTimeout(() => typeText(index + 1), 50);
            } else {
                // After typing, pause and then start deleting
                timeout = setTimeout(deleteText, 2000);
            }
        };

        // Start the initial animation
        typeText();

        // Cleanup function to clear the timeout when the component unmounts
        return () => clearTimeout(timeout);
    }, []); // CORRECTED: Use an empty array for a run-once effect.

    // slider
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
                        <span className="navbar-brand text-light">SMS</span>
                        <form className="d-flex" >
                            <Link to="/login">
                                <button className="btn px-5 rounded-2" type="submit">LOGIN</button>
                            </Link>
                        </form>
                    </div>
                </nav>
            </div>

            <div className="banner container my-5 ">
                <div className="heading">
                    <h1 className="text-center">MCA STUDENTS DETAILS</h1>
                </div>
                <div class="container-fluid py-5 my-5 ">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <p class=" lead lh-base mb-4">
                                Our department’s Student Management System is designed exclusively for staff, streamlining the way you organize, access, and export student data. Categorize students year-wise for clear, structured management. Instantly view comprehensive student profiles, attendance records, and academic performance, all in one place.
                            </p>
                        </div>
                        <div class="col-md-6">
                            <img class="img-fluid rounded shadow" src={banner_1} alt="Student Management Banner" />
                        </div>
                    </div>
                </div>
            </div>

            {/* slider */}
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
                    <Link to="/register">
                        <button className='btn px-4'>REGISTER</button>
                    </Link>
                </div>
            </div>
            {/* coloring the syntax */}
            <div className="advice">
                <div className="advice-content d-flex justify-content-center">
                    <div className="code-container">
                        <h2>A Dev Loop</h2>
                        <SyntaxHighlighter language="javascript" style={synthwave84}>
                            {displayedCode}
                        </SyntaxHighlighter>
                        {/* <TypeAnimation
                            sequence={[
                                coloredSyntax,
                                4000,
                                '',
                            ]}
                            wrapper='pre'
                            speed={50}
                            repeat={Infinity}

                        /> */}
                        {/* <pre>
                            <code>
                                <span className="keyword">while</span> (true) {'{'}{'\n'}
                                &nbsp;&nbsp;<span className="function-name">eat</span>();{'\n'}
                                &nbsp;&nbsp;<span className="function-name">sleep</span>();{'\n'}
                                &nbsp;&nbsp;<span className="special-function">code</span>();{'\n'}
                                &nbsp;&nbsp;<span className="another-special-function">design</span>();{'\n'}
                                &nbsp;&nbsp;<span className="function-name">repeat</span>();{'\n'}
                                {'}'}
                            </code>
                        </pre> */}
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