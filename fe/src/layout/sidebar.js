import { Link } from "react-router-dom";
import './sidebar.css';


function Sidebar() {
    return (
        <div className="border" id="sidebar-wrapper">
            <h1 className="sidebar-heading border-bottom p-3">Menu</h1>
            <div className="list-group list-group-flush">
                <Link className="list-group-item list-group-item-action list-group-item-light text-light bg-dark p-3" to="/">Dashboard</Link>
                <Link className="list-group-item list-group-item-action list-group-item-light text-light bg-dark p-3" to="/create-account">Create Account</Link>
                <Link className="list-group-item list-group-item-action list-group-item-light text-light bg-dark p-3" to="/log-in">Log In</Link>
                <Link className="list-group-item list-group-item-action list-group-item-light text-light bg-dark p-3" to="/users">Users</Link>
            </div>
        </div>
    )
}

// activeClassName="active-link"
// activeClassName="active-link"
// activeClassName="active-link"
// activeClassName="active-link"

export default Sidebar;