import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService'; // Adjust path
import "../GlobalCss/index.css";
import "../GlobalCss/auth.css";

import ParticlePage from '../components/ParticlesBackground/ParticlePage';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !email || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            // Use the centralized API service function
            await registerUser({ username, email, password });

            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <ParticlePage>
            <section id='auth'>
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
                                    <div className="card-header text-center text-light">REGISTER</div>
                                    <div className="card-body">
                                        <form onSubmit={onSubmit}>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            {success && <div className="alert alert-success">{success}</div>}
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    placeholder="Username"
                                                    className="form-control text-light transparent_input rounded"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    className="form-control text-light transparent_input rounded"
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
                                                    className="form-control text-light transparent_input rounded"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn bg-two text-light w-50 form-control">Register</button>
                                            </div>
                                        </form>
                                        <div className="mt-3 text-center">
                                            <p className="text-light">
                                                Already have an account? <Link to="/login">Login here</Link>
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

export default Register;
