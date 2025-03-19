// Global Variables
let currentPage = 'home';
let userData = {};
let walletAddress = {
  USDT: '0xC17922B9fE08Dc675Cd2906990bEB62d17ba8A7C',
  BTC: 'bc1qg80rgcutu86vzl7pnldf0emn2da5a8m0zlc6jm'
};

// Function to update the current page
function updatePage(page) {
  currentPage = page;
  switch (page) {
    case 'home':
      showHomePage();
      break;
    case 'login':
      showLoginPage();
      break;
    case 'deposit':
      showDepositPage();
      break;
    case 'withdrawal':
      showWithdrawalPage();
      break;
    case 'transactions':
      showTransactionsPage();
      break;
    case 'user-account':
      showUserAccountPage();
      break;
    case 'referral-link':
      showReferralLinkPage();
      break;
    case 'mining-page':
      showMiningPage();
      break;
    default:
      console.error('Invalid page');
  }
}

// Function to show the home page
function showHomePage() {
  const homePage = document.getElementById('home-page');
  homePage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the login page
function showLoginPage() {
  const loginPage = document.getElementById('login-page');
  loginPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the deposit page
function showDepositPage() {
  const depositPage = document.getElementById('deposit-page');
  depositPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the withdrawal page
function showWithdrawalPage() {
  const withdrawalPage = document.getElementById('withdrawal-page');
  withdrawalPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the transactions page
function showTransactionsPage() {
  const transactionsPage = document.getElementById('transactions-page');
  transactionsPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the user account page
function showUserAccountPage() {
  const userAccountPage = document.getElementById('user-account-page');
  userAccountPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the referral link page
function showReferralLinkPage() {
  const referralLinkPage = document.getElementById('referral-link-page');
  referralLinkPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to show the mining page
function showMiningPage() {
  const miningPage = document.getElementById('mining-page');
  miningPage.style.display = 'block';
  const otherPages = document.querySelectorAll('.page');
  otherPages.forEach(page => {
    page.style.display = 'none';
  });
}

// Function to handle login form submission
function handleLoginFormSubmission(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // TO DO: Implement login logic here
  console.log(`Username: ${username}, Password: ${password}`);
}

// Function to handle deposit form submission
function handleDepositFormSubmission(event) {
  event.preventDefault();
  const depositAmount = document.getElementById('deposit-amount').value;
  const depositMethod = document.getElementById('deposit-method').value;
  // TO DO: Implement deposit logic here
  console.log(`Deposit Amount: ${depositAmount}, Deposit Method: ${depositMethod}`);
}

// Function to handle withdrawal form submission
function handleWithdrawalFormSubmission(event) {
  event.preventDefault();
  const withdrawalAmount = document.getElementById('withdrawal-amount').value;
  const withdrawalMethod = document.getElementById('withdrawal-method').value;
  // TO DO: Implement withdrawal logic here
  console.log(`Withdrawal Amount: ${withdrawalAmount}, Withdrawal Method: ${withdrawalMethod}`);
}

// Function to handle transactions table updates
function updateTransactionsTable() {
  // TO DO: Implement transactions table update logic here
  console.log('Transactions table updated');
}