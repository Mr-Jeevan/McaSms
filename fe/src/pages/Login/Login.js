
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <section>
            <div className="container bg-light py-5">
                <div className="card mx-auto" style={{ maxWidth: '400px' }}>
                    <div className="card-header text-center fw-bold">LOGIN</div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text" name="id" placeholder="User ID" className="form-control" value={id} onChange={(e) => setId(e.target.value)} required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password" name="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100"> Submit </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

