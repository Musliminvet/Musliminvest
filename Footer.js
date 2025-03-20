import React from 'react';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li><a href="https://musliminvet.github.io/Musliminvest/about">About Us</a></li>
              <li><a href="https://musliminvet.github.io/Musliminvest/contact">Contact Us</a></li>
              <li><a href="https://musliminvet.github.io/Musliminvest/api/users">Users</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li><a href="https://musliminvet.github.io/Musliminvest/api/register">Register</a></li>
              <li><a href="https://musliminvet.github.io/Musliminvest/api/login">Login</a></li>
              <li><a href="https://musliminvet.github.io/Musliminvest/contact">Support</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Copyright</h5>
            <p>&copy; 2023 Muslim Invest. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;