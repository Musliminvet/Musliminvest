import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Container() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center mb-5">About Us</h1>
            <p className="text-justify">
              Muslim Invest is a financial technology company that provides
              investment opportunities for Muslims around the world. Our
              mission is to make investing easy, accessible, and halal.
            </p>
            <p className="text-justify">
              Our team consists of experienced professionals in the finance
              and technology industries. We are committed to providing the
              best possible experience for our users.
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-4">
            <h5>Our Services</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#">Investment Opportunities</a>
              </li>
              <li>
                <a href="#">Financial Planning</a>
              </li>
              <li>
                <a href="#">Wealth Management</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Why Choose Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#">Expertise</a>
              </li>
              <li>
                <a href="#">Trust</a>
              </li>
              <li>
                <a href="#">Innovation</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Get Started</h5>
            <p>
              Ready to start investing? Sign up for an account today!
            </p>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Container;