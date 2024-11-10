import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import TransactionHistory from './components/TransactionHistory';

const App = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch transactions from the backend when the component mounts
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:5000/transactions');
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data); // Set transactions from backend
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
                path="/addexpense"
                element={<AddExpense transactions={transactions} setTransactions={setTransactions} />}
            />
            <Route
                path="/addexpense/:id"
                element={<AddExpense transactions={transactions} setTransactions={setTransactions} />}
            />
            <Route
                path="/transactionhistory"
                element={<TransactionHistory transactions={transactions} />}
            />
        </Routes>
    );
};

export default App;
