import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { adminContextObj } from "../../contexts/AdminContext";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { currentAdmin, setCurrentAdmin } = useContext(adminContextObj);

  async function toggleDisableEnable(userObj) {
    const updatedStatus = !userObj.isActive;
    userObj.isActive = updatedStatus;
    let res = await axios.put(
      `http://localhost:3000/admin-api/user/${userObj._id}`,
      { ...userObj }
    );
    if (res.data.message === "updated") {
      setCurrentAdmin(res.data.payload);
    }
  }

  //get all users
  async function getUsers() {
    let res = await axios.get("http://localhost:3000/admin-api/users");
    console.log("users for admin: ", res.data.payload);
    if (res.data.message === "users") {
      setUsers(res.data.payload);
      setError("");
    } else {
      setError(res.data.message);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="admin-container">
      {error.length !== 0 && <p className="admin-error">{error}</p>}

      <div className="admin-section">
        <h2 className="admin-title">Active Users</h2>
        {users.some((user) => user.isActive) ? (
          users.map(
            (user, i) =>
              user.isActive && (
                <div className="admin-user-card m-3" key={i}>
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    width="100px"
                    className="admin-user-img"
                  />
                  <p className="admin-user-name">{user.firstName}</p>
                  <p className="admin-user-role">{user.role}</p>
                  <p className="admin-user-status">Active</p>
                  <button
                    className="admin-btn admin-btn-disable"
                    onClick={() => toggleDisableEnable(user)}
                  >
                    Disable
                  </button>
                </div>
              )
          )
        ) : (
          <p className="admin-no-users">No Active Users</p>
        )}
      </div>

      <div className="admin-section mt-5">
        <h2 className="admin-title">Inactive Users</h2>
        {users.some((user) => !user.isActive) ? (
          users.map(
            (user, i) =>
              !user.isActive && (
                <div className="admin-user-card m-3" key={i}>
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    width="100px"
                    className="admin-user-img"
                  />
                  <p className="admin-user-name">{user.firstName}</p>
                  <p className="admin-user-role">{user.role}</p>
                  <p className="admin-user-status">Inactive</p>
                  <button
                    className="admin-btn admin-btn-enable"
                    onClick={() => toggleDisableEnable(user)}
                  >
                    Enable
                  </button>
                </div>
              )
          )
        ) : (
          <p className="admin-no-users">No Inactive Users</p>
        )}
      </div>
    </div>
  );
}

export default UserList;
