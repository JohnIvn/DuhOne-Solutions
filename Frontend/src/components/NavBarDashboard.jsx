import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Api';

const NavBarDashboard = () => {
  const [profileImage, setProfileImage] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await api.get('/homepage');

        const { path } = response.data;
        setProfileImage(`http://localhost:3000${path}`);  
        console.log("profile image: ", profileImage);
      } catch (error) {
        console.error('Error fetching profile image:', error.message);
        alert('Failed to load profile image. Please try again later.');
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin'); 
  };

  return (
    <header className="p-3 mb-3 border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
            <svg className="bi me-2" width={40} height={32} role="img" aria-label="Bootstrap">
              <use xlinkHref="#bootstrap" />
            </svg>
          </Link>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/homepage" className="nav-link px-2 link-secondary">Overview</Link></li>
            <li><Link to="/subscription" className="nav-link px-2 link-body-emphasis">Subscriptions</Link></li>
            <li><Link to="/profile" className="nav-link px-2 link-body-emphasis">Settings</Link></li>
            <li><Link to="/review" className="nav-link px-2 link-body-emphasis">Review</Link></li>
          </ul>
          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
          </form>
          <div className="dropdown text-end">
            <button
              className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ border: 'none', background: 'none' }}
            >
              <img
                src={profileImage || 'https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg'}
                onError={(e) => e.target.src = 'https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg'} 
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-circle"
              />
            </button>
            <ul className="dropdown-menu text-small">
              <li><Link className="dropdown-item" to="/new-project">New project...</Link></li>
              <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBarDashboard;
