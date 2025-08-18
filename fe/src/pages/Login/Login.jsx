import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/apiService'; // Adjust path
import "../../GolbalCss/index.css";
import "./login.css";

import ParticlePage from '../../components/ParticlesBackground/ParticlePage';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
            navigate('/home', { replace: true });
        }
    }, [navigate, setIsLoggedIn]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            // Use the centralized API service function
            const data = await loginUser({ email, password });

            localStorage.setItem("authToken", data.token);
            setIsLoggedIn(true);
            navigate('/home', { replace: true });

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <ParticlePage>
            <section id='login'>
                <div className="container">
                    <div className="contents d-flex justify-content-center align-items-center vh-100">
                        <div className="row">
                            <div className="col-6">
                                <div className="heading text-center my-5">
                                    <h1>MCA STUDENTS DETAILS</h1>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card login_card glass_card mx-auto rounded">
                                    <div className="card-header text-center text-light">LOGIN</div>
                                    <div className="card-body">
                                        <form onSubmit={onSubmit}>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <div className="mb-3">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    className="form-control transparent_input rounded"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    className="form-control transparent_input rounded"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn bg-two w-50 form-control">Lemme In</button>
                                            </div>
                                        </form>
                                        <div className="mt-3 text-center">
                                            <p className="text-light">
                                                No account? <Link to="/register">Create one here</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ParticlePage>
    );
};

export default Login;
