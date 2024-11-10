import React, { useState, useEffect } from 'react';
import './css/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios to fetch data from backend

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [lastTransaction, setLastTransaction] = useState(null);
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        // Fetch transactions from the backend (replace with your API endpoint)
        axios.get('http://localhost:5000/transactions')  // API endpoint to fetch transactions
            .then((response) => {
                const fetchedTransactions = response.data;
                setTransactions(fetchedTransactions);

                // Calculate balance based on fetched transactions
                const newBalance = fetchedTransactions.reduce((total, transaction) => {
                    return transaction.type === 'expense' ? total - transaction.amount : total + transaction.amount;
                }, 0);
                setBalance(newBalance);

                // Get the last transaction
                const latestTransaction = fetchedTransactions.length > 0 ? fetchedTransactions[fetchedTransactions.length - 1] : null;
                setLastTransaction(latestTransaction);
            })
            .catch((error) => {
                console.error("Error fetching transactions:", error);
            });
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Dashboard</h1>
            <div className="dashboard-summary">
                <div className={`summary-item ${balance < 0 ? 'negative-balance' : 'positive-balance'}`}>
                    <h3>Total Balance</h3>
                    <p>${Math.abs(balance).toFixed(2)}</p>
                </div>

                <div
                    className={`summary-item ${lastTransaction ? lastTransaction.type : ''}`}
                    title="Last Transaction"
                >
                    <h3>Last Transaction</h3>
                    {lastTransaction ? (
                        <p>${lastTransaction.amount.toFixed(2)}</p>
                    ) : (
                        <p>No transactions available</p>
                    )}
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/addexpense">Add Expense</Link>
            </div>

            <div className="dashboard-button">
                <button onClick={() => navigate('/')}>Home</button>
            </div>
        </div>
    );
};

export default Dashboard;
