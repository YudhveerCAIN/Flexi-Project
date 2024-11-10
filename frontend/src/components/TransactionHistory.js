import React, { useEffect, useState } from 'react';
import './css/TransactionHistory.css';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    // Fetch transactions from the server
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch("http://localhost:5000/transactions");
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []); // Run only once when the component is mounted

    // Edit transaction
    const editTransaction = (id) => {
        navigate(`/addexpense/${id}`);
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        try {
            await fetch(`http://localhost:5000/transactions/${id}`, { method: "DELETE" });
            setTransactions(transactions.filter((transaction) => transaction._id !== id));
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    const navigateToAddExpense = () => {
        navigate('/addexpense');
    };

    const navigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="window-container">
            <h1>Transaction History</h1>
            <div className="history-header">
                <div className="header-item">Description</div>
                <div className="header-item">Amount</div>
                <div className="header-item">Category</div>
                <div className="header-item">Type</div>
                <div className="header-item">Actions</div>
            </div>
            <div className="history-list">
                {transactions.map((transaction) => (
                    <div
                        key={transaction._id}
                        className={`history-item ${transaction.type === 'expense' ? 'expense' : 'income'}`}
                    >
                        <div className="history-details">{transaction.description}</div>
                        <div className="history-details">${transaction.amount.toFixed(2)}</div>
                        <div className="history-details">{transaction.category}</div>
                        <div className="history-details">{transaction.type === 'expense' ? 'Expense' : 'Income'}</div>
                        <div className="history-actions">
                            <button className="edit" onClick={() => editTransaction(transaction._id)}>Edit</button>
                            <button className="delete" onClick={() => deleteTransaction(transaction._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-container">
                <div className="add-expense-button-container">
                    <button className="add-expense-button" onClick={navigateToAddExpense}>
                        Add Expense
                    </button>
                </div>
                <div className="go-home-button-container">
                    <button className="go-home-button" onClick={navigateToHome}>
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
