import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";

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
    <div>
      <nav className="header d-flex justify-content-between align-items-center p-1">
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/">
            <img
              src="https://cdn.worldvectorlogo.com/logos/svg-2.svg"
              alt="logo"
              className="logo"
            />
          </Link>
        </div>
        <ul className="d-flex justify-content-around align-items-center m-1 list-unstyled header-links">
          {!isSignedIn ? (
            <>
              <li>
                <Link to="" className="link me-4">
                  Home
                </Link>
              </li>
              <li>
                <Link to="signin" className="link me-4">
                  Signin
                </Link>
              </li>
              <li>
                <Link to="signup" className="link me-4">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <div className="">
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col d-flex  align-items-center">
                  <img
                    src={user.imageUrl}
                    alt=""
                    width="40px"
                    className="rounded-circle"
                  />
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                  <p className=" text-center bg-success-subtle rounded-3 mb-0 p-1">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col d-flex justify-content-center align-items-center">
                  <p className="mb-0 mt-1 fw-bold user-name">
                    {user.firstName}
                  </p>
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-outline-danger signout-btn"
                    onClick={handleSignout}
                  >
                    Signout
                  </button>
                </div>
              </div>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
