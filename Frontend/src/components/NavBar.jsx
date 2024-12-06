import '../CSS/NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid d-flex justify-content-between">
                <a className="navbar-brand" href="landingpage">DuhOne</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto" > 
                        <li className="nav-item" style={{marginLeft: '100px'}}>
                            <a className="nav-link active" aria-current="page" href="homepage">Products & Services</a>
                        </li>
                        <li className="nav-item separator">
                            <span className="separator-text">|</span>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="homepage">Partners</a>
                        </li>
                        <li className="nav-item separator">
                            <span className="separator-text">|</span>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Support</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link active text-nowrap" href="signin">Sign in</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;