import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MessageIcon from '@mui/icons-material/Message';

const NavBarDashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [messages, setMessages] = useState([]); // Store messages
  const [currentMessage, setCurrentMessage] = useState(''); // Current input

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleChatBox = () => {
    setShowChatBox((prev) => !prev);
  };

  const handleMessageChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() !== '') {
      setMessages((prev) => [...prev, currentMessage]);
      setCurrentMessage(''); // Clear input field
    }
  };

  return (
    <header className="p-3 mb-3 border-bottom" style={{ backgroundColor: '#051b36' }}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          {/* Logo */}
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
            <img
              src="https://cdn.discordapp.com/attachments/1296104834432368797/1313482932974784572/image-removebg-preview_41.png?ex=6752460e&is=6750f48e&hm=61cf9c15c780a5977faf93a682b1a2ea21cb63564d11a4c8cb305930f49e3e69&"
              alt="Logo"
              width={200}
              height={50}
              className="me-2"
            />
          </a>

          {/* Centered Nav Links */}
          <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a
                href="/homepage"
                className="nav-link px-2"
                style={{ color: 'white', textDecoration: 'none' }}
                onMouseOver={(e) => (e.target.style.color = 'black')}
                onMouseOut={(e) => (e.target.style.color = 'white')}
              >
                Homepage
              </a>
            </li>
            <li>
              <a
                href="/subscription"
                className="nav-link px-2"
                style={{ color: 'white', textDecoration: 'none' }}
                onMouseOver={(e) => (e.target.style.color = 'black')}
                onMouseOut={(e) => (e.target.style.color = 'white')}
              >
                Subscriptions
              </a>
            </li>
            <li>
              <a
                href="/profile"
                className="nav-link px-2"
                style={{ color: 'white', textDecoration: 'none' }}
                onMouseOver={(e) => (e.target.style.color = 'black')}
                onMouseOut={(e) => (e.target.style.color = 'white')}
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="/review"
                className="nav-link px-2"
                style={{ color: 'white', textDecoration: 'none' }}
                onMouseOver={(e) => (e.target.style.color = 'black')}
                onMouseOut={(e) => (e.target.style.color = 'white')}
              >
                Review
              </a>
            </li>
          </ul>

          {/* Profile and Notification Icons */}
          <div className="d-flex align-items-center text-end">
            {/* Message Icon */}
            <MessageIcon
              style={{ fontSize: 32, color: 'white', marginRight: '16px', cursor: 'pointer' }}
              onClick={toggleChatBox}
            />

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <NotificationsActiveIcon
                style={{ fontSize: 32, color: 'white', marginRight: '16px', cursor: 'pointer' }}
                onClick={toggleNotifications}
              />
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    width: '300px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                  }}
                >
                  <p style={{ padding: '10px', borderBottom: '1px solid #ddd', fontSize: '14px', color: '#333' }}>
                    No subscriptions yet!
                  </p>
                </div>
              )}
            </div>

            {/* Account Icon with Dropdown */}
            <div className="dropdown">
              <a
                href="#"
                className="d-block text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <AccountCircleIcon
                  style={{ fontSize: 32, color: 'white', cursor: 'pointer' }}
                />
              </a>
              <ul className="dropdown-menu text-small" style={{ backgroundColor: '#051b36' }}>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    style={{ color: 'white', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.target.style.color = 'black')}
                    onMouseOut={(e) => (e.target.style.color = 'white')}
                  >
                    New project...
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    style={{ color: 'white', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.target.style.color = 'black')}
                    onMouseOut={(e) => (e.target.style.color = 'white')}
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    style={{ color: 'white', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.target.style.color = 'black')}
                    onMouseOut={(e) => (e.target.style.color = 'white')}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    style={{ color: 'white', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.target.style.color = 'black')}
                    onMouseOut={(e) => (e.target.style.color = 'white')}
                    onClick={handleLogout}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbox Modal */}
      {showChatBox && (
        <div
          style={{
            position: 'fixed',
            bottom: '0',
            right: '20px',
            width: '300px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#051b36',
              color: 'white',
              padding: '10px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
            }}
            onClick={toggleChatBox}
          >
            <strong>Admin</strong>
          </div>
          <div style={{ padding: '10px', height: '200px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <p key={index} style={{ color: '#333', margin: '5px 0' }}>
                {msg}
              </p>
            ))}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '5px' }}>
            <input
              type="text"
              value={currentMessage}
              onChange={handleMessageChange}
              placeholder="Type a message..."
              style={{ flex: 1, border: 'none', outline: 'none', padding: '10px' }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: '#051b36',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBarDashboard;
