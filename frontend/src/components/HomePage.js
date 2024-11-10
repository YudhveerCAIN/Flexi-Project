// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page-wrapper">
            <div className="window-container">
                <h1>Welcome to Expense Tracker</h1>
                <p>Manage your expenses easily with our intuitive platform.</p>
                <nav className="home-nav">
                    <ul>
                        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                        <li><Link to="/addexpense" className="nav-link">Add Expense</Link></li>
                        <li><Link to="/transactionhistory" className="nav-link">Transaction History</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default HomePage;
