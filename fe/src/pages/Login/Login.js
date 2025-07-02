
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "./login.css"


const Login = ({ setIsLoggedIn }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        // validation
        if (id === 'admin' && password === 'password') {
            setIsLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true");
            navigate('/home', { replace: true });
        } else {
            alert("incorrect credentials")
        }
    }

    //prevents page back after log in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            navigate('/home', { replace: true }); // Replace history to block back nav
        }
    }, [navigate]);



    return (
        <section id='login' >
            <div className='sms fs-1 p-5'> SMS</div>
            <div className="d-flex justify-content-center align-items-center ">
                <div className="bg-light opacity-25 w-50 d-flex flex-column justify-content-center align-items-center p-4 rounded-4">
                    <div className="w-50 d-flex flex-column justify-content-center align-items-center ">
                        <div className="pb-3 mb-4 text-center fw-bold fs-3">LOGIN</div>
                        <div className="w-100  ">
                            <form onSubmit={onSubmit}>
                                <div className="mb-3  ">
                                    <input
                                        type="text"
                                        name="id"
                                        placeholder="User ID"
                                        className="insert w-100 text-white p-3 px-5 rounded-4 border-light"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="insert w-100 p-3 rounded-4 px-5 border-light"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button type="submit" className="btn btn-primary w-50 rounded-4">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
        </section>
    );
};

export default Login;

