import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../layout/Alert";
import { createContact } from "../../actions/contact";


const CreateContact = ({ createContact }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const { name, email, description } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    await createContact(formData, navigate); // Wait for createContact action to complete
    setTimeout(() => navigate("/"), 3000); // Wait for 3 seconds before navigating
  };

  return (
    <>
      <section className="container">
        <div>
        <Alert />
        <h1 className="large text-primary">Contact Us</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Leave a message to get login access
        </p>
        </div>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              rows="10"
              cols="50"
              type="text"
              placeholder="Description"
              name="description"
              value={description}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Submit" />
        </form>
      </section>
    </>
  );
};

CreateContact.propTypes = {
  createContact: PropTypes.func.isRequired,
};

export default connect(null, { createContact })(CreateContact);
