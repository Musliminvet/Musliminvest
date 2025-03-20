const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/musliminvest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema for the contact form
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create a model for the contact form
const Contact = mongoose.model('Contact', contactSchema);

// Define the schema for the user registration
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create a model for the user registration
const User = mongoose.model('User', userSchema);

// Define the schema for the login history
const loginHistorySchema = new mongoose.Schema({
  userId: String,
  loginTime: Date,
});

// Create a model for the login history
const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

// Define the schema for the transaction history
const transactionHistorySchema = new mongoose.Schema({
  userId: String,
  transactionTime: Date,
  transactionAmount: Number,
});

// Create a model for the transaction history
const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

// Define the schema for the wallet
const walletSchema = new mongoose.Schema({
  userId: String,
  balance: Number,
});

// Create a model for the wallet
const Wallet = mongoose.model('Wallet', walletSchema);

// Define the schema for the investment
const investmentSchema = new mongoose.Schema({
  userId: String,
  investmentAmount: Number,
  investmentTime: Date,
});

// Create a model for the investment
const Investment = mongoose.model('Investment', investmentSchema);

// Export the models
module.exports = {
  Contact,
  User,
  LoginHistory,
  TransactionHistory,
  Wallet,
  Investment,
};