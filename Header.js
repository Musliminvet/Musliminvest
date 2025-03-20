import React from 'react';

function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="https://musliminvet.github.io/Musliminvest/">Muslim Invest</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="https://musliminvet.github.io/Musliminvest/">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://musliminvet.github.io/Musliminvest/about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://musliminvet.github.io/Musliminvest/contact">Contact</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://musliminvet.github.io/Musliminvest/api/users">Users</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://musliminvet.github.io/Musliminvest/api/register">Register</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://musliminvet.github.io/Musliminvest/api/login">Login</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}