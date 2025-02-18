import React from "react";
import iconB from "../../assets/iconB.svg";

function Footer() {
  return (
    <footer className="bg-footer text-white py-4 mt-5 ">
      <div className="container">
        <div className="footer-heading">
          <h3>
            {" "}
            <img src={iconB} width="70px" />
            Logly
          </h3>
          <p>Sharing insights from all around the world</p>
        </div>

        <address className="contact-info">
          <p>Email: niheshr03@gmail.com</p>
          <p>Phone: (123) 456-7890</p>
        </address>

        <div className="footer-bottom">
          <small>
            &copy; {new Date().getFullYear()} Blog App. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
