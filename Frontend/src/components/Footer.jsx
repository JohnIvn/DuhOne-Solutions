import '../CSS/Footer.css';

const Footer = () => {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top mt-5 mb-5 ms-4 me-4 text-white"> 
            <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-white text-decoration-none lh-1">
                    <i className="bi bi-bootstrap" width="30" height="24"></i>
                </a>
                <span className="mb-3 mb-md-0 text-white ms-2">DuhOne 2024 Inc.</span> 
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li className="ms-3">
                    <a className="text-white" href="#">
                        <i className="bi bi-twitter" width="24" height="24"></i>
                    </a>
                </li>
                <li className="ms-3">
                    <a className="text-white" href="#">
                        <i className="bi bi-instagram" width="24" height="24"></i>
                    </a>
                </li>
                <li className="ms-3">
                    <a className="text-white" href="#">
                        <i className="bi bi-facebook" width="24" height="24"></i>
                    </a>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
