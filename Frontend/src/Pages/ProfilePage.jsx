import React, { useState, useEffect } from "react";
import "../CSS/ProfilePage.css";
import NavBarDashboard from "../components/NavBarDashboard.jsx";
import Footer from "../components/Footer.jsx";
import api from "../Api.js";

const ProfilePage = () => {
  const [showPlanning, setShowPlanning] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [myAccount, setMyAccount] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    barangay: "",
    zipCode: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/userprofile");
        setFormData(response.data);
        setMyAccount(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        alert("Failed to load user profile. Please try again later.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await api.post("/userprofile", formData);
      setMyAccount(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <NavBarDashboard />
      <div className="container">
        <div className="row gutters">
          {/* Left Box */}
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        alt="User Avatar"
                      />
                    </div>
                    <h5 className="user-name">{myAccount?.firstName || "User"}</h5>
                    <h6 className="user-email">{myAccount?.email || "user@example.com"}</h6>
                  </div>
                  <div className="about">
                    <button
                      className="btn btn-primary mb-2"
                      onClick={() => {
                        setShowPlanning(false);
                        setShowAccount(false);
                      }}
                    >
                      Personal Information
                    </button>
                    <button
                      className="btn btn-primary mb-2"
                      onClick={() => {
                        setShowPlanning(true);
                        setShowAccount(false);
                      }}
                    >
                      Planning
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setShowAccount(true);
                        setShowPlanning(false);
                      }}
                    >
                      My Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box */}
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                {showPlanning ? (
                  <div className="blue-text-box">
                    You haven't subscribed to any plan yet!
                  </div>
                ) : showAccount ? (
                  <div className="account-info">
                    <h6 className="text-primary">My Account Information</h6>
                    <p>
                      <strong>First Name:</strong> {myAccount?.firstName}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {myAccount?.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {myAccount?.email}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {myAccount?.phoneNumber}
                    </p>
                    <p>
                      <strong>Street:</strong> {myAccount?.street}
                    </p>
                    <p>
                      <strong>City:</strong> {myAccount?.city}
                    </p>
                    <p>
                      <strong>Barangay:</strong> {myAccount?.barangay}
                    </p>
                    <p>
                      <strong>Zip Code:</strong> {myAccount?.zipCode}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Personal Details Section */}
                    <div className="row gutters">
                      <div className="col-xl-12">
                        <h6 className="mb-2 text-primary">Personal Details</h6>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="fullName">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="eMail">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="eMail"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="user@example.com"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+63"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="row gutters">
                      <div className="col-xl-12">
                        <h6 className="mt-3 mb-2 text-primary">Address</h6>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="street">Street</label>
                          <input
                            type="text"
                            className="form-control"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="Enter street"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="barangay">Barangay</label>
                          <input
                            type="text"
                            className="form-control"
                            id="barangay"
                            name="barangay"
                            value={formData.barangay}
                            onChange={handleInputChange}
                            placeholder="Enter barangay"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <label htmlFor="zipCode">Zip Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="Enter zip code"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row gutters">
                      <div className="col-xl-12">
                        <div className="text-right">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Update"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
