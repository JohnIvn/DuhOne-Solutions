const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: "black", // Dark brown color for the footer
                color: "#ffffff", // White text
                textAlign: "center",
                padding: "30px 0",
                position: "relative",
                borderTop: "5px solid white",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "0 5%",
                    flexWrap: "wrap", // Allow wrapping on smaller screens
                }}
            >
                {/* Left Section */}
                <div style={{ fontSize: "20px", flex: "1 1 100%", textAlign: "center" }}>
                    <span>&copy; DuhOne Solutions Inc.</span>
                </div>

                {/* Center Section */}
                <div style={{ flex: "1 1 100%", textAlign: "center", margin: "10px 0" }}>
                    <img
                        src="https://cdn.discordapp.com/attachments/1296104834432368797/1313482932974784572/image-removebg-preview_41.png?ex=675cd20e&is=675b808e&hm=b94a0be44e4daa1f7fc72b1290c00558eabbbd2fd125cb77201ee5c32abcf041&"
                        alt="Custom Footer Icon"
                        style={{ width: "200px", height: "40px" }}
                    />
                </div>

                {/* Right Section */}
                <div style={{ fontSize: "20px", flex: "1 1 100%", textAlign: "center" }}>
                    <span>duhonesolutions@gmail.com</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;