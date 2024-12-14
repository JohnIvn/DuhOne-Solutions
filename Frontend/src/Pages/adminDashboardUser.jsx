import React, { useState, useEffect } from "react";
import { Button, Table, Container, Modal, Form, DropdownButton, Dropdown } from "react-bootstrap";
import { Edit, Delete, Email, Block, Add, PeopleOutlineRounded} from "@mui/icons-material";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from "../components/Footer.jsx";
import api from "../Api.js";
import { useSocket } from '../socketContext.jsx';
import "../CSS/UserProfileDashboard.css";
import CreateAccountModal from "../components/createAccountModal.jsx";

const UserProfileDashboard = () => {
  const { socket } = useSocket();
  const [userProfiles, setUserProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState({
    firstName: "",
    lastName: "",
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

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    zipCode: "",
  });

  const [borderColors, setBorderColors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await api.get("/Admin-Portal/Users");
        setUserProfiles(response.data);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserProfiles();

    if (socket) {
      socket.on("profileUpdated", (updatedProfile) => {
        setUserProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.userId === updatedProfile.userId ? updatedProfile : profile
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("profileUpdated");
      }
    };
  }, [socket]);

  const fetchUserProfileData = async (id) => {
    try {
      const response = await api.get(`/Admin-Portal/Users/get-user-profiles/${id}`);
      setUserProfileData(response.data);
      setInitialUserProfileData(response.data);
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  const handleEdit = (userId) => {
    setModalUserId(userId);
    fetchUserProfileData(userId);
    setShowModal(true);
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    const newBorderColors = {};

    if (userProfileData.firstName.length < 3 || userProfileData.firstName.length > 30) {
      newErrors.firstName = "First name must be between 3 and 30 characters.";
      newBorderColors.firstName = "red";
      formIsValid = false;
    }

    if (userProfileData.lastName.length < 3 || userProfileData.lastName.length > 30) {
      newErrors.lastName = "Last name must be between 3 and 30 characters.";
      newBorderColors.lastName = "red";
      formIsValid = false;
    }

    if (!/^\d+$/.test(userProfileData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be numeric.";
      newBorderColors.phoneNumber = "red";
      formIsValid = false;
    }
    if (!/^\d{4}$/.test(userProfileData.zipCode)) {
      newErrors.zipCode = "Zip code must be exactly 4 digits and numeric.";
      newBorderColors.zipCode = "red";
      formIsValid = false;
    }
    

    setErrors(newErrors);
    setBorderColors(newBorderColors);

    return formIsValid;
  };

  useEffect(() => {
    validateForm();
  }, [userProfileData]);

  const handleSaveChanges = async () => {
    if (validateForm()) {
      try {
        const { firstName, lastName, phoneNumber, street, city, barangay, zipCode } = userProfileData;
        await api.post(`/Admin-Portal/Users/edit-user-profile-modal/${modalUserId}`, {
          firstName,
          lastName,
          phoneNumber,
          street,
          city,
          barangay,
          zipCode,
        });

        if (socket) {
          socket.emit("profileUpdated", { userId: modalUserId, firstName, lastName, phoneNumber, street, city, barangay, zipCode });
        }

        setUserProfiles(
          userProfiles.map((profile) =>
            profile.userId === modalUserId
              ? { ...profile, firstName, lastName, phoneNumber, street, city, barangay, zipCode }
              : profile
          )
        );
        setShowModal(false);
      } catch (error) {
        console.error("Error saving profile changes:", error);
      }
    }
    fetchUserProfileData();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Admin-Portal/Users/${userIdToDelete}/delete`);

      setUserProfiles(userProfiles.filter((profile) => profile.userId !== userIdToDelete));
      setShowDeleteModal(false);

      if (socket) {
        socket.emit("profileDeleted", userIdToDelete);
      }
    } catch (error) {
      console.error("Error deleting user profile:", error);
    }
  };

  const handleConfirmDelete = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleSearch = async () => {
    try {
      const response = await api.get("Admin-Portal/Users/search-by-email-or-userId", {
        params: {
          email: searchTerm.includes("@") ? searchTerm : undefined,
          userId: !isNaN(searchTerm) ? searchTerm : undefined,
        },
      });
      setUserProfiles(response.data);
    } catch (error) {
      console.error("Error searching user profiles:", error);
    }
  };

  const fetchSortedProfiles = async (type, order) => {
    try {
      const endpoint =
        type === "userId" ? "/sort-by-userId" : "/sort-by-date";
      const response = await api.get(`/Admin-Portal/Users/${endpoint}?order=${order}`);
      setUserProfiles(response.data);
    } catch (error) {
      console.error("Error fetching sorted profiles:", error);
    }
  };

  const filteredProfiles = userProfiles.filter(
    (profile) =>
      profile.userId.toString().includes(searchTerm) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setUserProfileData((prevData) => ({
        ...prevData,
        [name]: initialUserProfileData[name],
      }));
    }
  };

  return (
    <>
      <AdminNavDashboard />
      <Container fluid className="user-profile-dashboard" style={{ backgroundColor: "#051b36", minHeight: "100vh" }}>
        <h1 className="dashboard-title">User Profiles</h1>

        {/* Filter and search section */}
        <div className="filters-container d-flex justify-content-between align-items-center">
          <div className="filter-group d-flex">
            <input
              type="text"
              placeholder="Search by Email or User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input me-2"
            />
            <Button
              onClick={() => setSearchTerm("")}
              variant="secondary"
              className="reset-button"
            >
              Reset Filters
            </Button>
          </div>

          <div className="sort-buttons d-flex">
            <DropdownButton title="Sort by ID" variant="primary" className="me-2">
              <Dropdown.Item onClick={() => fetchSortedProfiles("userId", "ASC")}>
                ASC
              </Dropdown.Item>
              <Dropdown.Item onClick={() => fetchSortedProfiles("userId", "DESC")}>
                DESC
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton title="Sort by Date" variant="primary">
              <Dropdown.Item onClick={() => fetchSortedProfiles("date", "ASC")}>
                ASC
              </Dropdown.Item>
              <Dropdown.Item onClick={() => fetchSortedProfiles("date", "DESC")}>
                DESC
              </Dropdown.Item>
            </DropdownButton>
            <Button
  variant="warning"
  size="sm"
  onClick={() => setShowCreateAccountModal(true)} // Open the modal
  title="Create Account"
>
  <Add />
  <PeopleOutlineRounded />
</Button>
          </div>
        </div>

        {/* User Profile Table */}
        <div className="profiles-section">
        <Table bordered hover variant="dark" className="profiles-table">
  <thead>
    <tr>
      <th>User Id</th>
      <th>Full Name</th>
      <th>Email</th>
      <th>Date Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredProfiles.length === 0 ? (
      <tr>
        <td colSpan="5" className="no-profiles">
          No profiles found
        </td>
      </tr>
    ) : (
      filteredProfiles.map((profile) => (
        <tr key={profile.userId} className="profile-row">
          <td>{profile.userId}</td>
          <td>{profile.fullName}</td>
          <td>{profile.email}</td>
          <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
          <td>
            <Button onClick={() => handleEdit(profile.userId)}>
              <Edit />
            </Button>
            <Button onClick={() => handleConfirmDelete(profile.userId)}>
              <Delete />
            </Button>

            <Button onClick={()=> {
              
            }}>
              < Block/>
            </Button>
            <Button onClick={()=> {

            }}>
              <Email />
            </Button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</Table>

        </div>

        

        {/* Modal for Editing */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={userProfileData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{ borderColor: borderColors.firstName }}
                />
                <div className="error-text">{errors.firstName}</div>
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={userProfileData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{ borderColor: borderColors.lastName }}
                />
                <div className="error-text">{errors.lastName}</div>
              </Form.Group>

              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={userProfileData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{ borderColor: borderColors.phoneNumber }}
                />
                <div className="error-text">{errors.phoneNumber}</div>
              </Form.Group>

              <Form.Group controlId="street">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={userProfileData.street}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={userProfileData.city}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="barangay">
                <Form.Label>Barangay</Form.Label>
                <Form.Control
                  type="text"
                  name="barangay"
                  value={userProfileData.barangay}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="zipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zipCode"
                  value={userProfileData.zipCode}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{ borderColor: borderColors.zipCode }}
                />
                <div className="error-text">{errors.zipCode}</div>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/*  */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete User Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this user profile?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <CreateAccountModal
  show={showCreateAccountModal}
  onClose={() => setShowCreateAccountModal(false)} // Close the modal
/>

      </Container>

      <Footer />
    </>
  );
};

export default UserProfileDashboard;
