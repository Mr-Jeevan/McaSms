
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../GolbalCss/index.css"
import "./login.css"

const Login = ({ setIsLoggedIn }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        // validation
        if (id === 'admin' && password === 'p') {
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
            <div className="container vh-100 d-flex  align-items-center">
 <div className="heading text-center my-5">
                        <h1>MCA STUDENTS DETAILS</h1>
                    </div>

                <div className="card login_card glass_card mx-auto rounded">
                    <div className="card-header text-center text-light">LOGIN</div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text" name="id" placeholder="User ID" className="id form-control  transparent_input rounded" value={id} onChange={(e) => setId(e.target.value)} required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password" name="password" placeholder="Password" className="password form-control  transparent_input rounded" value={password} onChange={(e) => setPassword(e.target.value)} required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn bg-two w-50 form-control">Lemme In</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </section >
    );
};

export default Login;

