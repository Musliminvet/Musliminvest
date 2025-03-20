import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.get('https://musliminvet.github.io/Musliminvest/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get('https://musliminvet.github.io/Musliminvest/api/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    axios.post('https://musliminvet.github.io/Musliminvest/api/login', { email, password })
      .then(response => {
        setCurrentUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    axios.post('https://musliminvet.github.io/Musliminvest/api/register', { name, email, password })
      .then(response => {
        setCurrentUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeposit = (event) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    axios.post('https://musliminvet.github.io/Musliminvest/api/deposit', { amount, userId: currentUser._id })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleWithdrawal = (event) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    axios.post('https://musliminvet.github.io/Musliminvest/api/withdrawal', { amount, userId: currentUser._id })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Muslim Invest</h1>
      {currentUser ? (
        <div>
          <h2>Welcome, {currentUser.name}!</h2>
          <form onSubmit={handleDeposit}>
            <label>Deposit Amount:</label>
            <input type="number" name="amount" />
            <button type="submit">Deposit</button>
          </form>
          <form onSubmit={handleWithdrawal}>
            <label>Withdrawal Amount:</label>
            <input type="number" name="amount" />
            <button type="submit">Withdrawal</button>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin}>
            <label>Email:</label>
            <input type="email" name="email" />
            <label>Password:</label>
            <input type="password" name="password" />
            <button type="submit">Login</button>
          </form>
          <form onSubmit={handleRegister}>
            <label>Name:</label>
            <input type="text" name="name" />
            <label>Email:</label>
            <input type="email" name="email" />
            <label>Password:</label>
            <input type="password" name="password" />
            <button type="submit">Register</button>
          </form>
        </div>
      )}
    </div>
  );
}