import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import TypeWrite from "../../assets/typewriter.png";

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  //function to signout
  async function handleSignout() {
    await signOut();
    localStorage.removeItem("currentuser");
    localStorage.clear();
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <div className="header-container mb-3">
      <nav className="navbar d-flex justify-content-between align-items-center p-2 shadow">
        <div className="logo-container d-flex justify-content-center align-items-center">
          <Link to="">
            <img src={TypeWrite} alt="logo" className="logo" href="#" />
          </Link>
        </div>
        <ul className="nav-links d-flex justify-content-around align-items-center m-1 list-unstyled">
          {!isSignedIn ? (
            <>
              <li>
                <Link to="" className="nav-item link me-4">
                  Home
                </Link>
              </li>
              <li>
                <Link to="signin" className="nav-item link me-4">
                  Signin
                </Link>
              </li>
              <li>
                <Link to="signup" className="nav-item link me-4">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <div className="user-info d-flex align-items-center">
              <img
                src={user.imageUrl}
                alt=""
                width="45px"
                className="user-avatar rounded-circle border"
              />
              <div className="user-details">
                <p className="user-role text-center  rounded-3 mb-1 p-1">
                  {currentUser.role}
                </p>
                <p className="user-name mb-0 fw-bold">{user.firstName}</p>
              </div>
              <button
                className="btn-signout btn btn-outline-danger"
                onClick={handleSignout}
              >
                Signout
              </button>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
