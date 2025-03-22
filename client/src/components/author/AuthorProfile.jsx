import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";

function AuthorProfile() {
  const { currentUser } = useContext(userAuthorContextObj);
  return (
    <div className="author-profile">
      <ul className="d-flex justify-content-around list-unstyled flex-wrap">
        <li className="nav-item">
          <NavLink
            to="articles"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link inactive-link"
            }
          >
            Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="article"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link inactive-link"
            }
          >
            Add new article
          </NavLink>
        </li>
      </ul>
      {currentUser.isActive ? (
        <div className="mt-5">
          <Outlet />
        </div>
      ) : (
        <p className="text-center text-danger mt-5">
          Your account is inactive. Please contact support.
        </p>
      )}
    </div>
  );
}

export default AuthorProfile;
