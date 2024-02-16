import React from 'react'
// import { Link } from 'react-router-dom'


const Landing = props => {

  return (
    
    <section className="landing" >
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Random Layout</h1>
            <p className="lead">
              Connect with like minds and share the experience
            </p>
            {/* <div className="buttons">
              <Link to="/register" className="btn btn-primary landing-btn">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-light landing-btn">
                Login
              </Link>
              <Link to="/contact" className="btn btn-primary landing-btn">
                Contact Form
              </Link>
            </div> */}
          </div>
        </div>
      </section>
  )
}


export default Landing
