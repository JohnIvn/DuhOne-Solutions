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
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    barangay: "",
    zipCode: "",
  });

  const [borderColors, setBorderColors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    barangay: "",
    zipCode: "",
  });

  const [initialUserProfileData, setInitialUserProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    street: "",
    city: "",
    barangay: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/profile");
        setFormData(response.data);
        setMyAccount(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        alert("Failed to load user profile. Please try again later.");
      }
    };

    const fetchProfileImage = async () => {
      try {
        const response = await api.get("/profile/get-Image");
        const { path } = response.data;
        setProfileImage(`http://localhost:3000${path}`);
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
        alert("Failed to load profile image. Please try again later.");
      }
    };

    fetchUserProfile();
    fetchProfileImage();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" || name === "zipCode") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    const newBorderColors = {};

    if (formData.firstName.length < 3 || formData.firstName.length > 30) {
      newErrors.firstName = "First name must be between 3 and 30 characters.";
      newBorderColors.firstName = "red";
      formIsValid = false;
    }

    if (formData.lastName.length < 3 || formData.lastName.length > 30) {
      newErrors.lastName = "Last name must be between 3 and 30 characters.";
      newBorderColors.lastName = "red";
      formIsValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      newBorderColors.email = "red";
      formIsValid = false;
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 11 digits.";
      newBorderColors.phoneNumber = "red";
      formIsValid = false;
    }    

    if (formData.street.length < 3) {
      newErrors.street = "Street must be at least 3 characters long.";
      newBorderColors.street = "red";
      formIsValid = false;
    }

    if (formData.city.length < 3) {
      newErrors.city = "City must be at least 3 characters long.";
      newBorderColors.city = "red";
      formIsValid = false;
    }

    if (!/^\d{1,3}$/.test(formData.barangay)) {
      newErrors.barangay = "Barangay must be numeric and a maximum of 3 characters long.";
      newBorderColors.barangay = "red";
      formIsValid = false;
    }

    if (!/^\d{4}$/.test(formData.zipCode)) {
      newErrors.zipCode = "Zip code must be exactly 4 digits and numeric.";
      newBorderColors.zipCode = "red";
      formIsValid = false;
    }

    setErrors(newErrors);
    setBorderColors(newBorderColors);

    return formIsValid;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      setIsUpdating(true);
      try {
        const response = await api.post("/profile", formData);
        setMyAccount(response.data);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating user profile:", error.message);
        alert("Failed to update profile. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    setUploadingImage(true);

    try {
      const response = await api.post("/profile/image-upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response.data);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
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
                        src={profileImage || "https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg"}
                        alt={myAccount?.firstName ? `${myAccount.firstName}'s avatar` : "User Avatar"}
                        onError={(e) => (e.target.src = "https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg")}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="mt-2"
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
                  <div className="blue-text-box">You haven't subscribed to any plan yet!</div>
                ) : showAccount ? (
                  <div className="account-info">
                    <h6 className="text-primary">My Account Information</h6>
                    <p><strong>First Name:</strong> {myAccount?.firstName}</p>
                    <p><strong>Last Name:</strong> {myAccount?.lastName}</p>
                    <p><strong>Email:</strong> {myAccount?.email}</p>
                    <p><strong>Phone Number:</strong> {myAccount?.phoneNumber}</p>
                    <p><strong>Street:</strong> {myAccount?.street}</p>
                    <p><strong>City:</strong> {myAccount?.city}</p>
                    <p><strong>Barangay:</strong> {myAccount?.barangay}</p>
                    <p><strong>Zip Code:</strong> {myAccount?.zipCode}</p>
                  </div>
                ) : (
                  <div className="user-profile-edit">
                    <h6 className="text-primary">Edit Profile</h6>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.firstName}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.firstName}</small>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.lastName}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.lastName}</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className={`form-control ${borderColors.email}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.email}</small>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.phoneNumber}`}
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.phoneNumber}</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="street">Street</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.street}`}
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.street}</small>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.city}`}
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.city}</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="barangay">Barangay</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.barangay}`}
                          id="barangay"
                          name="barangay"
                          value={formData.barangay}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.barangay}</small>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="zipCode">Zip Code</label>
                        <input
                          type="text"
                          className={`form-control ${borderColors.zipCode}`}
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                        <small className="form-text text-danger">{errors.zipCode}</small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
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
