const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: "black", // Dark brown color for the footer
                color: "#ffffff", // White text
                textAlign: "center",
                padding: "30px 0",
                position: "relative",
                borderTop: "2px solid white"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 5%" }}>
                {/* Left Section */}
                <div style={{ fontSize: "20px" }}>
                    <span>&copy; DuhOne Solutions Inc.</span>
                </div>

                {/* Center Section */}
                <div>
                    <img
              src="https://cdn.discordapp.com/attachments/1296104834432368797/1313482932974784572/image-removebg-preview_41.png?ex=6754e90e&is=6753978e&hm=84c04321acc2fe1fb964c86a574942fc30cfddca1dfd65ec73a6ec5483d82ae6&" 
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