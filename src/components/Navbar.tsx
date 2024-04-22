import React, { useContext } from "react";
import { Link } from "gatsby";
import { AuthContext } from "../components/AuthProvider";
import '../styles/Navbar.css';
import userIcon from '../assets/user.png';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/" className="navbar-link">Home</Link></li>
        <li><Link to="/account" className="navbar-link">Account</Link></li>
        <li><Link to="/activation" className="navbar-link">Activation</Link></li>
      </ul>

      <div className="user-icon" onClick={handleLogout}>
        <img src={userIcon} alt="User Icon"/>
        <span>Logout</span>
      </div>
    </nav>
  );
};

export default Navbar;
