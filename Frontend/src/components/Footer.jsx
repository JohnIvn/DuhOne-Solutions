const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: "#4a3f33", // Dark brown color for the footer
                color: "#ffffff", // White text
                textAlign: "center",
                padding: "20px 0",
                position: "relative",
            }}
        >
            <div style={{ borderTop: "10px solid #c06d28", marginBottom: "30px" }}></div> {/* Top orange border */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 10%" }}>
                {/* Left Section */}
                <div style={{ fontSize: "20px" }}>
                    <span>&copy; DuhOne Solutions Inc.</span>
                </div>

                {/* Center Section */}
                <div>
                    <img
              src="https://cdn.discordapp.com/attachments/1296104834432368797/1313482932974784572/image-removebg-preview_41.png?ex=6752460e&is=6750f48e&hm=61cf9c15c780a5977faf93a682b1a2ea21cb63564d11a4c8cb305930f49e3e69&" 
              alt="Custom Footer Icon"
                        style={{ width: "200px", height: "40px" }}
                    />
                </div>

                {/* Right Section */}
                <div style={{ fontSize: "20px" }}>
                    <span>
                        duhonesolutions@gmail.com
                        
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
