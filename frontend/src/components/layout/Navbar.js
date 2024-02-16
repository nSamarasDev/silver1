import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const authLinks = (
    <ul>
      <li>
        <Link
          to="/posts"
          className={location.pathname === "/posts" ? "current" : ""}
        >
          <i className="fa fa-comments" />
          {isOpen && " Discussion"}
        </Link>
      </li>

      <li>
        <Link
          to="/profiles"
          className={location.pathname === "/profiles" ? "current" : ""}
        >
          <i className="fa fa-address-card-o" />
          {isOpen && " Profiles"}
        </Link>
      </li>

      <li>
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "current" : ""}
        >
          <i className="fas fa-user" />
          {isOpen && " Dashboard"}
        </Link>
      </li>
      <li>
        <a onClick={logout} href="/login">
          <i className="fas fa-sign-out-alt"></i>
          {isOpen && " Logout"}
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link
          to="/profiles"
          className={location.pathname === "/profiles" ? "current" : ""}
        >
          <i className="fa fa-address-card-o" />
          {isOpen && " Profiles"}
        </Link>
      </li>
      <li>
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "current" : ""}
        >
          <i className="fa fa-envelope-o" />
          {isOpen && " Contact"}
        </Link>
      </li>
      <li>
        <Link
          to="/register"
          className={location.pathname === "/register" ? "current" : ""}
        >
          <i className="fa fa-thumb-tack" />
          {isOpen && " Register"}
        </Link>
      </li>
      <li>
        <Link
          to="/login"
          className={location.pathname === "/login" ? "current" : ""}
        >
          <i className="fa fa-code-fork" />
          {isOpen && " Login"}
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className={`navbar bg-dark ${isOpen ? 'open' : 'closed'}`}>
      <div onClick={toggleNavbar}> {/* Toggle button */}
        {isOpen ? (
          <i className="fas fa-times close-icon"></i>
        ) : (
          <i className="fas fa-bars"></i>
        )}
      </div>
      <h1>
        <Link to="/" className={location.pathname === "/" ? "current" : ""}>
          {!isOpen && <i className="fas fa-code"></i>}
          {isOpen && (
            <Fragment>
              <i className="fas fa-code"></i> Random
            </Fragment>
          )}
        </Link>
      </h1>
      {!loading && (
        <Fragment>
          {isAuthenticated ? authLinks : guestLinks}
          {isOpen && <div className="tray-overlay" onClick={toggleNavbar}></div>} {/* Close tray when clicking outside */}
        </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
