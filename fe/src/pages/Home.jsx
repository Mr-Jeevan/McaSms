// import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import wall_e_modal from "../assets/imgs/wall_e_modal.webp";

import "../GlobalCss/Home.css"

const Home = () => {

    return (
        <>
            <section id="home" className=" mt-5">
                <div className="banner_bg pt-3 pb-5">
                    <div className="banner container rounded-3 shadow-lg p-3 my-5">
                        {/* heading */}
                        <div className="heading">
                            <h1 className='text-center'>MCA STUDENT DETAILS
                            </h1>
                        </div>
                        {/* banner container row */}
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 order-2 order-lg-1 my-2  ">

                                <div className="card_container_mca1 ms-5">

                                    <Link className="nav-link" to="/McaOne">

                                        <div className="card my-3 c_1 wallet">
                                            <div className="overlay"></div>
                                            <div className="circle">
                                                <div className='dept fw-bold z-1'>MCA I</div>
                                            </div>
                                        </div>
                                    </Link>

                                </div>

                                <div className="card_container_mca2 me-5">
                                    <Link className="nav-link" to="/McaTwo">

                                        <div className="card my-3 ms-auto c_2 wallet">
                                            <div className="overlay"></div>
                                            <div className="circle">
                                                <div className='dept fw-bold z-1 '>MCA 2</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* hero image */}
                            <div className="col-lg-6 col-sm-12 col-md-12 order-1 order-lg-2 my-2">
                                <div className="hero-image d-flex justify-content-center align-items-center h-100 w-100">
                                    <img src={wall_e_modal} alt="nallaruku-la" className='img-fluid w-50 ' id="hero_img" />
                                    <div className="glow">u r gay</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <br />



        </>
    );
};

export default Home;
