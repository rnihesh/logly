import React from "react";
import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import { adminContextObj } from "../../contexts/AdminContext.jsx";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import writingIcon from "../../assets/writing.svg";
import readIcon from "../../assets/read.svg";
import CommunityIcon from "../../assets/community.svg";
import AdminIcon from "../../assets/admin.svg";
import UserIcon from "../../assets/user.svg";
import AuthorIcon from "../../assets/author.svg";
import { getBaseUrl } from "../../utils/config.js";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { currentAdmin, setCurrentAdmin } = useContext(adminContextObj);

  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // console.log("isSignedIn :", isSignedIn);
  // console.log("user :", user);
  // console.log("isLoaded :", isLoaded);

  async function onSelectRole(e) {
    //clear error property
    setError("");
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    currentAdmin.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === "author") {
        res = await axios.post(
          `${getBaseUrl()}/author-api/author`,
          currentUser
        );
        let { message, payload } = res.data;
        if (message === "author") {
          setCurrentUser({
            ...currentUser,
            ...payload,
          });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === "user") {
        res = await axios.post(`${getBaseUrl()}/user-api/user`, currentUser);
        let { message, payload } = res.data;
        if (message === "user") {
          setCurrentUser({
            ...currentUser,
            ...payload,
          });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === "admin") {
        res = await axios.post(`${getBaseUrl()}/admin-api/admin`, currentAdmin);
        let { message, payload } = res.data;
        // console.log(message);
        if (message === "admin") {
          setCurrentAdmin({
            ...currentAdmin,
            ...payload,
          });
          //save user to local storage
          localStorage.setItem("currentadmin", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  // console.log("current user : ", currentUser);
  // console.log("current admin: ", currentAdmin);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 300);

    setCurrentUser({
      ...currentUser,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });
    setCurrentAdmin({
      ...currentAdmin,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });

    return () => clearTimeout(timeoutId);
  }, [isLoaded]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`author-profile/${currentUser.email}`);
    }
    if (currentAdmin?.role === "admin" && error.length === 0) {
      navigate(`admin-profile/${currentAdmin.email}`);
    }
  }, [currentUser, currentAdmin]);

  return (
    <div className="container">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {isSignedIn === false && (
            <div className="home-item p-5 rounded-5">
              <div className="welcome-section text-center mb-4">
                <h3>Welcome to Logly</h3>
                <p>Join the community to share your thoughts and ideas.</p>
              </div>
              <div className="row g-3 justify-content-center info-section">
                <div className="col-md-4 col-sm-6 col-12">
                  <div className=" text-center p-4 bg-light rounded-3">
                    <img
                      src={writingIcon}
                      alt="Write Icon"
                      className="info-icon mb-3"
                    />
                    <h5>Write Articles</h5>
                    <p>
                      Express your creativity by writing articles and sharing
                      your knowledge.
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="text-center p-4 bg-light rounded-3">
                    <img
                      src={readIcon}
                      alt="Read Icon"
                      className="info-icon mb-3"
                    />
                    <h5>Read</h5>
                    <p>
                      Explore a wide variety of articles and learn from the
                      community.
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="text-center p-4 bg-light rounded-3">
                    <img
                      src={CommunityIcon}
                      alt="Community Icon"
                      className="info-icon mb-3"
                    />
                    <h5>Community</h5>
                    <p>Engage with like-minded people and grow together.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSignedIn === true && (
            
            <div className="d-flex justify-content-center vov">
            <div className="user-section p-5 rounded-5 w-100">
              <div className="user-info2 d-flex flex-column flex-md-row justify-content-center align-items-center p-4 rounded-3 mb-4">
                <img
                  src={user.imageUrl}
                  width="100px"
                  height="100px"
                  className="rounded-circle mb-3 mb-md-0"
                  alt="User Profile"
                />
                <div className="user-details text-center text-md-start ms-md-4">
                  <h5>
                    Welcome "
                    <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                      {user.firstName}
                    </span>
                    " !!!
                  </h5>
                  <p>{user.emailAddresses[0].emailAddress}</p>
                </div>
              </div>
          
              <div className="role-selection text-center">
                <p className="lead">Select your role</p>
                {error && (
                  <p className="text-danger fs-5 font-monospace">{error}</p>
                )}
          
                <div className="role-buttons d-flex flex-column flex-md-row justify-content-center gap-4">
                  <button
                    className="role-btn d-flex flex-column align-items-center p-4"
                    value="author"
                    onClick={onSelectRole}
                  >
                    <img
                      src={AuthorIcon}
                      alt="authoricon"
                      className="mb-2"
                      width="100px"
                    />
                    <span style={{ fontWeight: "bolder" }}>Author</span>
                    <span className="text-sm text-gray-500" style={{ fontSize: "0.9rem" }}>
                      Write articles & share
                    </span>
                  </button>
          
                  <button
                    className="role-btn d-flex flex-column align-items-center p-4"
                    value="user"
                    onClick={onSelectRole}
                  >
                    <img
                      src={UserIcon}
                      alt="usericon"
                      className="mb-2"
                      width="100px"
                    />
                    <span style={{ fontWeight: "bolder" }}>User</span>
                    <span className="text-sm text-gray-500" style={{ fontSize: "0.9rem" }}>
                      Read articles & share
                    </span>
                  </button>
          
                  <button
                    className="role-btn d-flex flex-column align-items-center p-4"
                    value="admin"
                    onClick={onSelectRole}
                  >
                    <img
                      src={AdminIcon}
                      alt="adminicon"
                      className="mb-2"
                      width="100px"
                    />
                    <span style={{ fontWeight: "bolder" }}>Admin</span>
                    <span className="text-sm text-gray-500" style={{ fontSize: "0.9rem" }}>
                      Manage users & settings
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
