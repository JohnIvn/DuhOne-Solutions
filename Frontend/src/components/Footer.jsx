const Footer = () => {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top mt-5 mb-5 ms-4 me-4"> 
            {/* Added left (ms-4) and right (me-4) margin to footer */}
            <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                    <i className="bi bi-bootstrap" width="30" height="24"></i>
                </a>
                <span className="mb-3 mb-md-0 text-body-secondary ms-2">DuhOne Solutions 2024 Inc.</span> {/* Added margin-left */}
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li className="ms-3">
                    <a className="text-body-secondary" href="#">
                        <i className="bi bi-twitter" width="24" height="24"></i>
                    </a>
                </li>
                <li className="ms-3">
                    <a className="text-body-secondary" href="#">
                        <i className="bi bi-instagram" width="24" height="24"></i>
                    </a>
                </li>
                <li className="ms-3">
                    <a className="text-body-secondary" href="#">
                        <i className="bi bi-facebook" width="24" height="24"></i>
                    </a>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;