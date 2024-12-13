import '../CSS/NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            <div className="container-fluid">
                {/* Brand Image */}
                <a className="navbar-brand" href="landingpage">
                    <img
              src="https://cdn.discordapp.com/attachments/1296104834432368797/1313482932974784572/image-removebg-preview_41.png?ex=6752460e&is=6750f48e&hm=61cf9c15c780a5977faf93a682b1a2ea21cb63564d11a4c8cb305930f49e3e69&" 
              alt=""
                        className="navbar-logo"
                    />
                </a>

                {/* Toggler Button */}
                <button
    className="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarNavDropdown"
    aria-controls="navbarNavDropdown"
    aria-expanded="false"
    aria-label="Toggle navigation"
>
    <span className="navbar-toggler-icon"></span>
</button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto gap-3">
                        <li className="nav-item">
                            <a className="nav-link active" href="homepage" >Products & Services</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="homepage">Partners</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Support</a>
                        </li>
                    </ul>
                    <div className="navbar-signin-container">
                        <a className="nav-link signin-link" href="signin">Sign in</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
